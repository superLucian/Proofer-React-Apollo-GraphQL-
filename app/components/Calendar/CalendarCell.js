import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Notification from '../Notification'
import ColorPickerCell from './ColorPickerCell'
import ColorNames from './consts/color.json'
import persist from '../../libraries/persist'
import { Icon, Table, Popup, Button, Input, Modal, Confirm, Image } from 'semantic-ui-react'
import TimePicker from 'rc-time-picker'
import moment from 'moment'

// import Freshness from '../Freshness'

import Sun from '../../static/images/sun.svg'
import Afternoon from '../../static/images/afternoon.svg'
import Morning from '../../static/images/morning.svg'
import Night from '../../static/images/night.svg'

import {isEmpty, getCorrectHours, hexToRGB, calendarTimeAndDayWithOffset} from '../../libraries/helpers'

import { createCalendarSlotMutation, updateCalendarSlotMutation, deleteCalendarSlotMutation, editCalendarRowTimeMutation } from './graphql/calendarMutations'
import { createCategoryMutation } from './graphql/categoryMutations'
import { getCategorybySocialIdQuery } from './graphql/categoryQueries'
import { calendarSlotsFindQuery } from './graphql/contentQueries';
import calendarSlotsGql from '../Posts/graphql/calendarSlots.gql'

import './styles/rc-time-picker.scss'

const format = 'HH:mm'

class CalendarCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowPopup: false,
      categories: this.props.categories,
      categoryName: '',
      categoryColor: '#36BF99',
      cellTime: this.props.cellTime,
      timePickerOpen: false,
      confirmOpen: false
    }
  }

  getCalendarTime = (slottime) => {
    return parseInt(moment(slottime).format('HH'), 10) * 60 + parseInt(moment(slottime).format('mm'), 10)
  }

  onCellUpdate = (calendarSlotDay, calendarSlotTime, slotDetail, data) => {
    const selectedTime = this.getCalendarTime(calendarSlotTime)
    const draggedData = data.node // JSON.parse(data['content'])
    console.log(draggedData)
    this.props.onCalendarTableUpdate(selectedTime, draggedData, calendarSlotDay)
    if (isEmpty(slotDetail)) {
      this.onCreateCalendarSlot(calendarSlotDay, selectedTime, draggedData)
    } else {
      this.onEditCalendarSlot(calendarSlotDay, selectedTime, slotDetail.id, draggedData)
    }
  }

  onCreateCalendarSlot = (calendarSlotDay, calendarSlotTime, category) => {
    const socialProfileId = this.props.socialId
    const calendarSlotType = 'WEEKLY'
    const categoryId = category.id
    const {day, time} = calendarTimeAndDayWithOffset({day: calendarSlotDay, time: calendarSlotTime}, - new Date().getTimezoneOffset())
    this.props.createCalendarSlot(day, time, calendarSlotType, categoryId, socialProfileId)
    .then((data) => {
      Notification.success('Create Calendarslot is success.')
    })
  }

  onEditCalendarSlot = (calendarSlotDay, calendarSlotTime, calendarSlotId, category) => {
    const calendarSlotType = 'WEEKLY'
    const categoryId = category.id
    const {day, time} = calendarTimeAndDayWithOffset({day: calendarSlotDay, time: calendarSlotTime}, - new Date().getTimezoneOffset())
    this.props.editCalendarSlot(calendarSlotId, day, time, calendarSlotType, categoryId)
    .then((data) => {
      Notification.success('Edit Calendarslot is success.')
    })
  }

  onDelEvent = (time) => {
    time = this.getCalendarTime(time)
    const {slot, slots} = this.props
    let newSlots = slots
    delete newSlots[time]
    this.setState({confirmOpen: false})
    this.props.onSlotsUpdate(newSlots)
    Object.keys(slot).forEach((day) => {
      if (slot[day].id !== undefined) {
        this.props.deleteCalendarSlot({ id: slot[day].id })
          .then((data) => {
            Notification.success('Remove Calendar Slot is success.')
          })
          .catch((err) => {
            console.log(err)
            this.props.onSlotsUpdate(slots)
          })
      }
    })
  }

  onDeleteCalendarSlot = (id) => {
    const cellTime = this.state.cellTime
    const slots = this.props.slots
    const copySlots = slots
    slots[cellTime][this.props.day] = {}
    this.props.onSlotsUpdate(slots)
    this.props.deleteCalendarSlot({ id })
    .then((data) => {
      Notification.success('Remove Calendar Slot is success.')
    })
    .catch((err) => {
      console.log(err)
      this.props.onSlotsUpdate(copySlots)
    })
  }

  onTimeUpdate = (value) => {
    if (value) {
      this.setState({
        cellTime: this.getCalendarTime(value)
      })
    }
  }

  onSaveRow = () => {
    const cellTime = this.props.cellTime
    const newTime = this.state.cellTime
    const slots = this.props.slots
    const oldDays = slots[cellTime]
    const calendarSlotIds = []

    this.setState({timePickerOpen: false})
    if (cellTime !== newTime) {
      Object.keys(oldDays).forEach((day) => {
        if (oldDays[day].id) {
          oldDays[day].time = newTime
          calendarSlotIds.push(oldDays[day].id)
        }
      })
      slots[newTime] = oldDays
      delete slots[cellTime]
      Object.keys(slots).sort()

      this.props.onSlotsUpdate(slots)

      const {time} = calendarTimeAndDayWithOffset({time: newTime, day: 0}, -new Date().getTimezoneOffset())
      this.props.editCalendarRowTime({
        calendarSlotIds,
        newTime: time
      }).then((data) => {
        Notification.success('Update Calendar Slot is success.')
      })
    }
  }

  handleOpen = () => {
    this.setState({ isShowPopup: true })
  }

  handleClose = () => {
    this.setState({ isShowPopup: false })
  }

  onCategoryCreate = () => {
    let {searchTerm, isOpen, categoryColor} = this.state

    const socialProfileId = persist.willGetCurrentSocialProfile()

    if (searchTerm !== '') {
      this.props.createCategory({categoryName: searchTerm, socialProfileId, color: categoryColor})
      .then((data) => {
        Notification.success('New Category is added.')
        this.setState({
          isOpen: !isOpen
        })
      })
    }
  }

  onCategoryColorChange = (colorCode) => {
    this.setState({
      categoryColor: colorCode
    })
  }

  confirmDeleteRow = () => {
    this.setState({confirmOpen: true})
  }

  renderCreateNewCategory = () => {
    return (<div className='add-category-item'>
      <b>Category not found. Create a new one.</b>
      <div className='dropdown-content'>
        <div className='category-color-view'>
          <p className='category-title'>
            Select a Color
          </p>

          <div className='category-color-picker'>
            {
              ColorNames.color.map((color, index) => (
                <ColorPickerCell
                  key={index}
                  colorCode={color.name}
                  categoryColorChange={this.onCategoryColorChange}
                />
              ))
            }
          </div>
        </div>
        <div className='category-button-view'>
          {/*<Button onClick={this.handleClose}>Cancel</Button>*/}
          <Button className='savecategory-button' onClick={this.onCategoryCreate}>Create Category</Button>
        </div>
      </div>
    </div>)
  }

  render () {
    let { type, day, obj } = this.props
    let { cellTime, timePickerOpen } = this.state
    const time = moment(getCorrectHours(cellTime), 'HH:mm')
    if (type === 'time') {
      let sunIcon = null
      switch (true) {
        case cellTime < 240: // Before 4am:
          sunIcon = <Night/>
          break;
        case cellTime < 720: // Before mid-day
          sunIcon = <Morning/>
          break;
        case cellTime < 1020: // Before 5PM
          sunIcon = <Sun/>
          break;
        case cellTime < 1200: // Before 8PM
          sunIcon = <Afternoon/>
          break;
        default: // After 8PM
          sunIcon = <Night/>
          break;
      }
      return (
        <Table.Cell key={time} className='calendar-time-cell'>
          {sunIcon}
          <TimePicker
            id='custom-time-picker'
            value={time}
            showSecond={false}
            onOpen={() => this.setState({timePickerOpen: true})}
            onClose={this.onSaveRow}
            onChange={this.onTimeUpdate}
            format={format}
            open={timePickerOpen}
          />
          <Icon name='trash' className='remove-icon-row' onClick={() => this.confirmDeleteRow()} />
          <Confirm
            open={this.state.confirmOpen}
            onCancel={() => this.setState({confirmOpen: false})}
            onConfirm={() => this.onDelEvent(time)}
            content={<div className='content'>Are you sure you want to delete this time?<br /><br />All calendar slots in this row will be removed.</div>}
            size='tiny'
          />
        </Table.Cell>
      )
    }

    const filteredCategories = this.state.searchTerm ? this.state.categories.filter(item => item.node.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())) : this.state.categories || []

    if (obj.category) {
      const backColor = hexToRGB(obj.category.color, 0.25)
      const hoverCatColor = hexToRGB(obj.category.color, 0.4)
      const catColor = hexToRGB(obj.category.color, 1)
      return (
        <Table.Cell
          key={obj.id}
          className='calendar-cell no-border'
          style={{ backgroundColor: backColor }}
        >
          <div
            className='category-label'
            style={{color: catColor}}
          >
            <span
              className='category-label-name'
              style={{ backgroundColor: this.props.catId === obj.category.id ? hoverCatColor : 'transparent' }}
              onClick={() => this.props.onCellClicked(obj.category.id)}
            >
              {obj.category.name}
            </span>
          </div>
          <Icon
            name='trash'
            className='remove-icon'
            onClick={() => this.onDeleteCalendarSlot(obj.id)}
            style={{color: catColor}}
          />
          {/*<Popup
            trigger={<div
              className='category-label'
              onClick={this.handleOpen}
              style={{color: catColor}}
            >

            </div>}
            content={<div className='quality-post-popup'>
              <div className='quality-data'>
                <div>
                  <b>Performance</b>
                  <Icon name='thumbs outline up' />
                </div>
                <div>
                  <b>Freshness</b>
                  <Freshness percentage={98} />
                </div>
              </div>
              <Button className='success' content='Go to post' />
            </div>}
            on='click'
            open={this.state.isShowPopup}
            onClose={this.handleClose}
            position='bottom center'
          />*/}
          {this.props.mobile &&
            <Popup
              className='mobile-menu'
              trigger={<Icon name='ellipsis vertical' style={{ backgroundColor: this.props.catId === obj.category.id ? hoverCatColor : 'transparent' }} />}
              content={<div className='mobile-menu-inner'>
                <div className='item' onClick={() => this.setState({showCategoryModal: true})}>Replace</div>
                <div className='item' onClick={() => this.onDeleteCalendarSlot(obj.id)}>
                  Clear
                </div>
              </div>
              }
              on='click'
              position='bottom right'
            />}
          {this.props.mobile && this.state.showCategoryModal && <Modal
            open={this.state.showCategoryModal}
            onClose={() => this.setState({showCategoryModal: false})}
            className='post-item-pane'
            size='small'
          >
            <Modal.Content scrolling>
              <div className='add-category-popup'>
                <Input
                  placeholder='Search...'
                  onChange={(event, {value}) => this.setState({searchTerm: value})}
                />
                {filteredCategories.length > 0 ?
                  <ul className='add-category-list'>
                    {filteredCategories.map(cat => {
                      return (
                        <li key={cat.node.name} className='add-category-item' onClick={() => this.onCellUpdate(day, time, obj, cat)}>
                          <div className='add-category-color' style={{backgroundColor: cat.node.color}} />
                          {cat.node.name}
                        </li>
                      )
                    })}
                  </ul>
                  :
                  this.renderCreateNewCategory()
                }
              </div>
            </Modal.Content>
          </Modal>}
        </Table.Cell>
      )
    }

    return (
      <Table.Cell key={obj.id} className='calendar-cell'>
        <Popup
          trigger={<div
            className='addcategory-label'
            onClick={this.handleOpen}
          >
            <Icon name='plus circle' />
          </div>}
          content={<div className='add-category-popup'>
            <Input
              placeholder='Search...'
              onChange={(event, {value}) => this.setState({searchTerm: value})}
            />
            {filteredCategories.length > 0 ?
              <ul className='add-category-list'>
                {filteredCategories.map(cat => {
                  return (
                    <li key={cat.node.name} className='add-category-item' onClick={() => this.onCellUpdate(day, time, obj, cat)}>
                      <div className='add-category-color' style={{backgroundColor: cat.node.color}} />
                      {cat.node.name}
                    </li>
                  )
                })}
              </ul>
              :
              this.renderCreateNewCategory()
            }
          </div>}
          on='click'
          open={this.state.isShowPopup}
          onClose={this.handleClose}
          position='bottom center'
        />
      </Table.Cell>
    )
  }
}

export default compose(
  graphql(createCalendarSlotMutation, {
    props ({ ownProps, mutate }) {
      return {
        createCalendarSlot (calendarSlotDay, calendarSlotTime, calendarSlotType, categoryId, socialProfileId) {
          return mutate({
            variables: {
              input: {
                calendarSlotDay,
                calendarSlotTime,
                calendarSlotType,
                categoryId,
                socialProfileId
              }
            },
            update: (proxy, {data: {createCalendarSlot}}) => {
              // Posts page query
              let postPageData = proxy.readQuery({query: gql`${calendarSlotsGql}`, variables: {profileIds: [socialProfileId], type: 'WEEKLY'}})
              let calendarSlot = createCalendarSlot.calendarSlot
              delete calendarSlot.contentSchedules
              postPageData.calendarSlots_find.edges.push({node: calendarSlot, __typename: 'CalendarSlotsEdge'})
              proxy.writeQuery({ query: gql`${calendarSlotsGql}`, variables: {profileIds: [socialProfileId], type: 'WEEKLY'}, data: postPageData })

              // Calendar page query
              let calendarPageData = proxy.readQuery({query: calendarSlotsFindQuery, variables: {profileIds: [socialProfileId], type: 'WEEKLY'}})
              calendarPageData.calendarSlots_find.edges.push({node: createCalendarSlot.calendarSlot, __typename: 'CalendarSlotsEdge'})
              proxy.writeQuery({ query: calendarSlotsFindQuery, variables: {profileIds: [socialProfileId], type: 'WEEKLY'}, data: calendarPageData })
            }
          })
        }
      }
    }
  }),
  graphql(updateCalendarSlotMutation, {
    props ({ ownProps, mutate }) {
      return {
        editCalendarSlot (calendarSlotId, calendarSlotDay, calendarSlotTime, calendarSlotType, categoryId) {
          return mutate({
            variables: {
              input: {
                calendarSlotId,
                calendarSlotDay,
                calendarSlotTime,
                calendarSlotType,
                categoryId
              }
            },
            update: (proxy, {data: {editCalendarSlot}}) => {
              // Posts page query
              let postPageData = proxy.readQuery({query: gql`${calendarSlotsGql}`, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}})
              let calendarSlot = createCalendarSlot.calendarSlot
              delete calendarSlot.contentSchedules
              for (const [index, calendarSlot] of postPageData.calendarSlots_find.edges.entries()) {
                if (calendarSlot.node.id === editCalendarSlot.calendarSlot.id) {
                  postPageData.calendarSlots_find.edges[index].node = editCalendarSlot.calendarSlot
                  proxy.writeQuery({query: gql`${calendarSlotsGql}`, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}, data: postPageData})
                  break
                }
              }

              // Calendar page query
              let calendarPageData = proxy.readQuery({query: calendarSlotsFindQuery, variables: {profileIds: [socialProfileId], type: 'WEEKLY'}})
              for (const [index, calendarSlot] of calendarPageData.calendarSlots_find.edges.entries()) {
                if (calendarSlot.node.id === editCalendarSlot.calendarSlot.id) {
                  calendarPageData.calendarSlots_find.edges[index].node = editCalendarSlot.calendarSlot
                  proxy.writeQuery({query: calendarSlotsFindQuery, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}, data: calendarPageData})
                  break
                }
              }
            }
          })
        }
      }
    }
  }),
  graphql(deleteCalendarSlotMutation, {
    props ({ ownProps, mutate }) {
      return {
        deleteCalendarSlot ({id}) {
          return mutate({
            variables: {
              input: {
                id
              }
            },
            update: (proxy, {data: {deleteCalendarSlot}}) => {
              // Posts page query
              let postPageData = proxy.readQuery({query: gql`${calendarSlotsGql}`, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}})
              for (const [index, calendarSlot] of postPageData.calendarSlots_find.edges.entries()) {
                if (calendarSlot.node.id === id) {
                  postPageData.calendarSlots_find.edges.splice(index, 1)
                  proxy.writeQuery({query: gql`${calendarSlotsGql}`, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}, data: postPageData})
                  break
                }
              }

              // Calendar page query
              let calendarPageData = proxy.readQuery({query: calendarSlotsFindQuery, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}})
              for (const [index, calendarSlot] of calendarPageData.calendarSlots_find.edges.entries()) {
                if (calendarSlot.node.id === id) {
                  calendarPageData.calendarSlots_find.edges.splice(index , 1)
                  proxy.writeQuery({query: calendarSlotsFindQuery, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}, data: calendarPageData})
                  break
                }
              }
            }
          })
        }
      }
    }
  }),
  graphql(editCalendarRowTimeMutation, {
    props ({ ownProps, mutate }) {
      return {
        editCalendarRowTime ({ calendarSlotIds, newTime }) {
          return mutate({
            variables: {
              input: {
                calendarSlotIds,
                newTime
              }
            },
            update: (proxy, {data: {editCalendarRowTime}}) => {
              // Posts page query
              let postPageData = proxy.readQuery({query: gql`${calendarSlotsGql}`, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}})
              for (const [index, calendarSlot] of postPageData.calendarSlots_find.edges.entries()) {
                calendarSlotIds.forEach((id) => {
                  if (calendarSlot.node.id === id) {
                    postPageData.calendarSlots_find.edges[index].node.time = newTime
                  }
                })
              }
              proxy.writeQuery({query: gql`${calendarSlotsGql}`, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}, data: postPageData})

              // Calendar page query
              let calendarPageData = proxy.readQuery({query: calendarSlotsFindQuery, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}})
              for (const [index, calendarSlot] of calendarPageData.calendarSlots_find.edges.entries()) {
                calendarSlotIds.forEach((id) => {
                  if (calendarSlot.node.id === id) {
                    calendarPageData.calendarSlots_find.edges[index].node.time = newTime
                  }
                })
                proxy.writeQuery({query: calendarSlotsFindQuery, variables: {profileIds: [ownProps.socialId], type: 'WEEKLY'}, data: calendarPageData})
              }
            }
          })
        }
      }
    }
  }),
  graphql(createCategoryMutation, {
    props ({ownProps, mutate}) {
      return {
        createCategory ({categoryName, socialProfileId, color}) {
          return mutate({
            variables: {
              input: {
                categoryName,
                socialProfileId,
                color
              }
            },
            refetchQueries: [{
              query: getCategorybySocialIdQuery,
              variables: {
                id: ownProps.socialId
              }
            }]
          })
        }
      }
    }
  })
)(CalendarCell)
