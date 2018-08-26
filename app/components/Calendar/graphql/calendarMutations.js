import gql from 'graphql-tag'

export const createCalendarSlotMutation = gql`
mutation createCalendarSlot($input: CreateCalendarSlotInput!) {
  createCalendarSlot(input: $input) {
    calendarSlot {
      id
      day
      time
      type
      category {
        id
        name
        color
      }
      socialProfile {
        id
        name
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
    }
  }
}`

export const updateCalendarSlotMutation = gql`
mutation editCalendarSlot($input: EditCalendarSlotInput!) {
  editCalendarSlot(input: $input) {
    calendarSlot {
      id
      day
      time
      type
      category {
        id
        name
        color
      }
      socialProfile {
        id
        name
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
    }
  }
}`

export const deleteCalendarSlotMutation = gql`
mutation deleteCalendarSlot($input: DeleteInput!) {
  deleteCalendarSlot(input: $input)
}`

export const editCalendarRowTimeMutation = gql`
mutation editCalendarRowTime($input: EditCalendarRowTimeInput!) {
  editCalendarRowTime(input: $input)
}`
