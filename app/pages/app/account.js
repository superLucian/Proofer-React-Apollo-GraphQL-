import React from 'react'
import AccountManagement from '../../components/AccountManagement'
import DefaultCon from '../../containers/Default'
import AuthCon from '../../containers/Auth'
import withData from '../../libraries/withData'
import redirect from '../../libraries/redirect'
import checkLoggedIn from '../../libraries/checkLoggedIn'
import persist from '../../libraries/persist'

class AccountManagementPage extends React.Component {
  static getInitialProps (context, apolloClient) {
    const refreshToken = persist.willGetRefreshToken(context)
    const accessToken = persist.willGetAccessToken(context)
    const teamId = persist.willGetTeamId(context)
    const { loggedInUser } = checkLoggedIn(context, apolloClient)
    console.log(loggedInUser.user)
    if (!loggedInUser.user) {
      // Not signed in yet?
      // Throw them back to the login page
      redirect(context, '/app/login')
    }


    return { token: accessToken, refreshToken: refreshToken, teamId }
  }

  render () {
    return (
     <AuthCon title='Account Settings' {...this.props}>
        <AccountManagement  />
      </AuthCon>
    )
  }
}
export default withData(AccountManagementPage)
