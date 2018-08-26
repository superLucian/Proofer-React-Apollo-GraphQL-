import React from 'react'
import Dashboard from '../../components/Dashboard'
import withData from '../../libraries/withData'
import AuthCon from '../../containers/Auth'
import redirect from '../../libraries/redirect'
import checkLoggedIn from '../../libraries/checkLoggedIn'
import persist from '../../libraries/persist'

class DashboardPage extends React.Component {
  static getInitialProps (context, apolloClient) {
    const refreshToken = persist.willGetRefreshToken(context)
    const accessToken = persist.willGetAccessToken(context)
    const socialId = persist.willGetCurrentSocialProfile(context)
    const teamId = persist.willGetTeamId(context)
    const { loggedInUser } = checkLoggedIn(context, apolloClient)

    if (!loggedInUser.user) {
      redirect(context, '/app/login')
    }
    return { token: accessToken, refreshToken: refreshToken, socialId: socialId, teamId: teamId }
  }

  render () {
    return (
      <AuthCon title='Dashboard' {...this.props}>
        <Dashboard />
      </AuthCon>
    )
  }
}
export default withData(DashboardPage)
