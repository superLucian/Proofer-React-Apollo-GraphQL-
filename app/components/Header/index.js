import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { createApolloFetch } from 'apollo-fetch'
import Link from 'next/link'
import { Menu, Dropdown, Icon, Dimmer, Modal, Button } from 'semantic-ui-react'
import Loader from '../Loader'
import Plans from '../Plans'
import persist from '../../libraries/persist'
import redirect from '../../libraries/redirect'
import SelectTeamAndProfile from './selectTeamAndProfile.js'
import {meHeader} from './graphql/queries'
import Gravatar from 'react-gravatar'
import Notification from '../Notification'

import './styles.scss'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalOpen: false,
      token: this.props.token
    }
  }

  logOut = () => {
    // Force a reload of all the current queries now that the user is
    // logged in
    this.props.client.resetStore().then(() => {
      // Clear store data
      persist.willRemoveAccessToken()
      persist.willRemoveRefreshToken()
      persist.willRemoveEmail()
      persist.willRemoveTeamId()
      persist.willRemoveCurrentSocialProfile()
      persist.willRemoveCurrentMultiSocialProfiles()

      // Now redirect to the homepage
      redirect({}, '/app/login')
    })
  }

  useProfile = (service) => {
    const teamId = this.props.teamId
    const token = this.state.token
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
        const apolloFetch = createApolloFetch({ uri: baseUrl + '/graphql/' })
        apolloFetch(refreshOperation)
          .then((refreshData) => {
            console.log(refreshData)
            if (refreshData.error) {
              console.log('Refresh error data')
              console.error(refreshData.error)
            } else {
              persist.willSetAccessToken(refreshData.data.tokenRefresh.token)
              fullUrl = baseUrlConnect + '?bearer=' + refreshData.data.tokenRefresh.token + '&teamGID=' + teamId
              this.openModal(service, refreshData.data.tokenRefresh.token)
            }
          })
          .catch((error) => {
            console.log('Apollo fetch error data')
            console.log(error)
          })
      } else if (res.error) {
          throw res
      } else {
        this.openModal(service)
      }
    })
    .catch((error) => {
      console.error(error)
      if (error.error === 'Please upgrade your account to add more social profiles.') Notification.error(error.error)
      if (error.name === 'TypeError') this.openModal(service)
    })
  }

  openModal = (socialNetwork, token = null) => this.setState({ modalOpen: socialNetwork, ...token && {token} })

  closeModal = () => this.setState({ modalOpen: false })

  renderModal = () => {
    const baseUrl = process.env.API_ENDPOINT_BASE
    const baseUrlConnect = baseUrl + '/connect/' + this.state.modalOpen
    const token = this.state.token
    let fullUrl = baseUrlConnect + '?bearer=' + token + '&teamGID=' + this.props.teamId
    return (
      <Modal
        open={!!this.state.modalOpen}
        size='mini'
      >
        <Modal.Content>
          You will be redirected to {this.state.modalOpen}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.closeModal()}>
            <Icon name='remove'/> Cancel
          </Button>
          <Button className='success' as='a' href={fullUrl}>
            <Icon name='checkmark'/> Go!
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render () {
    const { data, errors, token, teamId, socialId, socialIds } = this.props
    if (!token) {
      return (<Dimmer active={true} page>
        <Loader />
      </Dimmer>)
    }

    if (errors) {
      return (<div>Error {errors[0].message}</div>)
    }

    if (!data.me) {
      return (<Dimmer active page>
        <Loader />
      </Dimmer>)
    }

    const email = persist.willGetEmail()

    const profiles = [
      {key: 'twitter', icon: 'twitter', text: 'Twitter', value: 'twitter', onClick: () => {this.useProfile('twitter')}},
      {key: 'facebook', icon: 'facebook f', text: 'Facebook', value: 'facebook', onClick: () => {this.useProfile('facebook')}},
      {key: 'instagram', icon: 'instagram', text: 'Instagram (planning)', value: 'instagram', onClick: () => {this.useProfile('instagram')}},
      //{key: 'linkedin', icon: 'linkedin', text: 'LinkedIn', value: 'linkedin'}
    ]

    return (
      <Menu className='custom-navbar' inverted size={'mini'} fixed={'left'} vertical>
        {/*
        <Menu.Item header>
          <Icon name='content' onClick={this.toggleButtonClicked} />
        </Menu.Item>
        */}
        <Dropdown
          className='item'
          icon={false}
          pointing={'left'}
          trigger={
            <div><Gravatar email={email} size={40} default='identicon' className='ui mini circular image' /></div>
          }>
          <Dropdown.Menu>
            <Link prefetch href='/app/account'>
              <Dropdown.Item
                text='My Account'
              />
            </Link>
            <Link prefetch href='/app/manageteam'>
              <Dropdown.Item
                text='Manage Team'
              />
            </Link>
            <Modal
              trigger={<Dropdown.Item text='Upgrade' />}
            >
              <Modal.Content>
                <Plans currentPlan={data.me.plan}/>
              </Modal.Content>
            </Modal>
            <Dropdown.Item
              className='log-out'
              text='Log Out'
              onClick={this.logOut.bind(this)} />
          </Dropdown.Menu>
        </Dropdown>




        <SelectTeamAndProfile useTeamId={this.props.useTeamId} useSocialProf={this.props.useSocialProf} teamId={teamId} socialId={socialId} socialIds={socialIds} myTeams={data.me.teams} />
        <Dropdown trigger={
            <span><Icon name='plus circle' size={'large'} /></span>
          }
          icon={ false}
          className='item add-profile'
          options={profiles}
          selectOnBlur={false}
          pointing={'left'}
        />
        {this.state.modalOpen && this.renderModal()}

      </Menu>
    )
  }
}


export default compose(graphql(meHeader))(Header)
