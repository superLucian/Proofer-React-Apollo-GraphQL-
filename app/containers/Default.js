import React, {Component} from 'react'
import { Helmet } from 'react-helmet'
import Notifications from 'react-notify-toast'
import PropTypes from 'prop-types'
import App from '../components/App'
import Header from '../components/Header'

class Default extends Component {
  render () {
    const {title, url, children} = this.props

    return (<App>
      <Helmet>
        <title>
          {title !== '' ? `${title} :: Proofer` : 'Proofer'}
        </title>
      </Helmet>
      <Notifications />
      {children}
    </App>)
  }
}

Default.propTypes = {
  title: PropTypes.string,
  url: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

Default.defaultProps = {
  title: ''
}

export default Default
