import React, {Component} from 'react'
import {Tab} from 'semantic-ui-react'
import PostItem from '../PostItem/index'
import LeftSide from '../PostItem/LeftSide'

export default class PostTabs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      posts: {
        twitter: {},
        facebook: {},
        instagram: {}
      },
      activeIndex: this.getActiveIndex(),
    }
  }

  componentDidMount () {
    this.setPostsState(this.props.contentSchedules)
  }

  componentWillReceiveProps (nextProps) {
    this.setPostsState(nextProps.contentSchedules)
  }

  getActiveIndex = () => {
    let socialProfile = {}
    let activeIndex = 0

    if (this.props.contentSchedules.length > 0) {
      socialProfile = this.props.contentSchedules[0].socialProfile
    } else if (this.props.calendarSlot) {
      socialProfile = this.props.calendarSlot.node.socialProfile
    }

    if (socialProfile.id) {
      switch (socialProfile.socialNetwork) {
        case 'TWITTER':
          activeIndex = 0
          break
        case 'FACEBOOK':
          activeIndex = 1
          break
        case 'INSTAGRAM':
          activeIndex = 2
          break
      }

      // Temporary fix until multi-social profile is supported on back end
      return socialProfile.socialNetwork
    }
    return 'TWITTER'
    //return activeIndex
  }

  setPostsState = (contentSchedules) => {
    let {posts} = this.state

    if (contentSchedules.length) {
      contentSchedules.map(schedule => {
        posts[schedule.type.toLowerCase()] = schedule
      })
    } else {
      posts = {
        twitter: {},
        facebook: {},
        instagram: {}
      }
    }

    this.setState({posts})
  }

  onTabChange = (event, data) => {
    this.setState({
      activeIndex: data.activeIndex,
    })
  }

  renderPostItem = (contentSchedule, socialNetwork) => {
    let socialProfile = {
      id: this.props.socialId,
      socialNetwork: socialNetwork
    }
    if (contentSchedule.id) {
      socialProfile = contentSchedule.socialProfile
    } else if (this.props.calendarSlot) {
      socialProfile = this.props.calendarSlot.node.socialProfile
    }
    return (
      <PostItem
        key={this.props._key + `_${socialProfile.socialNetwork}`}
        _key={this.props._key}
        calendarSlot={this.props.calendarSlot}
        contentSchedule={contentSchedule}
        dateTime={this.props.dateTime}
        onShowCampaign={this.props.onShowCampaign}
        socProfile={socialProfile}
        onCloseModal={this.props.onCloseModal}
        categories={this.props.categories}
      />
    )
  }

  render () {
    const { posts, activeIndex } = this.state

    const panes = [
      { menuItem: { key: 'twitter', icon: 'twitter', content: '' }, render: () => this.renderPostItem(posts.twitter, 'TWITTER') },
      { menuItem: { key: 'facebook', icon: 'facebook', content: '' }, render: () => this.renderPostItem(posts.facebook, 'FACEBOOK') },
      { menuItem: { key: 'instagram', icon: 'instagram', content: '' }, render: () => this.renderPostItem(posts.instagram, 'INSTAGRAM') }
    ]

    const dateTime = new Date(this.props.dateTime)
    return (
      <div key={dateTime} className={this.props.className}>
        {!this.props.hideLeft && <LeftSide
          dateTime={dateTime}
        />}
        <div className='post-item-content'>
        {this.renderPostItem(posts[this.getActiveIndex().toLowerCase()], this.getActiveIndex())}
          {/*<Tab
                      grid={{paneWidth: 12, tabWidth: 5}}
                      renderActiveOnly
                      panes={panes}
                      activeIndex={activeIndex}
                      onTabChange={this.onTabChange}
                    />*/}
        </div>
      </div>
    )
  }
}
