import gql from 'graphql-tag'

export const getAssets = gql`
query getAssets ($categoryIds: [ID], $after: String) {
  media_find (categoryIds: $categoryIds, first: 10, after: $after) {
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

export const deleteMedium = gql`
mutation deleteMedium($input: EditMediaInput!) {
  editMedium(input: $input) {
    media {
      id
      url
      mime
    }
  }
}`

export const getCategorybySocialIdQuery = gql`
query socialProfile ($id: ID!) {
  socialProfile(id : $id) {
    categories {
      edges {
        node {
          id
          name
          color
        }
      }
    }
  }
}`


export const assetsBySocialProfile = gql`
query assetsBySocialProfile ($id: ID!) {
  categories_bySocialProfile(socialProfileId: $id)
  {
    id
    name
    color
    media (inBank: true) {
      edges{
        node{
          id
          url
          mime
        }
      }
    }
  } 
}`
export const assetsByCategory = gql`
query assetsByCategory ($id: ID!) {
  category(id: $id)
  {
    id
    name
    color
    media (inBank: true) {
      edges{
        node{
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
  } 
}`


export const getAssetsForStats = gql`
query getAssets ($profileIds: [ID]) {
  media_find (profileIds: $profileIds) {
    edges {
      node {
        id
        url
        mime
      }
    }
  }
}`