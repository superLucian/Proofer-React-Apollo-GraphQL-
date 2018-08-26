import React from 'react'
import { Table, Button, Icon } from 'semantic-ui-react'
import moment from 'moment';

import { months, days } from '../../libraries/constants'
import CalendarCell from './CalendarCell'

import TopPanel from '../TopPanel'
import Stats from '../TopPanel/Stats'
import { Dropdown } from 'semantic-ui-react'
import FollowersCount from '../TopPanel/FollowersCount';
import AggregateCounts from '../TopPanel/AggregateCounts';



class CalendarTable extends React.Component {
  constructor (props) {
    super(props)
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentWeek = this.getWeek(new Date())
    const currentDate = new Date()
    this.state = {
      currentYear: currentYear,
      currentMonth: currentMonth,
      currentWeek: currentWeek,
      currentDate: currentDate,
      availableDates: [],
      wholeDayEnable: false,
      platformType: ''
    }
  }

  platformHandler = (platformType) => this.setState({platformType});

  getDaysInWeek = (current) => {
    const week = []
    // Starting Monday not Sunday
    current.setDate((current.getDate() - current.getDay() + 1))
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return week
  }

  onWeekChange = (isNext) => {
    const {currentWeek, currentMonth, currentYear, wholeDayEnable} = this.state
    const realYear = new Date().getFullYear()
    const realMonth = new Date().getMonth()
    const realWeek = this.getWeek(new Date())

    if (currentWeek === realWeek && currentMonth === realMonth && currentYear === realYear) {
      const newWeek = isNext ? currentWeek + 1 : currentWeek - 1
      const newMonth = isNext ? currentMonth + 1 : currentMonth - 1
      const newYear = isNext ? currentYear + 1 : currentYear - 1
      if (newWeek > -1 && newWeek < 52) {
        this.setState({
          currentWeek: isNext ? currentWeek + 1 : currentWeek - 1,
          currentMonth: currentMonth !== realMonth ? newMonth : currentMonth,
          wholeDayEnable: true,
          activeDate: null,
          loading: true
        })
      } else {
        this.setState({
          currentWeek: isNext ? 0 : 51,
          currentMonth: isNext ? 0 : 11,
          currentYear: newYear,
          activeDate: null,
          loading: true
        })
      }
    } else {
      if (currentMonth === realMonth && currentYear === realYear) {
        const newMonth = isNext ? currentMonth + 1 : currentMonth - 1
        const newYear = isNext ? currentYear + 1 : currentYear - 1
        if (newMonth > -1 && newMonth < 12) {
          this.setState({
            currentWeek: isNext ? currentWeek + 1 : currentWeek - 1,
            currentMonth: isNext ? currentMonth + 1 : currentMonth - 1,
            wholeDayEnable: true,
            activeDate: null,
            loading: true
          })
        } else {
          this.setState({
            currentWeek: isNext ? 0 : 51,
            currentMonth: isNext ? 0 : 11,
            currentYear: newYear,
            activeDate: null,
            loading: true
          })
        }
      } else {
        const newMonth = isNext ? currentMonth + 1 : currentMonth - 1
        const newYear = isNext ? currentYear + 1 : currentYear - 1
        if (newMonth > -1 && newMonth < 12) {
          this.setState({
            currentWeek: isNext ? currentWeek + 1 : currentWeek - 1,
            currentMonth: newMonth,
            wholeDayEnable: false,
            activeDate: null,
            loading: true
          })
        } else {
          this.setState({
            currentWeek: isNext ? 0 : 51,
            currentMonth: isNext ? 0 : 11,
            currentYear: newYear,
            activeDate: null,
            loading: true
          })
        }
      }
    }
  }

  getWeek = (date) => {
    var newYear = new Date(date.getFullYear(), 0, 1)
    var day = newYear.getDay() // the day of week the year begins on
    day = (day >= 0 ? day : day + 7)
    var daynum = Math.floor((date.getTime() - newYear.getTime() -
    (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1
    var weeknum
    // if the year starts before the middle of a week
    if (day < 4) {
      weeknum = Math.floor((daynum + day - 1) / 7) + 1
      if (weeknum > 52) {
        const nYear = new Date(date.getFullYear() + 1, 0, 1)
        let nday = nYear.getDay()
        nday = nday >= 0 ? nday : nday + 7
        /* if the next year starts before the middle of
          the week, it is week #1 of that year */
        weeknum = nday < 4 ? 1 : 53
      }
    } else {
      weeknum = Math.floor((daynum + day - 1) / 7)
    }
    return weeknum
  }

  calculateStats = (compareDates) => {
    const { socialId, slots} = this.props

    let availablePosts = Object.keys(slots).map(slot => Object.keys(slots[slot]).map(c => slots[slot][c].contentSchedules && slots[slot][c].contentSchedules.length).filter( n => n));
    availablePosts = availablePosts.filter(n => n.length > 0 ? n: false)
    availablePosts = [].concat.apply([], availablePosts).reduce((a, b) => a + b, 0);
    return [
        {
          'value' : availablePosts,
          'label' : 'posts'
        },
        <AggregateCounts key='aggregates' socialId={socialId} compareDates={compareDates} />,
        <FollowersCount key='followers' socialId={socialId} compareDates={compareDates} />
      ];
  }

  render () {
    const {socialId, onCalendarTableUpdate, onCellClicked, onSlotsUpdate, slots, categories, catId, onRowDel, onRowAdd} = this.props
    const {currentDate, currentMonth, platformType} = this.state
    const availableDates = this.getDaysInWeek(currentDate)

    if (process.env.BROWSER) {
      if (window.innerWidth < 600) {
        return (<div>
          {/*<div className='calendar-weeks'>
            <div className='weeks-wrapper'>
              <div className='weeks-date'>
                <Icon name='caret left' onClick={() => this.onDayChange(false)} />
                <span>{`${days[currentDate.getDay()]}, ${currentDate.getDate() + 'th '}`}</span>
                <Icon name='caret right' onClick={() => this.onDayChange(true)} />
              </div>
            </div>
          </div>*/}
          <Table className='calendar-table' basic='very' celled collapsing>
            <Table.Body>
              {Object.keys(slots).map((index) => <Table.Row className='calendar-row' key={index}>
                <CalendarCell
                  onCalendarTableUpdate={onCalendarTableUpdate}
                  onSlotsUpdate={onSlotsUpdate}
                  onDelEvent={onRowDel}
                  slots={slots}
                  slot={slots[index]}
                  type='time'
                  cellTime={index}
                  socialId={socialId}
                />
                <CalendarCell
                  key={index}
                  onCalendarTableUpdate={onCalendarTableUpdate}
                  onCellClicked={onCellClicked}
                  onSlotsUpdate={onSlotsUpdate}
                  type='day'
                  slots={slots}
                  categories={categories}
                  day={slots[index][currentDate.getDay()]}
                  obj={slots[index][currentDate.getDay()]}
                  cellTime={index}
                  socialId={socialId}
                  catId={catId}
                  mobile
                />
              </Table.Row>)
              }
            </Table.Body>
          </Table>
          <Button
            onClick={onRowAdd}
            positive
          >
            <Icon name='plus' />Add
          </Button>
        </div>)
      }
    }

    const compareDates = {
      currentWeek: {
        dateStart: moment(availableDates[0]).format('YYYY-MM-DD'),
        dateEnd: moment(availableDates[6]).format('YYYY-MM-DD')
      },
      compareWeek: {
        dateStart: moment(availableDates[0]).subtract(7, "days").format('YYYY-MM-DD'),
        dateEnd: moment(availableDates[6]).subtract(7, "days").format('YYYY-MM-DD')
      }
    }

    return (<div>
      {/*<div className='calendar-weeks'>
        <div className='weeks-wrapper'>
          <div className='weeks-actions' />
          <div className='weeks-date'>
            <Icon name='caret left' onClick={() => this.onWeekChange(false)} />
            <span>{availableDates[0].getDate()}th</span>&nbsp;
            <span>-</span>&nbsp;
            <span>{availableDates[6].getDate()}st</span>&nbsp;
            <span className='bold'>{months[currentMonth]}</span>
            <Icon name='caret right' onClick={() => this.onWeekChange(true)} />
          </div>
          <div className='weeks-actions'>
            <Button className='success empty'>Autocomplete</Button>
          </div>
        </div>
      </div>*/}
      <Table className='calendar-table' basic='very' celled collapsing>
        <Table.Header className='calendar-header'>
          <Table.Row textAlign='center'>
            <Table.HeaderCell />
            <Table.HeaderCell>
              <div className='weekday'>M</div>
              {/*<div className='digit'>{availableDates[0].getDate()}</div>*/}
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div className='weekday'>T</div>
              {/*<div className='digit'>{availableDates[1].getDate()}</div>*/}
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div className='weekday'>W</div>
              {/*<div className='digit'>{availableDates[2].getDate()}</div>*/}
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div className='weekday'>T</div>
              {/*<div className='digit'>{availableDates[3].getDate()}</div>*/}
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div className='weekday'>F</div>
              {/*<div className='digit'>{availableDates[4].getDate()}</div>*/}
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div className='weekday'>S</div>
              {/*<div className='digit'>{availableDates[5].getDate()}</div>*/}
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div className='weekday'>S</div>
              {/*<div className='digit'>{availableDates[6].getDate()}</div>*/}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(slots).map((index) => <Table.Row className='calendar-row' key={index}>
            <CalendarCell
              onCalendarTableUpdate={onCalendarTableUpdate}
              onSlotsUpdate={onSlotsUpdate}
              onDelEvent={onRowDel}
              slots={slots}
              slot={slots[index]}
              type='time'
              cellTime={index}
              socialId={socialId}
            />
            {Object.keys(slots[index]).map((day) => <CalendarCell
              key={day}
              onCalendarTableUpdate={onCalendarTableUpdate}
              onCellClicked={onCellClicked}
              onSlotsUpdate={onSlotsUpdate}
              type='day'
              slots={slots}
              categories={categories}
              day={day}
              obj={slots[index][day]}
              cellTime={index}
              socialId={socialId}
              catId={catId}
            />)}
          </Table.Row>)
          }
        </Table.Body>
      </Table>
      <Button onClick={onRowAdd} positive ><Icon name='plus' />Add</Button>
      <TopPanel
        leftBlock={
          <Dropdown
            ref='platform_dropdown'
            search
            selection
            placeholder="All Platforms:"
            options={[]}
            value={platformType}
            onChange={(event, {value}) => this.platformHandler(value)}
          />
        }
        rightBlock=''
        middleBlock={
          <Stats stats={this.calculateStats(compareDates)}/>
        }
      />
    </div>)
  }
}

export default CalendarTable
