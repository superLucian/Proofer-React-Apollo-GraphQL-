import React from 'react'
import SignUp from '../../components/SignUp'
import DefaultCon from '../../containers/Default'
import withData from '../../libraries/withData'
import redirect from '../../libraries/redirect'
import checkLoggedIn from '../../libraries/checkLoggedIn'

class SignUpPage extends React.Component {
  static async getInitialProps (context, apolloClient, query) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient)

    if (loggedInUser.user) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/app/dashboard')
    }

    return {query: context.query}
  }

  render () {
    return (
      <DefaultCon title='Create account' {...this.props}>
        <SignUp query={this.props.query} />
      </DefaultCon>
    )
  }
}
export default withData(SignUpPage)
