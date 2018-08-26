import React, { Component } from 'react'
import { graphql, withApollo, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Link from 'next/link'
import Router from 'next/router'
import { Grid, Header, Form, Button } from 'semantic-ui-react'
import Notification from '../Notification'

import redirect from '../../libraries/redirect'
import { isStringEmpty } from '../../libraries/validations'

import resetPassGql from './resetPass.gql'
import Logo from '../../static/images/proofer-logo.svg'

import './styles.scss'
import '../NoAuth.scss'

class ResetPassword extends Component {
  state = { password: '', password1: '', loading: false }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const { password, password1 } = this.state

    this.setState({loading: true})

    if (isStringEmpty(password)) {
      Notification.error('Password field can not be empty')
      return
    }

    if (password !== password1) {
      Notification.error('Passwords do not match')
      return
    }

    const client = this.props.client
    const token = Router.router.query.resetToken

    this.props.resetPassword({input: { newPassword: password, token: token }})
    .then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
        if (errors.length > 0) {
          Notification.error(errors[0].message)
        }
      } else {
        if (data.changePasswordFromToken) {
          Notification.success('Reset password successfully')

          // Force a reload of all the current queries now that the user is
          // logged in
          client.resetStore().then(() => {
            // Now redirect to the homepage
            redirect({}, '/app/login')
          })
        }
      }
    }).catch((error) => {
      this.setState({loading: false})
      Notification.error(error.message)
    })
  }

  render () {
    const { createdUser } = this.props

    if (false) {
      return (<div className="no-auth-page">
        <Grid centered id="no-auth-container">
          <Grid.Row columns={1}>
            <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={6} widescreen={4}>
              <Header className="custom-header">
                <Logo width='80%' className='align-center custom-image-style'/>
                Reset your password
              </Header>
              <h3>
                Please check your email and follow the instructions there.
              </h3>
              <div className="secondary-action">
                Go to <Link prefetch href='/app/login'><a>Login</a></Link>.
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>)
    } else {
      const { password, password1 } = this.state
      return (<div className="no-auth-page">
        <Grid centered id="no-auth-container">
          <Grid.Row columns={1}>
            <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={6} widescreen={4}>
              <Header className="custom-header">
                <Logo width='80%' className='align-center custom-image-style'/>
                Reset your password
              </Header>
              <Form onSubmit={this.handleSubmit.bind(this)} className="input-form">
                <Form.Input required placeholder='New Password' type='password' name='password' min={6} value={password} onChange={this.handleChange} className="input" />
                <Form.Input required placeholder='Confirm New Password' type='password' name='password1' min={6} value={password1} onChange={this.handleChange} className="input" />

                <Button type='submit' className="submit-button field input" loading={this.state.loading}>Reset Password</Button>
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
  graphql(gql`${resetPassGql}`, {
    props ({ mutate }) {
      return {
        resetPassword (resetVariables) {
          return mutate({ variables: resetVariables })
        }
      }
    }
  })
)(ResetPassword)
