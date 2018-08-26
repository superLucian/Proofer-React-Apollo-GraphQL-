import gql from "graphql-tag";

export const unfollowMutation = gql`
mutation unfollow ($socialProfileId: ID!, $twitterUserId: ID!) {
  unfollow (input: {socialProfileId: $socialProfileId, twitterUserId: $twitterUserId})
}
`
export const followMutation = gql`
mutation follow ($socialProfileId: ID!, $twitterUserId: ID!) {
  follow (input: {socialProfileId: $socialProfileId, twitterUserId: $twitterUserId})
}
`
