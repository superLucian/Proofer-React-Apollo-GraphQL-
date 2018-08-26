import React, {Component} from 'react'
import { Helmet } from 'react-helmet'
import { withApollo } from 'react-apollo'
import Notifications from 'react-notify-toast'
import PropTypes from 'prop-types'
import { Responsive } from 'semantic-ui-react'

import App from '../components/App'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import MobileHeader from '../components/MobileHeader'
import MobileSidebar from '../components/MobileSidebar'

import persist from '../libraries/persist'

class Auth extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sidebarOpen: false,
      token: this.props.token,
      refreshToken: this.props.refreshToken,
      teamId: this.props.teamId,
      socialId: this.props.socialId,
      socialIds: this.props.socialIds,
      isOpenMobileSidebar: false,
      isOpenMobileUserList: false
    }
  }

  componentDidMount(){
    if(typeof window !== undefined){
      this.setState({sidebarOpen: (window.screen.width > 1024)? true: false})
    }
  }

  useSocialProf = (socialId) => {
    persist.willSetCurrentSocialProfile(socialId)
    this.setState({
      socialId: socialId
    })
    //setTimeout(() => {
      //this.props.client.resetStore()
    //}, 500)
  }

  useTeamId = (teamId) => {
    persist.willSetTeamId(teamId)
    persist.willSetCurrentSocialProfile('')
    this.setState({
      teamId: teamId,
      socialId: '',
    })
    // Force page refresh
    if (typeof window !== 'undefined') window.location.reload()
  }

  mobileMenuClick = () => {
    this.setState({
      isOpenMobileSidebar: true
    })
  };

  mobileUserPhotoClick = () => {
    this.setState({
      isOpenMobileUserList: true
    })
  }

  render () {
    const { title, url, children } = this.props
    const {sidebarOpen, token, refreshToken, socialId, socialIds, teamId, topbarData, isOpenMobileSidebar, isOpenMobileUserList } = this.state
    const childrenWithProps = React.Children.map(children,
     (child) => React.cloneElement(child, {
       token: token,
       socialId: socialId,
       socialIds: socialIds,
       teamId: teamId,
       updateTopbar: this.updateTopbar
     })
    )

    return (<App>
    <div className={!sidebarOpen ? "sidebar-compact" : ''}>
      <Helmet>
        <title>
          {title !== '' ? `${title} :: Proofer` : 'Proofer'}
        </title>
      </Helmet>
      <Notifications options={{zIndex: 1001}} />
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <MobileHeader
          socialId={socialId}
          mobileMenuClick={this.mobileMenuClick}
          mobileUserPhotoClick={this.mobileUserPhotoClick}
        />
        { isOpenMobileSidebar === true ?
          <MobileSidebar
            activeItem={url.pathname}
            toggleSidebar={() => this.setState({ isOpenMobileSidebar: false })}
            isOpen={this.state.sidebarOpen}
            socialId={socialId}
          /> :
          null
        }
      </Responsive>
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Header
          token={token}
          refreshToken={refreshToken}
          teamId={teamId}
          socialId={socialId}
          socialIds={socialIds}
          toggleSidebar={() => this.setState({ sidebarOpen: !this.state.sidebarOpen })}
          useSocialProf={this.useSocialProf}
          useTeamId={this.useTeamId}
          pathname={url.pathname}
          client={this.props.client}
        />
        <Sidebar
          activeItem={url.pathname}
          toggleSidebar={() => this.setState({ sidebarOpen: !this.state.sidebarOpen })}
          isOpen={this.state.sidebarOpen}
          socialId={socialId}
        />
      </Responsive>
      {childrenWithProps}
    </div>
    </App>)
  }
}

Auth.propTypes = {
  title: PropTypes.string,
  url: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

Auth.defaultProps = {
  title: ''
}

export default withApollo(Auth)
