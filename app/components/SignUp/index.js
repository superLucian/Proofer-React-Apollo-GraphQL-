import React, { Component } from 'react'
import { graphql, withApollo, compose } from 'react-apollo'
import gql from 'graphql-tag'
import getSignUpMessage from './signUpMessage'

import Link from 'next/link'
import {Grid, Header, Form, Button, Message} from 'semantic-ui-react'
import Notification from '../Notification'

import { isEmail, isStringEmpty } from '../../libraries/validations'

import createUserGql from './createUser.gql'
import Logo from '../../static/images/proofer-logo.svg'

import './styles.scss'
import '../NoAuth.scss'

class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createdUser: this.props.createdUser,
      firstname: '',
      lastname: '',
      name: '',
      email: '',
      password: '',
      loading: false,
      userMessage: getSignUpMessage(this.props.query.message),
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleNameChange = (e, { name, value }) => {
    let [firstname, ...lastname] = value.trim().split(" ")
    firstname = firstname.trim()
    lastname = lastname.join(" ").trim()
    this.setState({ firstname, lastname, name: value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const { firstname, lastname, name, email, password } = this.state

    if (!isEmail(email)) {
      Notification.error('Please enter a valid email address')
      return
    }

    if (isStringEmpty(name)) {
      Notification.error('First name field can not be empty')
      return
    }
    if (isStringEmpty(password)) {
      Notification.error('Password field can not be empty')
      return
    }

    const client = this.props.client

    this.setState({loading: true})

    this.props.createUser({input: { userFirstName: firstname, userLastName: lastname, userEmail: email, userPassword: password }})
    .then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
        if (errors.length > 0) {
          this.setState({loading: false})
          Notification.error(errors[0].message)
        }
      } else {
        if (data.createUser) {
          Notification.success('You\'re registered successfully!')
          this.setState({createdUser: true, loading: false})
        }
      }
    }).catch((error) => {
      this.setState({loading: false})
      Notification.error(error.message)
    })
  }

  render () {
    const { createdUser, userMessage } = this.state

    if (createdUser) {
      return (
        <div className='no-auth-page'>
          <Grid centered id='no-auth-container' verticalAlign="middle">
            <Grid.Row columns={1}>
              <Grid.Column mobile={16} tablet={12} computer={12} largeScreen={8} widescreen={4}>
                <Header className="custom-header">
                  <Logo width='50%' className='align-center custom-image-style'/>
                  Sign Up
                </Header>
                <h3 className='title-header'>
                  Please, check your email to activate your account.
                </h3>
                <div className="secondary-action">
                  If you have already activated the account, please
                  {' '}
                  <Link prefetch href='/app/login'><a>Sign In</a></Link>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>)
    } else {
      const { firstname, lastname, name, email, password } = this.state
      return (
          <div className='no-auth-page'>
            <Grid centered id='no-auth-container'>
              <Grid.Row columns={1}>
                <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={6} widescreen={4}>
                  {userMessage &&
                  <Message color="blue">
                    {userMessage}
                  </Message>
                  }
                  <Header className="custom-header-long">
                    <Logo width='70%' className='align-center custom-image-style' />
                    Sign Up
                  </Header>
                  <Form onSubmit={this.handleSubmit.bind(this)} className='input-form' autoComplete="false">
                    <Form.Input required label='Name' type='text' name='name' value={name} onChange={this.handleNameChange} className="input"/>
                    <Form.Input required  label='Email Address' type='text' name='email' value={email} onChange={this.handleChange} className="input" />
                    <Form.Input required  label='Password' type='password' name='password' min={6} value={password} onChange={this.handleChange} className="input"/>
                    <Button type='submit'  className="submit-button field input" loading={this.state.loading}>CREATE ACCOUNT</Button>
                    {createdUser &&
                      <div style={{ color: '#006B00', padding: '10px' }}>
                          User created successfully!
                     </div>}
                     <div className="secondary-action">
                       Already have an account? <Link prefetch href='/app/login'><a className='signin-button'>Sign In</a></Link>
                     </div>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>)
    }
  }
}

export default compose(
  // withApollo exposes `this.props.client` used when logging out
  withApollo,
  graphql(gql`${createUserGql}`, {
    props ({ mutate }) {
      return {
        createUser (signupVariables) {
          return mutate({ variables: signupVariables })
        }
      }
    }
  })
)(SignUp)
