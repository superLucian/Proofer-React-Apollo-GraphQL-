import React, { Component } from 'react'
import Link from 'next/link'
import {Menu, Icon, Popup} from 'semantic-ui-react'
import Logo from '../../static/images/proofer-logo-colored.svg'
import initApollo from '../../libraries/apolloClient'
import gql from 'graphql-tag'

import './styles.scss'

class SideBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      openSidebarButtonVisible: false
    }
  }

  renderSocialProfiles = () => {
    const {socialProfiles} = this.props
    const socialProfilesArray = socialProfiles === undefined ? [] : socialProfiles
    return (socialProfilesArray.map((data, index) => (
      <Menu.Item key={index} onClick={this.handleItemClick}>
        {data.name}
      </Menu.Item>)
    ))
  }

  getSocialProfile = () => {
    const client = initApollo({}, {})
    return client.readFragment({
      id: 'SocialProfile:' + this.props.socialId,
      fragment: gql`
        fragment socialProfile on SocialProfile {
          id
          name
          socialNetwork
        }
      `
    })
  }

  render () {
    const { isOpen, activeItem, toggleSidebar } = this.props
    const socialProfile = this.getSocialProfile()
    let sidebarClass = isOpen ? 'sidebar-container open' : 'sidebar-container'
    if (process.env.BROWSER) {
      sidebarClass = isOpen && (window.innerWidth > 100) ? 'sidebar-container open' : 'sidebar-container'
    }

    return (
      <div className={sidebarClass} 
          onMouseEnter={() => {this.setState({openSidebarButtonVisible: true})}} 
          onMouseLeave={() => {this.setState({openSidebarButtonVisible: false})}}>
        <div className='sidebar-wrapper'>
          <div className='sidebar-header'>
            {isOpen ? <Logo width='110px' className='sidebar-logo' />
            : <Logo width='20px' className='sidebar-logo' viewBox='0 0 50 63' />}
            <Icon name='close' onClick={toggleSidebar} />
          </div>
          <Menu vertical className='sidebar-menu'>
            {/*<Link prefetch href='/app/onboarding'>
              <Menu.Item as='div' name='onboarding' active={activeItem === '/app/onboarding'}>
                <Icon name='play' />
                <a><span className='item-text'>Getting Started</span></a>
              </Menu.Item>
            </Link>*/}
            <Link prefetch href='/app/dashboard'>
              <Menu.Item as='div' name='dashboard' active={activeItem === '/app/dashboard'}>
                <Icon name='dashboard' />
                <a><span className='item-text'>Dashboard</span></a>
              </Menu.Item>
            </Link>

            <Link prefetch href='/app/posts'>
              <Menu.Item as='div' name='posts' active={activeItem === '/app/posts'}>
                <Icon name='list' />
                <a><span className='item-text'>Posts</span></a>
              </Menu.Item>
            </Link>

            <Link prefetch href='/app/calendar'>
              <Menu.Item as='div' name='calendar' active={activeItem === '/app/calendar'}>
                <Icon name='calendar outline' />
                <a><span className='item-text'>Calendar</span></a>
              </Menu.Item>
            </Link>

            <Link prefetch href='/app/assetbank'>
              <Menu.Item as='div' name='assetbank' active={activeItem === '/app/assetbank'}>
                <Icon name='file image outline' />
                <a><span className='item-text'>Asset Bank</span></a>
              </Menu.Item>
            </Link>

            <Link prefetch href='/app/campaign'>
              <Menu.Item as='div' name='campaign' active={activeItem === '/app/campaign'}>
                <Icon name='options' />
                <a><span className='item-text'>Campaign</span></a>
              </Menu.Item>
            </Link>

            {socialProfile && socialProfile.socialNetwork === 'TWITTER' &&
            <Link prefetch href='/app/unfollow'>
              <Menu.Item as='div' name='unfollow' active={activeItem === '/app/unfollow'}>
                <Icon name="twitter"/>
                <a><span className='item-text'>Unfollow</span></a>
              </Menu.Item>
            </Link>
            }
          </Menu>

          {!isOpen && this.state.openSidebarButtonVisible &&
            <div className='open-sidebar'  onClick={toggleSidebar} >
              <Icon name='chevron right' />
            </div>
          }
        </div>
      </div>
    )
  }
}

export default SideBar
