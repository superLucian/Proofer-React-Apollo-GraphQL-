import React, {Component} from 'react'

import DashboardView from './DashboardView'

class Dashboard extends Component {
  render () {
    const {socialId, socialIds} = this.props
    if (!socialId) {
      return (
        <div className='page-wrapper'>
          Please select a social profile on the left, or click the + to connect a new one.
        </div>
      )
    }
    return (
      <div className='page-wrapper posts-page'>
        <DashboardView socialId={socialId}/>
      </div>
    )
  }
}

export default Dashboard