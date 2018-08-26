import React from 'react'
import Login from '../../components/Login'
import DefaultCon from '../../containers/Default'
import withData from '../../libraries/withData'
import redirect from '../../libraries/redirect'
import checkLoggedIn from '../../libraries/checkLoggedIn'

class LoginPage extends React.Component {
  static getInitialProps (context, apolloClient) {
    const { loggedInUser } = checkLoggedIn(context, apolloClient)
    if (loggedInUser.user) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/app/dashboard')
    }
    return {}
  }

  render () {
    return (
      <DefaultCon title='Sign In' {...this.props}>
        <Login />
      </DefaultCon>
    )
  }
}
export default withData(LoginPage)
