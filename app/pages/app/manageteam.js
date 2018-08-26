import React from 'react'
import withData from '../../libraries/withData'
import AuthCon from '../../containers/Auth'
import checkLoggedIn from '../../libraries/checkLoggedIn'
import UserTable from '../../components/UserTable'
import redirect from '../../libraries/redirect'
import persist from '../../libraries/persist'

class ManageTeamPage extends React.Component {
  static getInitialProps (context, apolloClient) {
    const refreshToken = persist.willGetRefreshToken(context)
    const accessToken = persist.willGetAccessToken(context)
    const { loggedInUser } = checkLoggedIn(context, apolloClient)

    if (!loggedInUser.user) {
      // Not signed in yet?
      // Throw them back to the login page
      redirect(context, '/app/login')
    }

    const teamId = persist.willGetTeamId(context)

    return { teamId, token: accessToken, refreshToken: refreshToken }
  }

  render () {
    return (
      <AuthCon title='Manage Team' {...this.props}>
        <UserTable teamId={this.props.teamId} />
      </AuthCon>
    )
  }
}

export default withData(ManageTeamPage)
