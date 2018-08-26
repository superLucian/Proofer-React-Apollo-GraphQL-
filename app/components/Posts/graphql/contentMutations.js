import gql from 'graphql-tag'

export const createContentMutation = gql`
mutation createContent($input: CreateContentInput!) {
  createContent(input: $input) {
    content {
      id
      text
      schedules{
        edges{
          node{
            publishAt
            status{
              ...on TwitterStatus {
                favouriteCount
              }
            }
          }
        }
      }
      categories {
        id
        name
        color
      }
      media{
        id
        url
        mime
      }
    }
  }
}`

export const editContentMutation = gql`
mutation editContent($input: EditContentInput!) {
  editContent(input: $input) {
    content {
      id
      text
      inBank
      evergreen
      published
      socialProfiles {
        id
        name
        socialNetwork
      }
      categories {
        id
        name
      }
      media {
        id
        url
        mime
      }
    }
  }
}`

export const deleteContentMutation = gql`
mutation deleteContent($input: DeleteInput!) {
  deleteContent(input: $input)
}`

export const updateContentMutation = gql`
mutation editContent($input: EditContentInput!) {
  editContent(input: $input) {
    content {
      id
      text
      socialProfiles {
        id
        name
        socialNetwork
      }
      categories {
        id
        name
      }
      media {
        id
        url
        mime
      }
    }
  }
}`

export const createContentScheduleMutation = gql`
mutation createContentSchedule($input: CreateContentScheduleInput!) {
  createContentSchedule(input: $input) {
    contentSchedule {
      id
      type
      moderationStatus
      publishingStatus
      publishAt
      socialProfile {
        id
        name
        socialNetwork
      }
      status{
        ...on TwitterStatus {
          retweetCount
          favouriteCount
        }
      }
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

export const updateContentScheduleMutation = gql`
mutation editContentSchedule($input: EditContentScheduleInput!) {
  editContentSchedule(input: $input) {
    contentSchedule {
      id
      type
      publishAt
      socialProfile {
        id
        name
        socialNetwork
      }
      status{
        ...on TwitterStatus {
          retweetCount
          favouriteCount
        }
      }
      publishAt
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

export const deleteContentScheduleMutation = gql`
mutation deleteContentSchedule($input: DeleteInput!) {
  deleteContentSchedule(input: $input)
}`

export const editContentAddMediaMutation = gql`
mutation editContentAddMedia($input: EditContentMediaInput!) {
  editContentAddMedia(input: $input) {
    content {
      id
      text
      inBank
      evergreen
      published
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
      categories {
        id
        name
      }
      media {
        id
        url
        mime
      }
    }
  }
}`

export const editContentRemoveMediaMutation = gql`
mutation editContentRemoveMedia($input: EditContentMediaInput!) {
  editContentRemoveMedia(input: $input) {
    content {
      id
      text
      inBank
      evergreen
      published
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
      categories {
        id
        name
      }
      media {
        id
        url
        mime
      }
    }
  }
}`
