import React, {Component} from 'react'
import Link from 'next/link'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import calendarSlotsGql from '../graphql/calendarSlots.gql'
import contentSchedulesGql from '../graphql/contentSchedules.gql'
import PostTabs from '../PostTabs/index'
import {Button, Grid, Icon, Modal} from 'semantic-ui-react'
import {Element} from 'react-scroll'
import Campaigns from '../../Campaigns'
import Notification from '../../Notification'
import Loader from '../../Loader/index'
import TopPanel from '../../TopPanel'
import Stats from '../../TopPanel/Stats'
import AggregateCounts from '../../TopPanel/AggregateCounts'
import { Droppable } from 'react-drag-and-drop'
import moment from 'moment'

import { months, days } from '../../../libraries/constants'
import {getCorrectHours, calendarTimeAndDayWithOffset} from '../../../libraries/helpers'

import './styles.scss'
import ApproveAllButton from "../../ApproveAllButton/index";

class PostList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      createPostOpen: false,
      dateTime: '',
      wholeDayEnable: false,
      rightPanelOpen: false,
      rightPanelCatId: '',
      currentDateTime: new Date(),
      contentSchedulesItem: null,
    }
  }


  getTimelineObject = () => {
    const {calendarSlotsFind, contentSchedulesFind} = this.props
    const {currentDateTime} = this.state

    // Get list of available dates for the timeline
    const availableDates = this.getDaysInMonth(currentDateTime.getDate(), currentDateTime.getMonth(), currentDateTime.getFullYear())

    // Get list of calendarSlot times
    let postTimes = new Map()
    let slots = [...calendarSlotsFind.edges]
    slots.sort((a,b) => {
      return a.node.time - b.node.time
    })
    slots.map(calendarSlot => {
      const {day, time} = calendarTimeAndDayWithOffset(calendarSlot.node, 0)
      if (!postTimes.has(time)) {
        postTimes.set(time, new Map())
      }
      postTimes.get(time).set(day, calendarSlot)
    })

    // Add each calendarSlot time to the availableDates (with timezone adjustments)
    for (let [key, value] of availableDates) {
      for (let [time, dayMap] of postTimes) {
        let postTime = new Date(key)
        let day = (postTime.getDay() === 0) ? 6 : (postTime.getDay() - 1)
        let postDate = key

        // Make timezone adjustment
        let newTime = time - postTime.getTimezoneOffset()
        if (newTime < 0) {
          newTime += 1440
          day -= 1
          postTime.setDate(postTime.getDate() - 1)
          postDate = postTime.toString()
        } else if (newTime > 1440) {
          newTime -= 1440
          day += 1
          postTime.setDate(postTime.getDate() + 1)
          postDate = postTime.toString()
        }
        if (day === 7) day = 0
        if (day === -1) day = 6

        postTime.setHours(Math.floor(newTime / 60))
        postTime.setMinutes(newTime % 60)
        let calendarSlot = dayMap.get(day)
        let timelineMap = new Map()
        timelineMap.set('calendarSlot', calendarSlot)
        timelineMap.set('contentSchedules', [])
        if (availableDates.has(postDate)) {
          availableDates.get(postDate).set(postTime.toString(), timelineMap)
        }
      }
    }

    // Add contentSchedules to the availableDates
    if (contentSchedulesFind.edges && contentSchedulesFind.edges.length) {
      contentSchedulesFind.edges.map((e) => {
        let postDateTime = new Date((new Date(e.node.publishAt).valueOf()) - (new Date(e.node.publishAt).getTimezoneOffset() * 60000))
        let postDate = new Date(postDateTime.toString())
        postDate.setHours(12, 0, 0, 0)
        if (availableDates.has(postDate.toString())) {
          if (availableDates.get(postDate.toString()).has(postDateTime.toString())) {
            let schedules = availableDates.get(postDate.toString()).get(postDateTime.toString()).get('contentSchedules')
            schedules.push(e.node)
            availableDates.get(postDate.toString()).get(postDateTime.toString()).set('contentSchedules', schedules)
          } else {
            let map = new Map()
            map.set('contentSchedules', [e.node])
            availableDates.get(postDate.toString()).set(postDateTime.toString(), map)
          }
        }
      })
    }

    return availableDates
  }

  getDaysInMonth = (currentdate, month, year) => {
    const {wholeDayEnable} = this.state
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    let date
    if (month !== currentMonth || year !== currentYear) {
      date = new Date(year, month, 1)
    } else {
      if (!wholeDayEnable) {
        date = new Date(year, month, currentdate)
      } else {
        date = new Date(year, month, 1)
      }
    }

    const days = new Map()
    while (date.getMonth() === month) {
      date.setHours(12)
      let dateString = new Date(date)
      days.set(dateString.toString(), new Map())
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  // Returns the ordinal (st, nd, rd, th) for a day
  getOrdinal = (dayInt) => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = dayInt % 100
    return (s[(v - 20) % 10] || s[v] || s[0])
  }

  onOpenModal = (dateTime) => {
    this.setState({
      dateTime,
      createPostOpen: true
    })
  }

  onCloseModal = () => {
    this.setState({
      dateTime: '',
      createPostOpen: false
    })
  }

  onTogglePanel = (catId) => {
    console.log('Right panel open/close')
    if (catId === false) {
      this.setState({
        rightPanelOpen: false,
        rightPanelCatId: ''
      })
    } else {
      this.setState({
        rightPanelOpen: catId !== this.state.rightPanelCatId,
        rightPanelCatId: catId !== this.state.rightPanelCatId ? catId : '',
      })
    }
  }

  renderHeader = () => {
    const {currentDateTime, wholeDayEnable} = this.state
    const wholeCurrentMonth = wholeDayEnable && (currentDateTime.getMonth() === new Date().getMonth())
    return (
      <div className='select-month'>
        <Icon name='triangle left' onClick={() => this.changeMonth(false)} />
        <span className='month-label'>
          {months[currentDateTime.getMonth()]} '{`${currentDateTime.getYear()}`.substr(1, 3)} {wholeCurrentMonth && `(all)`}
        </span>
        <Icon name='triangle right' onClick={() => this.changeMonth(true)}/>
      </div>
    )
  }

  changeMonth = (forward) => {
    let {currentDateTime, wholeDayEnable} = this.state

    if (forward === true) {
      if (currentDateTime.getMonth() === new Date().getMonth() && wholeDayEnable === true) {
        wholeDayEnable = false
      } else {
        currentDateTime.setMonth(currentDateTime.getMonth() + 1)
        if (currentDateTime.getMonth() === new Date().getMonth()) {
          wholeDayEnable = true
        }
      }
    } else if (forward === false) {
      if (currentDateTime.getMonth() === new Date().getMonth() && wholeDayEnable === false) {
        wholeDayEnable = true
      } else {
        currentDateTime.setMonth(currentDateTime.getMonth() - 1)
        if (currentDateTime.getMonth() === new Date().getMonth()) {
          wholeDayEnable = false
        }
      }
    }

    this.setState({
      wholeDayEnable,
      currentDateTime
    })
  }

  renderPostTabs (dateTimeMap, categories = []) {
    let postTabs = []
    for (let [dateTime, dataMap] of dateTimeMap) {
      dateTime = new Date(dateTime)
      let key = `${dateTime.getDay()}_${dateTime.getTime()}`
      let className = 'post-item-wrapper'
      if (dataMap.get('calendarSlot') || dataMap.get('contentSchedules').length !== 0) {
        if (dataMap.get('contentSchedules').length) {
          className += ' ' + dataMap.get('contentSchedules')[0].moderationStatus.toLowerCase()
          dataMap.get('contentSchedules').map(e => {
            key += e.moderationStatus
          })
        }
        postTabs.push(
          <Element
            key={key}
            id={`day_${dateTime.getDate().toString()}`}
            name={`day_${dateTime.getDate().toString()}`}
          >
            <PostTabs
              key={key}
              _key={key}
              className={className}
              calendarSlot={dataMap.get('calendarSlot')}
              contentSchedules={dataMap.get('contentSchedules')}
              dateTime={dateTime}
              onShowCampaign={this.onTogglePanel}
              socialId={this.props.socialId}
              categories={categories}
            />
          </Element>
        )
      } else {
        postTabs.push(this.renderEmptyPostitem(dateTime))
      }
    }

    return postTabs
  }

  onDrop = (data, dateTime) => {
    const content = JSON.parse(data.post)
    const contentSchedulesItem = {
      twitter: {
        calendarSlot: null,
        content: content,
        moderationStatus: 'WAITING',
        socialProfile: {
          id: this.props.socialId,
          socialNetwork: 'TWITTER'
        },
        type: 'twitter',
      }
    }
    this.setState({
      contentSchedulesItem,
      dateTime,
      createPostOpen: true,
    })
  }

  renderEmptyPostitem = (dateTime) => {
    return (<Droppable
      key={`${dateTime.getDay() + dateTime.getTime()}`}
      types={['post']} // <= allowed drop types
      onDrop={(post) => this.onDrop(post, dateTime)}
    >
      <div className='post-item-wrapper empty-item'>
        <div className='nothing-item-content'>
          <div className='nothing-empty' />
          <div className='nothing-text'>
            No campaign selected for {getCorrectHours((dateTime.getHours() * 60) + dateTime.getMinutes())}.
          </div>
          <div className='nothing-actions'>
            <Link prefetch href='/app/calendar'><a className='ui button goto-calendar success empty'>Go to Calendar</a></Link>
            <Button className='create-post success' onClick={() => this.onOpenModal(dateTime)}>Create Post</Button>
          </div>
        </div>
      </div>
    </Droppable>)
  }

  calculateStats = (compareDates) => {
    const { socialId } = this.props
    const { currentDateTime } = this.state

    let y = currentDateTime.getFullYear()
    let m = currentDateTime.getMonth()
    let scheduled = 0
    let toapprove = 0
    let sent = 0
    const availableDates = this.getTimelineObject()
    for (let [date, dateTimeMap] of availableDates) {
      for (let [dateTime, dataMap] of dateTimeMap) {
        if (dataMap.get('calendarSlot') || dataMap.get('contentSchedules').length !== 0) {
          const contentSchedules = dataMap.get('contentSchedules')
          contentSchedules.map(schedule => {
            if(schedule.publishingStatus === 'PUBLISHED') {
              sent++
            } else {
              if (new Date(schedule.publishAt) > new Date()) {
                if (schedule.moderationStatus === 'WAITING')
                  toapprove++

                if (schedule.moderationStatus === 'ACCEPTED')
                  scheduled++
              }
            }
          })
        }
      }
    }

    return [
        {
          'value' : scheduled,
          'label' : 'scheduled'
        },
        {
          'value' : toapprove,
          'label' : 'to approve'
        },
        {
          'value' : sent,
          'label' : 'sent'
        },
        {
          'divider' : true
        },
        <AggregateCounts key='aggregates' socialId={socialId} compareDates={{
          currentWeek: {
            dateStart: moment(new Date(y,m, 1)).format('YYYY-MM-DD'),
            dateEnd: moment(new Date(y,m+1, 1)).format('YYYY-MM-DD')
          },
          compareWeek: {
            dateStart: moment(new Date(y, m-1, 1)).format('YYYY-MM-DD'),
            dateEnd: moment(new Date(y, m, 0)).format('YYYY-MM-DD')
          }
        }} />,

      ]
  }

  loadMore = (pageNumber) => {
    const { calendarSlotsFind, contentSchedulesFind, oldEndSlotsCursor, endSlotsCursor, oldEndContentCursor, endContentCursor, loading } = this.state
    if (endContentCursor === oldEndContentCursor || loading) {
      return
    }
    if (endSlotsCursor === oldEndSlotsCursor || loading) {
      return
    }

    this.setState({
      loading: true
    })

    this.props.client.query({
      query: gql`${calendarSlotsGql}`,
      skip: !this.props.socialId,
      variables: {
        profileIds: [this.props.socialId],
        type: 'WEEKLY',
        after: endSlotsCursor
      }
    }).then((graphQLResult) => {
      const { calendarSlots_find, error } = graphQLResult
      if (error) {
        if (error.length > 0) {
          Notification.error(error[0].message)
        }
      } else {
        this.setState({
          posts: [...calendarSlotsFind, ...calendarSlots_find.edges],
          hasMore: calendarSlots_find.pageInfo.hasNextPage,
          endSlotsCursor: calendarSlots_find.pageInfo.endCursor,
          oldEndSlotsCursor: endSlotsCursor,
          loading: false
        })
      }
    }).catch((error) => {
      Notification.error(error.message)
    })

    this.props.client.query({
      query: gql`${contentSchedulesGql}`,
      skip: !this.props.socialId,
      variables: {
        profileIds: [this.props.socialId],
        after: endContentCursor
      }
    }).then((graphQLResult) => {
      const { contentSchedules_find, error } = graphQLResult
      if (error) {
        if (error.length > 0) {
          Notification.error(error[0].message)
        }
      } else {
        this.setState({
          posts: [...contentSchedulesFind, ...contentSchedules_find.edges],
          hasMore: contentSchedules_find.pageInfo.hasNextPage,
          endContentCursor: contentSchedules_find.pageInfo.endCursor,
          oldEndContentCursor: endContentCursor,
          loading: false
        })
      }
    }).catch((error) => {
      Notification.error(error.message)
    })
  }

  render () {
    if (this.props.calendarSlotsFind.loading || this.props.contentSchedulesFind.loading) {
      return <Loader />
    }

    let {rightPanelOpen, rightPanelCatId, currentDateTime} = this.state
    let renderElements = []
    const categories = this.props.calendarSlotsFind.edges.map(slot => slot.node.category)
    const availableDates = this.getTimelineObject()
    for (let [date, dateTimeMap] of availableDates) {
      date = new Date(date)
      renderElements.push(
        <div className='post-item' key={date.toString()}>
          <div className='post-date'>
            <div>{days[date.getDay()]}</div>
            <div>{date.getDate() + this.getOrdinal(date.getDate())}</div>
          </div>
          {this.renderPostTabs(dateTimeMap, categories)}
        </div>
      )
    }

    let rightPanelWidth = 5
    console.log(process.env.BROWSER)
    if (process.env.BROWSER) {
      if (window && window.innerWidth < 1025) {
        rightPanelWidth = 4
      }
    }

    return [
      <Grid centered id='posts-container' key='content'>
        <Grid.Row columns={2} className='content-row'>
          <Grid.Column mobile={16} tablet={rightPanelOpen ? 8 : 13} computer={rightPanelOpen ? 8 : 12} largeScreen={rightPanelOpen ? 8 : 10} widescreen={8} className='conetnt-row-column'>

            <div className='no-margin no-padding content-item-list' id='posts-wrapper'>
              {renderElements}
            </div>

            {this.state.createPostOpen && <Modal
              open={this.state.createPostOpen}
              onClose={this.onCloseModal}
              className='post-item'
              size='small'
            >
              <Modal.Content scrolling>
                <PostTabs
                  key={0}
                  _key={0}
                  contentSchedules={this.state.contentSchedulesItem || []}
                  dateTime={new Date(this.state.dateTime)}
                  onShowCampaign={this.onTogglePanel}
                  socialId={this.props.socialId}
                  onCloseModal={this.onCloseModal}
                  categories={categories}
                />
              </Modal.Content>
            </Modal>}
          </Grid.Column>
          {rightPanelOpen && <Campaigns
            isMulti
            open={rightPanelOpen}
            mobile={16}
            width={rightPanelWidth}
            socialId={this.props.socialId}
            categoryId={rightPanelCatId}
            onTogglePanel={this.onTogglePanel}
          />}
        </Grid.Row>
      </Grid>,
      <TopPanel key='toppanel'
        leftBlock={this.renderHeader()}
        rightBlock={
          <div className='nothing-actions'>
            <Button className='success empty' size={'mini'} icon>AUTOCOMPLETE</Button>
            <ApproveAllButton socialProfileId={this.props.socialId} startDate={Array.from(availableDates.keys())[0]} endDate={Array.from(availableDates.keys()).pop()} />
          </div>
        }
        middleBlock={
          <Stats stats={this.calculateStats()}/>
        }
      />
    ]
  }
}

export default compose(
  graphql(gql`${calendarSlotsGql}`, {
    options: (props) => ({
      skip: !props.socialId,
      variables: {
        profileIds: [props.socialId],
        type: 'WEEKLY'
      }
    }),
    props: ({data: { calendarSlots_find, loading, error }}) => ({ calendarSlotsFind: {...calendarSlots_find, loading, error}})
  }),
  graphql(gql`${contentSchedulesGql}`, {
    options: (props) => ({
      skip: !props.socialId,
      variables: {
        profileIds: [props.socialId]
      }
    }),
    props: ({data: { contentSchedules_find, loading, error }}) => ({ contentSchedulesFind: {...contentSchedules_find, loading, error}})
  }))(PostList)
