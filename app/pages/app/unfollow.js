import React from 'react'
import withData from '../../libraries/withData'
import AuthCon from '../../containers/Auth'
import redirect from '../../libraries/redirect'
import checkLoggedIn from '../../libraries/checkLoggedIn'
import persist from '../../libraries/persist'
import Unfollow from '../../components/Unfollow/index'

class UnfollowPage extends React.Component {
  static getInitialProps (context, apolloClient) {
    const refreshToken = persist.willGetRefreshToken(context)
    const accessToken = persist.willGetAccessToken(context)
    const socialId = persist.willGetCurrentSocialProfile(context)
    const teamId = persist.willGetTeamId(context)
    const { loggedInUser } = checkLoggedIn(context, apolloClient)

    if (!loggedInUser.user) {
      // Not signed in yet?
      // Throw them back to the login page
      redirect(context, '/app/login')
    }

    return { token: accessToken, refreshToken: refreshToken, socialId: socialId, teamId: teamId }
  }

  render () {
    return (
      <AuthCon title='Unfollow' {...this.props}>
        <Unfollow />
      </AuthCon>
    )
  }
}
export default withData(UnfollowPage)
