import { createApolloFetch } from 'apollo-fetch'
import persist from './persist'
import { TokenRefreshLink } from 'apollo-link-token-refresh-before-refetch'
import jwt_decode from 'jwt-decode'

export default class JWTRefreshLink {
  constructor (params) {
    const { uri, token, teamId, refreshToken } = params
    this.apolloFetch = createApolloFetch({ uri })
    this.refreshOperation = {
      query: `mutation tokenRefresh($input: RefreshTokenInput!) {
      tokenRefresh(input: $input) {
        token
      }
    }`,
      variables: {
        input: {
          refreshToken: refreshToken
        }
      },
      context: {
        headers: {
          'authorization': token ? `Bearer ${token}` : null,
          'X-Proof-TeamId': teamId ? `${teamId}` : `NONE`
        }
      }
    }
  }

  getLink = (storedToken) => {
    return new TokenRefreshLink({
      accessTokenField: 'token',
      isTokenValidOrUndefined: () => {
        const token = persist.willGetAccessToken() || storedToken
        if (!token) return true
        const decodedJwt = jwt_decode(token)
        return Math.floor(Date.now() / 1000) - decodedJwt.exp <= -30

      },
      fetchAccessToken: () => {
        return new Promise((resolve, reject) => {
          this.apolloFetch(this.refreshOperation).then(result => {
            // GraphQL errors and extensions are optional
            const {data, errors, extensions} = result
            if (!errors) {
              const token = data.tokenRefresh.token
              console.log('Refreshed token')
              const init = {status: 200, statusText: 'ok'}
              const response = new Response(JSON.stringify({token}), init)
              resolve(response)
            }
          })
            .catch(error => {
              // respond to a network error
              reject(error)
            })
        })
      },
      handleFetch: (token) => {
        persist.willSetAccessToken(token)
      },
      beforeRefetch: (token, operation) => {
        const oldContext = operation.getContext()
        operation.setContext({
          ...oldContext,
          headers: {
            ...oldContext.headers,
            authorization: `Bearer ${token}`
          },
          http: {
            includeExtensions: true
          }
        })
        return operation
      },
      handleError: (err) => {
        // full control over handling token fetch Error
        console.warn('Your refresh token is invalid. Try to relogin')
        console.error(err)

        // your custom action here
        // user.logout()
      }
    })
  }
}
