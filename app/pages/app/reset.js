import React from 'react'
import ResetPassword from '../../components/ResetPassword'
import DefaultCon from '../../containers/Default'
import withData from '../../libraries/withData'
import redirect from '../../libraries/redirect'
import checkLoggedIn from '../../libraries/checkLoggedIn'

class ResetPasswordPage extends React.Component {
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
      <DefaultCon title='Reset Password' {...this.props}>
        <ResetPassword />
      </DefaultCon>
    )
  }
}
export default withData(ResetPasswordPage)
