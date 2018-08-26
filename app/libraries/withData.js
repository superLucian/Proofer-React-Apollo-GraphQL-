import React from 'react'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import initApollo from './apolloClient'
import persist from './persist'

export default ComposedComponent => {
  return class WithData extends React.Component {
    static async getInitialProps (context) {
      let serverState = {}
      const token = persist.willGetAccessToken(context)
      const teamId = persist.willGetTeamId(context)
      const refreshToken = persist.willGetRefreshToken(context)

      // Setup a server-side one-time-use apollo client for initial props and
      // rendering (on server)
      const apollo = initApollo({}, { token, teamId, refreshToken })

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {}
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(context, apollo)
      }

      // Run all graphql queries in the component tree
      // and extract the resulting data
      if (!process.env.BROWSER) {
        if (context.res && context.res.finished) {
          // When redirecting, the response is finished.
          // No point in continuing to render
          return
        }

        // Provide the `url` prop data in case a graphql query uses it
        const url = {query: context.query, pathname: context.pathname}

        // Run all graphql queries
        const app = (
          <ApolloProvider client={apollo}>
            <ComposedComponent url={url} {...composedInitialProps} />
          </ApolloProvider>
        )

        try {
          await getDataFromTree(app)
        } catch (error) {
          console.log('getDataFromTree error: ', error)
        }

        // Extract query data from the Apollo's store
        const state = apollo.extract()
        // console.log("State: ", state)

        serverState = {
          apollo: { // Make sure to only include Apollo's data state
            data: state
          }
        }
      }

      return {
        serverState,
        ...composedInitialProps
      }
    }

    constructor (props) {
      super(props)
      // Note: Apollo should never be used on the server side beyond the initial
      // render within `getInitialProps()` above (since the entire prop tree
      // will be initialized there), meaning the below will only ever be
      // executed on the client.
      const options = {
        token: persist.willGetAccessToken(),
        teamId: persist.willGetTeamId(),
        refreshToken: persist.willGetRefreshToken()
      }
      this.apollo = initApollo(this.props.serverState, options)
    }

    render () {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      )
    }
  }
}
