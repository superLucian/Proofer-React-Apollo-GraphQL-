import gql from 'graphql-tag'

export const getAssets = gql`
query getAssets ($categoryIds: [ID]) {
  media_find (categoryIds: $categoryIds, inBank: true) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        id
        url
        mime
        categories {
          id
          name
          color
        }
      }
    }
  }
}`
