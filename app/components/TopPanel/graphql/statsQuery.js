import gql from 'graphql-tag'

export const aggregateCount  = gql`
query aggregateCount($socialProfileId: ID!, $dateStart: DateTime!, $dateEnd: DateTime!){
  aggregateCount(socialProfileId: $socialProfileId, dateEnd: $dateEnd, dateStart: $dateStart)
  {
    id
    likesCount
    sharesCount
    repliesCount
  }
}`


export const followersCount  = gql`
query followersCount($socialProfileId: ID!, $date: DateTime!) {
  twitterFollowersCount_bySocialProfileAndDate(socialProfileId: $socialProfileId, date: $date) {
    id
  	count
  }
}`
