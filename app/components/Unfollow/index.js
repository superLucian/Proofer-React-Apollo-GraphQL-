import React, {Component} from 'react'
import UnfollowLists from './UnfollowLists'
import initApollo from "../../libraries/apolloClient";
import gql from 'graphql-tag'

class Unfollow extends Component {
  render () {
    const client = initApollo({}, {})
    const socialProfile = client.readFragment({
      id: 'SocialProfile:' + this.props.socialId,
      fragment: gql`
        fragment socialProfile on SocialProfile {
          id
          name
          createdAt
          socialNetwork
          twitterFollowers {
            count
          }
          twitterFriends {
            count
          }
        }
      `
    })

    if (socialProfile && socialProfile.socialNetwork !== 'TWITTER') {
      return <div className='page-wrapper unfollow-page'>This feature is only available for Twitter accounts (for now!)</div>
    }

    return (
      <div className='page-wrapper unfollow-page'>
        <UnfollowLists {...this.props} socialProfile={socialProfile}/>
      </div>
    )
  }
}

export default Unfollow
