import React, { Component } from 'react'
import { graphql, withApollo, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Link from 'next/link'
import { Grid, Header, Form, Button } from 'semantic-ui-react'
import Notification from '../Notification'

import { isEmail } from '../../libraries/validations'

import forgotPassGql from './forgotPass.gql'
import Logo from '../../static/images/proofer-logo.svg'

import './styles.scss'
import '../NoAuth.scss'

class ForgotPassword extends Component {
  state = { email: '', loading: false, messageSent: false }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const { email } = this.state

    if (!isEmail(email)) {
      Notification.error('Please enter a valid email address')
      return
    }

    const client = this.props.client

    this.setState({loading: true})

    this.props.forgotPassword({input: { userEmail: email }})
    .then((graphQLResult) => {
      const { errors, data } = graphQLResult

      if (errors) {
        if (errors.length > 0) {
          this.setState({loading: false})
          Notification.error(errors[0].message)
        }
      } else {
        if (data.sendPasswordReset.emailSent) {
          Notification.success('Reset password link send to email')

          this.setState({loading: false, messageSent: true})
        } else {
          this.setState({loading: false})
          Notification.error('Reset password link send error')
        }
      }
    }).catch((error) => {
      this.setState({loading: false})
      Notification.error(error.message)
    })
  }

  render () {
    const { messageSent } = this.state

    if (!messageSent) {
      const { email } = this.state
      return (
          <div className='no-auth-page forgot-password'>
            <Grid centered id='no-auth-container'>
              <Grid.Row columns={1}>
                <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={6} widescreen={4}>
                  <Header className="custom-header">
                    <Logo width='80%' className='align-center custom-image-style' />
                    Forgot Password?
                  </Header>
                  <Form onSubmit={this.handleSubmit.bind(this)} className='input-form'>
                    <Form.Input required placeholder='Email' type='text' name='email' value={email} onChange= {this.handleChange} className="input"/>
                    <Button type='submit' className="submit-button field input" loading={this.state.loading}>
                        Recover Password
                    </Button>
                    <div className="secondary-action">
                    Don't have an account yet? <Link prefetch href='/app/signup'><a>Sign Up</a></Link>
                    </div>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>)
    } else {
      return (
           <div className='no-auth-page forgot-password'>
             <Grid centered id='no-auth-container'>
               <Grid.Row columns={1}>
                 <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={6} widescreen={4}>
                   <Header className="custom-header">
                     <Logo width='50%' className='align-center custom-image-style'/>
                     Forgot Password?
                   </Header>
                   <div className="align-center">
                     <h3>
                        Please check your email and follow the instructions there.
                     </h3>
                     <Link prefetch href='/app/login'><a className='secondary-action'>Login Here</a></Link>
                   </div>
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
  graphql(gql`${forgotPassGql}`, {
    props ({ mutate }) {
      return {
        forgotPassword (forgotVariables) {
          return mutate({ variables: forgotVariables })
        }
      }
    }
  })
)(ForgotPassword)
