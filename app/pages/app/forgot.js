import React from 'react'
import ForgotPassword from '../../components/ForgotPassword'
import DefaultCon from '../../containers/Default'
import withData from '../../libraries/withData'
import redirect from '../../libraries/redirect'
import checkLoggedIn from '../../libraries/checkLoggedIn'

class ForgotPasswordPage extends React.Component {
  static async getInitialProps (context, apolloClient) {
    const { loggedInUser } = await checkLoggedIn(context, apolloClient)

    if (loggedInUser.user) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/app/dashboard')
    }

    return {}
  }

  render () {
    return (
      <DefaultCon title='Forgot Password' {...this.props}>
        <ForgotPassword />
      </DefaultCon>
    )
  }
}
export default withData(ForgotPasswordPage)
