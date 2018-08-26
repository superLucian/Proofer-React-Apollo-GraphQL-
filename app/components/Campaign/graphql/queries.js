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

export const deleteContent = gql`
mutation deleteContent($input: EditContentInput!) {
  editContent(input: $input) {
    content {
      id
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


export const campaignBySocialProfile = gql`
query campaignBySocialProfile ($id: ID!) {
  categories_bySocialProfile(socialProfileId: $id)
  {
    id
    name
    color
    contents (inBank: true) {
      edges{
        node{
          id
          text
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
          media{
            id
            url
            mime
  				}
        }
      }
    }
  }
}`
export const campaignByCategory = gql`
query campaignByCategory ($id: ID!) {
  category(id: $id)
  {
    id
    name
    color
    contents (inBank: true) {
      edges{
        node{
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
