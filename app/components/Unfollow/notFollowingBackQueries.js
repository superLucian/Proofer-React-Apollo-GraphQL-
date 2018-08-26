import gql from 'graphql-tag'

export const notFollowingBack = gql`
query twitterFriendsNotFollowing($socialProfileId: ID!) {
  twitterFriendsNotFollowing(socialProfileId: $socialProfileId) {
    id
    name
    screenName
    profilePicture
  }
}
`

export const notFollowingBackLessThanOneDay = gql`
query twitterFriendsNotFollowingLessThanOneDay($socialProfileId: ID!) {
  twitterFriendsNotFollowingLessThanOneDay(socialProfileId: $socialProfileId) {
    id
    name
    screenName
    profilePicture
  }
}
`
