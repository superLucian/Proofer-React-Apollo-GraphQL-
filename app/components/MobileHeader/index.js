import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import MobileLogo from '../../static/images/proofer-logo.svg'
import './styles.scss'

const MobileHeader = ({mobileUserPhotoClick, mobileMenuClick }) =>  {
  return (<Menu borderless fixed="top" className="top-bar-mobile">
    <Menu.Item position = 'left' onClick={mobileUserPhotoClick}>
      <img src = {require('../../static/images/user-photo.png')} />
    </Menu.Item>

      <MobileLogo className = 'mobile-logo' />

    <Menu.Item position = 'right' onClick={mobileMenuClick}>
      <Icon name = 'bars' size = 'large' className="menu-icon"/>
    </Menu.Item >
  </Menu>)
}

export default MobileHeader
