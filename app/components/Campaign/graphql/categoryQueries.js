import gql from 'graphql-tag'

export const getCategorybySocialIdQuery =
gql`
query socialProfile ($id: ID!) {
  socialProfile(id : $id) {
    categories {
      edges {
        node {
          id
          name
        }
      }
    }
  }
}`
