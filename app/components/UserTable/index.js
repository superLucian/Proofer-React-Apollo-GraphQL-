import React, { Component } from 'react'
import {compose, graphql} from 'react-apollo'
import {Button, Dropdown, Form, Grid, Label} from 'semantic-ui-react'
import gql from 'graphql-tag'
import Gravatar from 'react-gravatar'

import fetchTeamRolesQuery from './fetchTeamRolesQuery.gql'
import editTeamRoleMutation from './editTeamRoleMutation.gql'
import deleteTeamRoleMutation from './deleteTeamRoleMutation.gql'
import createTeamRoleInvitationMutation from './createTeamRoleInvitationMutation.gql'

import persist from '../../libraries/persist'
import Notification from '../Notification/index'

import './styles.scss'

const roleOptions = [
  {
    text: 'ADMIN',
    value: 'ADMIN'
  },
  {
    text: 'MODERATOR',
    value: 'MODERATOR'
  },
  {
    text: 'EDITOR',
    value: 'EDITOR'
  }
]

class UserTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedRoleValues: {},
      invitationUserRole: 'EDITOR',
      targetUserEmail: '',
      hideDeletedRowIndex: null
    }
  }

  componentWillUpdate () {
    if (this.state.hideDeletedRowIndex) {
      this.setState({
        hideDeletedRowIndex: null
      })
    }
    return true
  }

  onInvitationUserRoleChange = (e) => {
    this.setState({
      invitationUserRole: e.target.value
    })
  }

  onTargetUserEmailChange = (e) => {
    this.setState({
      targetUserEmail: e.target.value
    })
  }

  onDelEvent = (teamRoleId, data) => {
    let { deleteTeamRole } = this.props
    // pseudo optimistic ui
    this.setState({
      hideDeletedRowIndex: data.data.rowIndex
    })
    deleteTeamRole(teamRoleId).then((data) => {
      if (data.data.deleteTeamRole) {
        Notification.success('User successfully removed from team.')
      } else {
        Notification.error('User couldn\'t be removed from the team. Please try again.')
      }
    })
  }

  saveTeamRole = (teamRoleId, role) => {
    let { editTeamRole } = this.props
    editTeamRole(teamRoleId, role)
      .then((data) => {
        Notification.success('Saved successfully.')
      })
      .catch((error) => {
        Notification.error('Failed to save, please try again.')
      })
  }

  onSendInvitation = () => {
    let { sendTeamInvite } = this.props
    let { targetUserEmail, invitationUserRole } = this.state
    sendTeamInvite(targetUserEmail, invitationUserRole)
    .then((data) => {
      Notification.success('Invitation sent!')
    }).catch((e) => {
      Notification.error(e.toString())
    })
    this.setState({
      targetUserEmail: '',
      invitationUserRole: 'EDITOR'
    })
  }

  renderUsersInfo = (hideDeletedRowIndex) => {
    let currentUserEmail = persist.willGetEmail()
    if (this.props.data.loading === false && this.props.data.team) {
      let teamRolesRaw = this.props.data.team.teamRoles.edges
      let teamRoles = teamRolesRaw.map((e) => {
        return e.node
      })

      return (
        teamRoles.map((roleInfo, index) => {
          let {user} = roleInfo
          return (
            hideDeletedRowIndex !== index &&
            <Grid.Row key={index} columns={16} verticalAlign='middle'>
              <Grid.Column width={8}>
                <Label image={true} size='large'>
                  <Gravatar email={user.email} />
                  {user.firstName} {user.lastName}
                </Label>
              </Grid.Column>
              <Grid.Column width={6} textAlign='center'>
                <Form>
                  <Dropdown
                    fluid
                    selection
                    options={roleOptions}
                    defaultValue={roleInfo.role}
                    disabled={user.email === currentUserEmail}
                    onChange={(e, data) => this.saveTeamRole(roleInfo.id, data.value)}
                  />
                </Form>
              </Grid.Column>
              <Grid.Column width={2}>
                <Button icon='trash outline' data={{rowIndex: index}} onClick={(e, data) => this.onDelEvent(roleInfo.id, data)} />
              </Grid.Column>
            </Grid.Row>
          )
        })
      )
    }
  }

  render () {
    let {invitationUserRole, targetUserEmail, hideDeletedRowIndex} = this.state
    return (
      <div className='page-wrapper manage-team'>
        <Grid centered>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={10} computer={7}>
              <Grid centered>
                {this.renderUsersInfo(hideDeletedRowIndex)}
                <Grid.Row verticalAlign='middle' columns={16}>
                  <Form onSubmit={this.onSendInvitation}>
                    <Form.Group>
                      <Form.Input placeholder='email' onChange={this.onTargetUserEmailChange} value={targetUserEmail} />
                      <Dropdown
                        selection
                        options={roleOptions}
                        defaultValue={invitationUserRole}
                        onChange={this.onInvitationUserRoleChange}
                      />
                      <Form.Button>Invite</Form.Button>
                    </Form.Group>
                  </Form>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

// refetchQuery required for delete mutation to refresh the cache.
export default compose(
  graphql(gql`${fetchTeamRolesQuery}`, {
    options: (props) => ({
      variables: {
        id: props.teamId
      }
    })
  }),
  graphql(gql`${editTeamRoleMutation}`, {
    props: ({ mutate }) => ({
      editTeamRole: (teamRoleId, teamRoleRole) => {
        return mutate({
          variables: {
            input: {
              teamRoleId,
              teamRoleRole
            }
          }
        })
      }
    })
  }),
  graphql(gql`${deleteTeamRoleMutation}`, {
    props: ({ mutate }) => ({
      deleteTeamRole: (id) => {
        return mutate({
          variables: {
            input: {
              id
            }
          }
        })
      }
    }),
    options: (props) => ({
      refetchQueries: [
        {
          query: gql`${fetchTeamRolesQuery}`,
          variables: {
            id: props.teamId
          }
        }
      ]
    })
  }),
  graphql(gql`${createTeamRoleInvitationMutation}`, {
    props: ({ ownProps, mutate }) => ({
      sendTeamInvite: (targetEmail, teamRoleRole) => {
        return mutate({
          variables: {
            input: {
              targetEmail,
              teamRoleRole,
              teamId: ownProps.teamId
            }
          }
        })
      }
    })
  })
)(UserTable)
