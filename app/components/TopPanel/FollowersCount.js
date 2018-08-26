import { graphql, compose } from 'react-apollo'
import { followersCount } from './graphql/statsQuery'
import Stat from './Stat';
import Loader from '../Loader'


const FollowersCount = ({ socialId, endCount, startCount }) => {

  if (!socialId) {
    return <Stat key={'followers'} stat={{
      value: '--',
      label : 'followers'
    }} />;
  }

  if (startCount.loading || endCount.loading) {
    return <Loader />;
  }

  let value = 0;
  let indicator = 0;
  if (endCount.twitterFollowersCount_bySocialProfileAndDate !== null) {
    value = endCount.twitterFollowersCount_bySocialProfileAndDate.count
    if (startCount.twitterFollowersCount_bySocialProfileAndDate !== null ) {
      indicator = endCount.twitterFollowersCount_bySocialProfileAndDate.count - startCount.twitterFollowersCount_bySocialProfileAndDate.count
    }
  }
  return <Stat key={'followers'} stat={{
    value,
    label : 'followers',
    indicator
  }} />;
}

export default compose(
  graphql(followersCount, {
    options: (ownProps) => ({
      skip: !ownProps.socialId,
      variables: {
        socialProfileId: ownProps.socialId,
        date: ownProps.compareDates.currentWeek.dateStart
      }
    }),
    name: 'startCount'
  }),
  graphql(followersCount, {
    options: (ownProps) => ({
      skip: !ownProps.socialId,
      variables: {
        socialProfileId: ownProps.socialId,
        date: ownProps.compareDates.currentWeek.dateEnd
      }
    }),
    name: 'endCount'
  })
)(FollowersCount)
