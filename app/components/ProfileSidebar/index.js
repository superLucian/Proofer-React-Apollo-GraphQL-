import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { Menu, Dropdown, Icon, Divider } from 'semantic-ui-react'
import persist from '../../libraries/persist'
import redirect from '../../libraries/redirect'
import SelectProfile from './selectProfile.js'
import fetchTeamId from './fetchTeamId.gql'
import Gravatar from 'react-gravatar'

import './styles.scss'

class ProfileSidebar extends Component {

  render () {
    const { data, errors, token, teamId, socialId,active,refreshToken } = this.props
    if (!token) {
      return (<div />)
    }


    if (errors) {
      return (<div>Error {errors[0].message}</div>)
    }

    const email = persist.willGetEmail()
    return (
      <div className='sidebar-contain open'>
        <Menu vertical className='sidebar-menu'>
          <Menu.Item as='div'>
            <Gravatar email={email} size={26} default="identicon" />
          </Menu.Item>
          <Divider className="divider"/>
          <SelectProfile
            useTeamId={this.props.useTeamId}
            useSocialProf={this.props.useSocialProf}
            teamId={teamId}
            socialId={socialId}
            myTeams={data.me.teams}
          />
          <Divider className="divider" />
          <AddSocialProfile token={token} teamId={teamId} refreshToken={refreshToken} />
        </Menu>
      </div>
    )
  }
}

class AddSocialProfile extends Component {
  useProfile = (event, data) => {
    const service = data.value
    const teamId = this.props.teamId
    const token = this.props.token
    const refreshToken = this.props.refreshToken
    const baseUrl = process.env.API_ENDPOINT_BASE
    const baseUrlConnect = baseUrl + '/connect/' + service
    let fullUrl = baseUrlConnect + '?bearer=' + this.props.token + '&teamGID=' + teamId

    const refreshOperation = {
      query: `mutation tokenRefresh($input: RefreshTokenInput!) {
        tokenRefresh(input: $input) {
          token
        }
      }`,
      variables: {
        input: {
          refreshToken: refreshToken
        }
      },
      context: {
        headers: {
          'authorization': `Bearer ${token}`,
          'X-Proof-TeamId': `${teamId}`
        }
      }
    }

    const options = {
      headers: new Headers({
        'authorization': `Bearer ${token}`,
        'X-Proof-TeamId': `${teamId}`
      })
    }

    fetch(fullUrl, options).then((res) => {
      return res.json()
    })
    .then((res) => {
      if (res.code === 401 && res.message === 'Expired JWT Token') {
        const apolloFetch = createApolloFetch({ uri: baseUrl })
        apolloFetch(refreshOperation)
          .then((refreshData) => {
            console.log(refreshData)
            if (refreshData.error) {
              console.log('Refresh error data')
              console.error(refreshData.error)
            } else {
              persist.willSetAccessToken(refreshData.data.tokenRefresh.token)
              fullUrl = baseUrlConnect + '?bearer=' + refreshData.data.tokenRefresh.token + '&teamGID=' + teamId
              redirect({}, fullUrl)
            }
          })
          .catch((error) => {
            console.log('Apollo fetch error data')
            console.log(error)
          })
      } else {
        redirect({}, fullUrl)
      }
    })
    .catch((error) => {
      console.error(error)
      if (error.message === 'Failed to fetch') redirect({}, fullUrl)
    })
  }

  render () {
	  const twitter = (<Icon className="social-icon" size='large' circular bordered name='twitter'/>)
	  const facebook = (<Icon className="social-icon" size='large' circular bordered name='facebook f'/>)
	  const linkedIn = (<Icon className="social-icon" size='large' circular bordered name='linkedin'/>)
    const profiles = [
      {key: 'twitter',text:<span>{twitter}</span>,  value: 'twitter'},
      {key: 'facebook',text:<span>{facebook}</span>, value: 'facebook'},
      {key: 'linkedin',text:<span>{linkedIn}</span>, value: 'linkedin'}
    ]

    return (
      <Dropdown
        trigger={
          <Icon
            className='social-icon-dropdown'
            circular
            bordered
            size='small'
            name='plus'
          />
        }
		    className="link-selected"
        options={profiles}
        selectOnBlur={false}
        onChange={this.useProfile}
      />
	  )
  }
}

const SocialProfileWithData = graphql(gql`${fetchTeamId}`)(ProfileSidebar)
export default withApollo(SocialProfileWithData)
