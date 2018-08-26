import gql from 'graphql-tag'

export const checkoutPageUrl = gql`
query checkoutPageUrl($plan : PaymentPlan){
  checkoutPageUrl(plan: $plan)
}`

export const team = gql`
query team ($id: ID!) {
  team(id: $id) {
    id
    name
    socialProfiles {
      edges{
        node{
          id
          name
          socialNetwork
          profilePicture
          facebookPageName
        }
      }
    }
  }
}`

export const meHeader = gql`
query meHeader{
  me {
    firstName
    id
    plan
    teams {
      edges {
        node {
          id
          name
          socialProfiles{
            edges{
              node{
                id
                name
                socialNetwork
                profilePicture
                facebookPageName
                createdAt
                twitterFriends {
                  count
                }
                twitterFollowers {
                  count
                }
              }
            }
          }
        }
      }
    }
  }
}
`
