import cookies from 'next-cookies'
// import gql from 'graphql-tag'

export default (context, apolloClient) => {
  const { prAccessToken } = cookies(context)
  if (prAccessToken) {
    return { loggedInUser: { user: { accessToken: prAccessToken } } }
  } else {
    return { loggedInUser: {} }
  }
  /* return apolloClient.query({
    query: gql`
      query getUser {
        user {
          id
          name
        }
      }
    `
  }).then(({ data }) => {
    return { loggedInUser: data }
  }).catch(() => {
    // Fail gracefully
    return { loggedInUser: {} }
  }) */
}
