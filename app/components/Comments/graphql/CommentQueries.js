import gql from 'graphql-tag'

export const getCommentsByContent = gql`
query ($contentId: ID!){
  comments_byContent (contentId: $contentId) {
    edges{
      node{
        id
        text
        user{
          id
          firstName
          lastName
          email
        }
      }
    }
  }
}`
export const  createCommentMutation= gql`
mutation ($input: CreateCommentInput!){
  createComment (input: $input) {
    comment {
      id
      text
      createdAt
    }
  }
}`
