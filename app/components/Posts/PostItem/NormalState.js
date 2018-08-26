  import React, {Component} from 'react'
import {Button, Icon, Image, Popup, Tab} from 'semantic-ui-react';
import ContentComments from '../../Comments'
import ImageGrid from "../../ImageGrid/index";
  import {hexToRGB} from "../../../libraries/helpers";

export default class NormalState extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showComments: false
    }
  }

  onToggleComment = () => this.setState({showComments: !this.state.showComments})

  renderAllMedia (assets) {
    const imageMimes = ['image/jpeg', 'image/png', 'image/gif']
    const videoMimes = ['video/quicktime', 'video/mp4']
    let videoIndex = false

    for (let media of assets) {
      if (videoMimes.indexOf(media.mime) > -1) {
        videoIndex = videoMimes.indexOf(media.mime) - 1
      } else if (imageMimes.indexOf(media.mime) === -1) {
        // unrecognized media type
        return <div/>
      }
    }

    if (videoIndex !== false) {
      return (
        <video width='500' height='340' controls>
          <source src={assets[videoIndex].url} type={assets[videoIndex].mime}/>
          Your browser does not support the video tag.
        </video>
      )
    }

    return <ImageGrid assets={assets}/>
  }

  onFocus = (oldPost) => {
    if (!oldPost) {
      this.props.onFocus()
    }
  }

  getPublishedMessage = () => {
    const { contentSchedule } = this.props

    if (!contentSchedule.id) {
      return '[Not published - no content]'
    }

    if (contentSchedule.publishingStatus === 'PUBLISHED') {
      return '[Published]'
    }

    if (contentSchedule.moderationStatus !== 'APPROVED') {
      return '[Not published - not approved]'
    }

    return '[Not published]'
  }

  render () {
    const { contentSchedule, text, assets, moderationStatus, calendarSlot, dateTime, onShowCampaign, onFocus } = this.props

    const oldPost = new Date(dateTime) < new Date()
    let categoryColor = ''
    if (calendarSlot !== undefined) {
      if (calendarSlot.node.category) {
        categoryColor = calendarSlot.node.category.color
      }
    }
    let moderationButtonClass = {
      close: '',
      ellipsis: '',
      check: ''
    }
    if (!oldPost) {
      if (moderationStatus === 'ACCEPTED') {
        moderationButtonClass.check = 'selected'
      } else if (moderationStatus === 'WAITING') {
        moderationButtonClass.ellipsis = 'selected'
      } else if (moderationStatus === 'CHANGES_REQUIRED') {
        moderationButtonClass.close = 'selected'
      }
    }

    return (
      <Tab.Pane className='post-item-pane ignore-react-onclickoutside' key={this.props._key}>
        <div onClick={(e) => this.onFocus(oldPost)} style={{cursor: 'pointer'}}>
          <div className='post-item-body'>{text || 'Write some content...'}</div>
          {assets.length > 0 && <div className='post-item-media normal-state active'>
            <div className={'image-grid' + (assets.length === 1 ? ' one' : '') + 'content-media'}>
              {this.renderAllMedia(assets)}
            </div>
          </div>
          }
        </div>
        <div className='post-item-actions'>
          <div className='left-actions'>
            {oldPost && contentSchedule.id && contentSchedule.publishingStatus === 'PUBLISHED' &&
            <div className='post-short-stat'>
              <div className='social-stat'>
                <span><Icon name='heart' />{contentSchedule.status ? contentSchedule.status.favouriteCount: 0 }</span>
                <span><Icon name='retweet' />{contentSchedule.status ? contentSchedule.status.retweetCount : 0}</span>
                {/* <span><Icon name='comment' />{contentSchedule.status && contentSchedule.status.retweetCount}</span> */}
              </div>
            </div>
            }
            {calendarSlot !== undefined && calendarSlot.node.category &&
            <Button className='category-button' style={{backgroundColor: hexToRGB(categoryColor, 0.25), color: categoryColor}} onClick={() => onShowCampaign(calendarSlot.node.category.id)}>
              {calendarSlot.node.category.name}
            </Button>
            }
            {!oldPost && contentSchedule.id &&
            <Popup content='Delete' size='tiny' trigger={
              <span className='remove-action' onClick={() => this.props.onDeletePost()}>
                <Icon name='trash'/>
              </span>
            }/>
            }
            {contentSchedule && contentSchedule.content &&
            <Popup
              trigger={
                <span className='remove-action'>
                  <Icon name='comments' />
                </span>
              }
              key={contentSchedule.content.id}
              on='click'
              open={contentSchedule.content.comments && this.state.showComments}
              onClose={this.onToggleComment}
              onOpen={this.onToggleComment}
              position='bottom right'
              flowing
            >
              <Popup.Header>Comments</Popup.Header>
              <Popup.Content>
                <ContentComments comments={contentSchedule.content.comments.edges} contentId={contentSchedule.content.id} socialId={contentSchedule.socialProfile.id} />
              </Popup.Content>
            </Popup>
            }
            {!oldPost &&
            <Popup content='Edit media' size='tiny' trigger={
              <span className='add-image-action' onClick={() => this.props.onFocus(true)}>
                <Icon.Group>
                  <Icon name={'image'} inverted/>
                  <Icon corner name={'add'} inverted/>
                </Icon.Group>
              </span>
            }/>
            }
          </div>
          <div className='actions'>
            {!oldPost &&
            <div className='approve-actions'>
              <Popup
                trigger={
                  <span onClick={() => this.props.onPersist({moderationStatus: 'CHANGES_REQUIRED'})}>
                    <Icon name='close' className={moderationButtonClass.close} />
                  </span>
                }
                content='Needs Improving'
                size='tiny'
                position='top center'
                inverted
              />
              <Popup
                trigger={
                  <span
                    onClick={() => this.props.onPersist({moderationStatus: 'WAITING'})}>
                    <Icon name='ellipsis horizontal' className={moderationButtonClass.ellipsis} />
                  </span>
                }
                content='Awaiting approval'
                size='tiny'
                position='top center'
                inverted
              />
              <Popup
                trigger={
                  <span
                    onClick={() => this.props.onPersist({moderationStatus: 'ACCEPTED'})}>
                    <Icon name='check' className={moderationButtonClass.check} />
                  </span>
                }
                content='Approved'
                size='tiny'
                position='top center'
                inverted
              />
            </div>
            }
            {oldPost &&
              <small><i>{this.getPublishedMessage()}</i></small>
            }
          </div>
        </div>
      </Tab.Pane>
    )
  }
}
