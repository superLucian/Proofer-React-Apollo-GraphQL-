import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { LoggingLink } from 'apollo-logger'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
// import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import JWTRefreshLink from './JWTRefreshLink'
import persist from './persist'

import RetryLink from './retryLink'

import fetch from 'cross-fetch'

let apolloClient = null
let storedToken = ''

const isDev = process.env.NODE_ENV === 'development'
const __APOLLO_LOGGING__ = isDev

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create (initialState, { token, teamId, refreshToken }) {
  const uri = process.env.API_ENDPOINT_BASE + '/graphql/'
  if (persist.willGetAccessToken() || token) {
    storedToken = persist.willGetAccessToken() || token
  }

  // Refresh token link
  const refreshLink = new JWTRefreshLink({uri, storedToken, teamId, refreshToken})

  // HTTP link
  const httpLink = new HttpLink({ uri })

  // Error link
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        const location = locations.map(loc => loc)
        const paths = locations.map(path => path)
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${location}, Path: ${paths}`
        )
      })
    if (networkError) {
      if (networkError.length > 0) {
        networkError.map(({ message, locations, path }) =>
          console.log(
            `[Network error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      } else {
        console.log(`[Network error]: ${networkError}`);
      }
    }
  })

  const middlewareLink = (operation, next) => {
    const token = persist.willGetAccessToken() || storedToken
    operation.setContext(context => ({
      ...context,
      headers: {
        ...context.headers,
        'authorization': token ? `Bearer ${token}` : null,
        'X-Proof-TeamId': teamId ? `${teamId}` : `NONE`
      }
    }))
    return next(operation)
  }

  const link = ApolloLink.from(
    (__APOLLO_LOGGING__ ? [new LoggingLink()] : []).concat([
      RetryLink,
      errorLink,
      middlewareLink,
      refreshLink.getLink(token),
      httpLink,
    ])
  )

  return new ApolloClient({
    // connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo (initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient || options.recreateApollo) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}
