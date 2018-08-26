import React, { Component } from 'react'
import {compose, graphql} from 'react-apollo'
import {Button, Dropdown, Form, Grid, Label,Header,Modal} from 'semantic-ui-react'
import gql from 'graphql-tag'
import Gravatar from 'react-gravatar'

import editUserGql from './editUser.gql'
import { editUser,changePassword } from './editMutation'
import persist from '../../libraries/persist'
import Notification from '../Notification/index'

import './styles.scss'

class AccountManagement extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isSaving: false,
      editableFirstNameField:false,
      editableLastNameField:false,
	  updatePasswordField:false,
	  visible: false,
	  load:false
    }

  this.saveFirstName = this.saveFirstName.bind(this);
  this.savePassword = this.savePassword.bind(this);
  }

  saveFirstName() {
    const { editUser } = this.props;
    const { firstName,lastName,userId } = this.state;
    this.setState({
      isSaving: true,
	  load:true
    });
    editUser({ userId,firstName,lastName })
    .then(() => {
      this.setState({
        isSaving: false,
        editableFirstNameField:false,
		editableLastNameField:false,
		load:false
      })
      Notification.success('Saved Successfully');
    })
    .catch((e) => {
      this.setState({
        isSaving: false,
		load:false
      })
      Notification.error('Update Name Error');
    });
  }

  savePassword() {
    const { changePassword } = this.props;
    const {oldPassword,newPassword,confirmPassword,email} = this.state;
	  if(newPassword==confirmPassword) {
      this.setState({
        isSaving: true,
        load:true
      });
      changePassword({ oldPassword,newPassword,email })
      .then(() => {
        this.setState({
          isSaving: false,
          load:false
        })
        Notification.success('Saved Successfully');
      })
      .catch((e) => {
        this.setState({
          isSaving: false,
          load:false
        })
        Notification.error('Update password Error');
      });
    }
    else{
      Notification.error('password not match')
    }
  }

  handleFirstNameClick = () => {
    const { data } = this.props;
    this.setState({
      editableFirstNameField:true,
	  editableLastNameField:true,
      firstName:data.me.firstName,
      lastName:data.me.lastName,
      userId: data.me.id
    })
  }

  handlePasswordClick = () => {
    const { data } = this.props;
    this.setState({
      updatePasswordField:true,
	  email:data.me.email
    })
	var self = this;

      self.setState({visible: true});


      self.setState(self.getInitialState());

  }
  handleModalClose = () => {
    const { data } = this.props;
    this.setState({
      updatePasswordField:true,
	  email:data.me.email
    })
	var self = this;

      self.setState({visible: false});

  }
  render () {
    const { firstName,lastName,oldPassword,newPassword,confirmPassword } = this.state;
    const { data } = this.props;
    if(data.loading) {
      return (<div />)
    }
    return (
      <div className='page-wrapper account-management'>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={9} >
              <Header className="custom-header-long">
                Account Settings
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column className='input-label'>
              Name
            </Grid.Column>
            <Grid.Column width={3}>
              <Form.Input placeholder='First Name'
                          type='text'
                          name='firstname'
                          className="input"
                          value={firstName || data.me.firstName }
                          disabled={!this.state.editableFirstNameField}
                          onChange={(event) => this.setState({ firstName:event.target.value })}
              />
            </Grid.Column>

			<Grid.Column width={3}>
			  <Form.Input placeholder='Last Name'
                          type='text'
                          className="input"
                          name='lastname'
                          value={lastName || data.me.lastName}
                          disabled={!this.state.editableLastNameField}
                          onChange={(event) => this.setState({ lastName:event.target.value })}
              />
	   	    </Grid.Column>
       	    <Grid.Column width={2}>
              {
                !this.state.editableLastNameField &&
                  <Button icon='edit'
                          className='edit-content'
                          onClick={this.handleFirstNameClick}
                  />
              }
              {
                this.state.editableLastNameField &&
                  <Button
					icon='checkmark'
                    className='save-content'
                    onClick={this.saveFirstName}
					loading={this.state.load}
                  />
              }
            </Grid.Column>
          </Grid.Row>
		  <Grid.Row >
	        <Grid.Column className='input-label'>
			     Password
			      </Grid.Column>
			      <Grid.Column width={6}>
			    	  <Form.Input
							placeholder='Password'
							type='password'
							name='lastname'
							className="input"
							value={lastName || data.me.lastName}
							disabled={!this.state.NameEnable}
							onChange={this.handleChange}
              />
	   	      </Grid.Column>

            <Grid.Column width={2}>
			        <Button
						icon='edit'
						className='edit-content'
						onClick={this.handlePasswordClick}
					/>
            </Grid.Column>
          </Grid.Row>

		  <div>
			<Modal size='tiny' open={this.state.visible} onClose={this.close} dimmer='inverted' >
			 <i className='close icon' id='close' onClick={this.handleModalClose}/>
			 <Modal.Content>
				<Grid centered>
					<Grid.Row id='modal_center' textAlign='center'>
						<Grid.Column width={4} textAlign='center' className='input-label'>
							<label> Old Password</label>
						</Grid.Column>
						<Grid.Column width={6} textAlign='center'>
							<Form.Input
								  placeholder='Password'
								  type='password'
								  name='oldPassword'
								  className="input"
								  disabled={this.state.NameEnable}
								  onChange={(event) => this.setState({ oldPassword:event.target.value })}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row textAlign='center'>
						<Grid.Column width={4} textAlign='center' className='input-label'>
							<label> New Password</label>
						</Grid.Column>
						<Grid.Column width={6} textAlign='center'>
							<Form.Input
								  placeholder='Password'
								  type='password'
								  name='newPassword'
								  className="input"
								  disabled={this.state.NameEnable}
								  onChange={(event) => this.setState({ newPassword:event.target.value })}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row textAlign='center'>
						<Grid.Column width={4} textAlign='center' className='input-label'>
							<label> Confirm Password</label>
						</Grid.Column>
						<Grid.Column width={6} textAlign='center'>
							<Form.Input
								  placeholder='Password'
								  type='password'
								  name='confirmPassword'
								  className="input"
								  disabled={this.state.NameEnable}
								  onChange={(event) => this.setState({ confirmPassword:event.target.value })}
							/>
						</Grid.Column>
					  </Grid.Row>
				</Grid>
			 </Modal.Content>
			 <Modal.Actions>
				<Button
					negative
					onClick={this.handleModalClose}>
				  Cancel
				</Button>
				<Button
					positive
					icon='checkmark'
					labelPosition='right'
					content='Update'
					onClick={this.savePassword}
					loading={this.state.load}/>
			 </Modal.Actions>
			</Modal>
		  </div>

        </Grid>
	   </div>
    )
  }
}

const AccountManagementWithData = compose(
  graphql(gql`${editUserGql}`),
  graphql(editUser,{
    props({ owProps,mutate }) {
      return {
        editUser({ userId,firstName,lastName }) {
          return mutate({
            variables:{
              input:{
                userId,
                firstName,
                lastName,
              }
            }
          })
        }
      }
    }
  }),
  graphql(changePassword,{
    props({ owProps,mutate }) {
      return {
        changePassword({ oldPassword,newPassword,email }) {
          return mutate({
            variables:{
              input:{
                oldPassword,
				newPassword,
				email
              }
            }
          })
        }
      }
    }
  })
)(AccountManagement)

export default AccountManagementWithData;
