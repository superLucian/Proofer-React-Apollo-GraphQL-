import React from 'react'
import {getCorrectHours} from '../../../libraries/helpers'

import Sun from '../../../static/images/sun.svg'
import Afternoon from '../../../static/images/afternoon.svg'
import Morning from '../../../static/images/morning.svg'
import Night from '../../../static/images/night.svg'

const LeftSide = ({dateTime}) => {
  let sunIcon = null
  const slotValueTime = (dateTime.getHours() * 60) + dateTime.getMinutes()
  switch (true) {
    case slotValueTime < 240: // Before 4am:
      sunIcon = <Night />
      break
    case slotValueTime < 720: // Before mid-day
      sunIcon = <Morning />
      break
    case slotValueTime < 1020: // Before 5PM
      sunIcon = <Sun />
      break
    case slotValueTime < 1200: // Before 8PM
      sunIcon = <Afternoon />
      break
    default: // After 8PM
      sunIcon = <Night />
      break
  }

  return (
    <div className='post-item-datetime'>
      {sunIcon}
      <div className='date-time-label'>
        {getCorrectHours(slotValueTime, dateTime)}
      </div>
    </div>
  )
}

export default LeftSide
