import gql from 'graphql-tag'

export const fetchOneCategoryQuery =
gql`
query ($id: ID!) {
  category(id : $id) {
    id
    name
    color
    contents (inBank: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          text
          inBank
          evergreen
          published
          schedules{
            edges{
              node{
                status{
                  ...on TwitterStatus {
                    favouriteCount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`

export const getCategorybySocialIdQuery =
gql`
query socialProfile ($id: ID!) {
  socialProfile(id : $id) {
    id
    categories {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          color
          contents (inBank: true) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                text
                inBank
                evergreen
                published
                schedules{
                  edges{
                    node{
                      status{
                        ...on TwitterStatus {
                          favouriteCount
                          retweetCount
                        }
                      }
                    }
                  }
                }
                media {
                  id
                  url
                  mime
                }
              }
            }
          }
        }
      }
    }
  }
}`
