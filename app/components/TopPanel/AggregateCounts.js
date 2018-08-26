import { graphql, compose } from 'react-apollo'
import { aggregateCount } from './graphql/statsQuery'
import Stat from './Stat'
import Loader from '../Loader'
import React from 'react'

const AggregateCounts = ({ socialId, currentWeek, compareWeek }) => {

  if (!socialId) {
    return [
      <Stat key={'likes'} _key={'likes'} stat={{
        value: '--',
        label: 'likes'
      }} />,
      <Stat key={'shares'} _key={'shares'} stat={{
        value: '--',
        label: 'shares'
      }} />
    ]
  }

  if (compareWeek.loading || currentWeek.loading) {
    return <Loader />
  }

  let likesCount = 0
  let likeindicator = 0
  let sharesCount = 0
  let sharesindicator = 0
  if (currentWeek.aggregateCount) {
    if (currentWeek.aggregateCount.likesCount !== null) {
      likesCount = currentWeek.aggregateCount.likesCount
      if (compareWeek.aggregateCount.likesCount !== null) {
        likeindicator = currentWeek.aggregateCount.likesCount - compareWeek.aggregateCount.likesCount
      }
    }

    if (currentWeek.aggregateCount.sharesCount !== null) {
      sharesCount = currentWeek.aggregateCount.sharesCount
      if (compareWeek.aggregateCount.sharesCount !== null) {
        sharesindicator = currentWeek.aggregateCount.sharesCount - compareWeek.aggregateCount.sharesCount
      }
    }
  }

  return [<Stat
    key={'likes'}
    _key={'likes'}
    stat={{
      value: likesCount,
      label: 'likes',
      indicator: likeindicator
    }} />,
    <Stat
      key={'shares'}
      _key={'shares'}
      stat={{
        value: sharesCount,
        label: 'shares',
        indicator: sharesindicator
      }}
    />]
}

export default compose(
  graphql(aggregateCount, {
    options: (ownProps) => ({
      skip: !ownProps.socialId,
      variables: {
        socialProfileId: ownProps.socialId,
        dateStart: ownProps.compareDates.compareWeek.dateStart,
        dateEnd:  ownProps.compareDates.compareWeek.dateEnd
      }
    }),
    name: 'compareWeek'
  }),
  graphql(aggregateCount, {
    options: (ownProps) => ({
      skip: !ownProps.socialId,
      variables: {
        socialProfileId: ownProps.socialId,
        dateStart: ownProps.compareDates.currentWeek.dateStart,
        dateEnd:  ownProps.compareDates.currentWeek.dateEnd
      }
    }),
    name: 'currentWeek'
  })
)(AggregateCounts)
