import gql from 'graphql-tag'

export const calendarSlotsFindQuery =
gql`
query calendarSlots_find ($profileIds: [ID]!, $categoryIds: [ID], $type: CalendarSlotType) {
  calendarSlots_find(profileIds: $profileIds, categoryIds: $categoryIds, type: $type) {
    edges {
      node {
        id
        day
        time
        type
        category {
          name
          color
          id
        }
        socialProfile {
          name
          id
          socialNetwork
          facebookPageName
        }
        contentSchedules {
          id
          publishAt
          status {
            ... on TwitterStatus {
              retweetCount
              favouriteCount
            }
          }
          content {
            id
            media {
              id
              url
            }
          }
        }
        __typename
      }
    }
  }
}`
