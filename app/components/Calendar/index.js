import React from 'react'
import { graphql, compose } from 'react-apollo'

import Loader from '../Loader'
import CalendarView from './CalendarView'
import TopPanel from '../TopPanel'
import Stats from '../TopPanel/Stats'
import { Dropdown } from 'semantic-ui-react'
import FollowersCount from '../TopPanel/FollowersCount';

import { calendarSlotsFindQuery } from './graphql/contentQueries'
import { getCategorybySocialIdQuery } from './graphql/categoryQueries'
import {calendarTimeAndDayWithOffset} from "../../libraries/helpers";


import './styles/react-activity.scss'
import './styles/index.scss'


const Calendar = ({ socialId, calendarSlots, categories }) =>  {

  if (!socialId) {
    return (
      <div className='page-wrapper'>
        Please select a social profile on the left, or click the + to connect a new one.
      </div>
    )
  }

  if(calendarSlots.loading || categories.loading) {
    return <Loader />;
  }

  const finalSlots = {}
  const calendarSlotList = calendarSlots.calendarSlots_find.edges.map((e) => ({...e.node}))
  for (let i = 0; i < calendarSlotList.length; i++) {
    const item = calendarSlotList[i]
    const {day, time} = calendarTimeAndDayWithOffset(item, new Date().getTimezoneOffset())
    if (finalSlots[time] === undefined) {
      finalSlots[time] = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {}
      }
    }
    finalSlots[time][day] = item
  }

  return (<div className='page-wrapper calendar-wrapper'>
    <CalendarView
      slots={finalSlots}
      socialId={socialId}
      categories={categories.socialProfile ? categories.socialProfile.categories.edges : []}
    />
  </div>)
}

export default compose(
  graphql(calendarSlotsFindQuery, {
    options: (props) => ({
      skip: !props.socialId,
      variables: {
        profileIds: [props.socialId],
        type: 'WEEKLY'
      }
    }),
    name: 'calendarSlots'
  }),
  graphql(getCategorybySocialIdQuery, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.socialId
      }
    }),
    name: 'categories'
  })
)(Calendar)
