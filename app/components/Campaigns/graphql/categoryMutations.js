import gql from 'graphql-tag'

export const createCategoryMutation = gql`
mutation createCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    category {
      id
      name
      color
    }
  }
}`
