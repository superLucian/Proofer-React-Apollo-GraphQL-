import React from 'react'
import { graphql, withApollo, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Link from 'next/link'
import {Grid, Header, Form, Button, Message} from 'semantic-ui-react'
import Notification from '../Notification'

import persist from '../../libraries/persist'
import { isEmail, isStringEmpty } from '../../libraries/validations'
import initApollo from '../../libraries/apolloClient'

import loginGql from './login.gql'
import fetchTeamId from './fetchTeamId.gql'
import Logo from '../../static/images/proofer-logo.svg'

import '../NoAuth.scss'

class Login extends React.Component {
  state = { email: '', password: '', load: false, userMessage: false }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const { email, password } = this.state
    this.setState({ load: true })

    if (!isEmail(email)) {
      Notification.error('Please enter a valid email address')
      this.setState({ load: false })
      return
    }

    if (isStringEmpty(password)) {
      Notification.error('Password field can not be empty')
      this.setState({ load: false })
      return
    }

    const client = this.props.client

    this.props.login({input: { email, password }})
    .then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
        if (errors.length > 0) {
          Notification.error(errors[0].message)
        }
      } else {
        // Update token data

        if (data.login) {
          let notificationQueue = Notification.createQueue()
          Notification.success('Sign in success!', 3000, notificationQueue)
          Notification.custom('Loading Application', {background: "#6eb1ea", text: "#FFF"} , -1, notificationQueue)

          // Store the token in cookies
          persist.willSetAccessToken(data.login.token)
          persist.willSetRefreshToken(data.login.refreshToken)
          persist.willSetEmail(email)

          // Force a reload of all the current queries now that the user is
          // logged in
          client.resetStore().then(() => {
            let client = initApollo({}, {
              recreateApollo: true,
              token: data.login.token,
              refreshToken: data.login.refreshToken
            })

            // Get Ids of available teams & set cookie
            client.query({
              query: gql`${fetchTeamId}`
            }).then(data => {
              let teams = data.data.me.teams.edges.filter(val => !!val.node)
              const profiles = []
              teams[0].node.socialProfiles.edges.map(item => {
                if (!!item.node) {
                  profiles.push(item.node.id.trim())
                }
              })
              console.log(profiles)
              if (profiles.length !== 0) {
                const socialProfiles = JSON.stringify(profiles[0])
                persist.willSetCurrentMultiSocialProfiles(socialProfiles)
              }
              persist.willSetTeamId(teams[0].node.id)
              // Now redirect to the homepage
              if (typeof window !== 'undefined') window.location.href = '/app/dashboard'
            })
          })
        }
      }
    }).catch((error) => {
      if (error.message === 'GraphQL error: Please reset your password.') {
        this.setState({
          userMessage: {
            title: 'Please reset your password',
            message: 'Thanks for coming back to Proofer! We need everyone to reset their passwords before entering the new site. An email has been sent to you with instructions on how to do that.'
          }
        })
      } else {
        Notification.error(error.message)
      }
      this.setState({ load: false })

    })
  }

  render () {
    const errorMessage = null
    const { email, password, userMessage } = this.state

    return (
      <div className="no-auth-page">
        <Grid centered id="no-auth-container" className='test-container'>
          <Grid.Row columns={1}>
            <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={6} widescreen={4}>
              {userMessage &&
              <Message color="blue">
                <Message.Header className="align-center">{userMessage.title}</Message.Header>
                <p>{userMessage.message}</p>
              </Message>
              }
              <Header className="custom-header">
                <Logo width='70%' className='align-center custom-image-style' />
              </Header>
              <Form onSubmit={this.handleSubmit.bind(this)} className="input-form">
                <Form.Input required placeholder='Email' type='text' name='email' value={email} onChange={this.handleChange} className="input" />
                <Form.Input required placeholder='Password' type='password' name='password' value={password} min={6} onChange={this.handleChange} className="input" />
                {errorMessage && <Message
                  error
                  header='Error'
                  content={errorMessage}
                />}
                <Button type='submit' className="submit-button field input" id='submit' loading={this.state.load}>Sign In</Button>
                <Link prefetch href='/app/forgot'>
                  <a className="secondary-action" id='forgot-button'>
                    Forgot your password?
                  </a>
                </Link>
                <div className="secondary-action">
                  {'Don\'t have an account yet?  '}
                  <Link prefetch href='/app/signup'><a className="register-button">Register</a></Link>
                </div>

              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
};

export default compose(
  // withApollo exposes `this.props.client` used when logging out
  withApollo,
  graphql(gql`${loginGql}`, {
    props ({ mutate }) {
      return {
        login (loginVariables) {
          return mutate({ variables: loginVariables })
        }
      }
    }
  })
)(Login)
