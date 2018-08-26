import gql from 'graphql-tag'

export const approveAllMutation = gql`
mutation approveAll($input: ApproveAllInput!) {
  approveAllContentSchedules(input: $input) {
    contentSchedule {
      id
      type
      publishAt
      socialProfile {
        id
        name
        socialNetwork
      }
      publishingStatus
      moderationStatus
      content {
        id
        text
        inBank
        evergreen
        published
        media {
          id
          url
          mime
        }
        comments{
          edges{
            node{
              id
              text
              createdAt
              user{
                id
                firstName
                lastName
                email
              }
            }
          }
        }
      }
      calendarSlot {
        id
        day
        time
        type
      }
    }
  }
}`
