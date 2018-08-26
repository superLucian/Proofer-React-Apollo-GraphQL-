import React, {Component} from 'react'
import TextEditor from '../../TextEditor'
import AssetsDropdown from '../../AssetDropdown'
import ContentComments from '../../Comments'
import {Button, Icon, Image, Popup, Tab} from 'semantic-ui-react'
import onClickOutside from 'react-onclickoutside'
import ImageGrid from '../../ImageGrid'
import {hexToRGB} from "../../../libraries/helpers";
import Notification from '../../Notification'

class SelectedState extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAssets: this.props.showAssets,
      showComments: false,
    }
  }

  onToggleComment = () => this.setState({showComments: !this.state.showComments})

  onClickOutside = (e) => {
    let persist = false

    if (!this.props.text && this.props.assets.length) {
      Notification.warning('You must have some text in your post to save it.')
      persist = false
      return null
    }

    if (this.props.contentSchedule.content) {
      if (this.props.contentSchedule.content.text !== this.props.text) {
        persist = true
      }
    } else {
      if (this.props.text) {
        persist = true
      }
    }

    if (this.props.newAssets.length) {
      persist = true
    }

    if (persist) {
      this.props.onPersist()
    }
    this.props.onClickOutside(e)
  }

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

    return <ImageGrid assets={assets} onDelete={this.props.onDeleteMedia}/>
  }

  render () {
    const { contentSchedule, calendarSlot, dateTime, onShowCampaign, text, assets, moderationStatus, addAsset } = this.props

    let socialId = this.props.socProfile.id
    let moderationButtonClass = {
      close: '',
      ellipsis: '',
      check: ''
    }
    if (contentSchedule.id) {
      socialId = contentSchedule.socialProfile.id

      if (moderationStatus === 'ACCEPTED') {
        moderationButtonClass.check = 'selected'
      } else if (moderationStatus === 'WAITING') {
        moderationButtonClass.ellipsis = 'selected'
      } else if (moderationStatus === 'CHANGES_REQUIRED') {
        moderationButtonClass.close = 'selected'
      }
    } else if (calendarSlot) {
      socialId = calendarSlot.node.socialProfile.id
    }

    let categoryIds = []
    if (contentSchedule.content && contentSchedule.content.categories) {
      categoryIds = contentSchedule.content.categories.map(cat => cat.id)
    } else if (calendarSlot) {
      categoryIds = [calendarSlot.node.category.id]
    }

    let categoryColor = ''
    if (calendarSlot !== undefined) {
      if (calendarSlot.node.category) {
        categoryColor = calendarSlot.node.category.color
      }
    }

    return (
      <Tab.Pane className={'post-item-pane selected ignore-react-onclickoutside'} key={this.props._key}>
        <div className='post-item-content-wrapper active'>
          <div onClick={() => {this.state.showAssets && this.setState({showAssets: false})}}>
            <TextEditor
              key={this.props._key}
              id='content-textarea'
              className='custom-form-control resize-none'
              defaultValue={text}
              onChange={(text) => this.props.onChange(text)}
              attachMediaIcon={assets.length === 0}
              onShowAttachAssets={() => this.setState({showAssets: !this.state.showAssets})}
              editEnabled={this.props.editEnabled}
              socialNetwork={this.props.socProfile.socialNetwork}
            />
            <div className={assets.length > 0 ? 'post-item-media active' : 'post-item-media'}>
              {assets.length > 0 ?
                <div className='image-grid content-media'>
                  {this.renderAllMedia(assets)}
                </div>
                :
                (this.state.showAssets ?
                  <div className='image-grid'>
                    <span className='image-action edit' onClick={() => this.setState({showAssets: !this.state.showAssets})}><Icon name='circle' /></span>
                  </div>
                  :
                  <div className='image-grid'>
                    <span className='image-action edit' onClick={() => this.setState({showAssets: !this.state.showAssets})}><Icon name='plus circle' /></span>
                  </div>
                )
              }
            </div>
          </div>
          {this.state.showAssets &&
          <div className='add-assets-wrapper'>
            <AssetsDropdown
              socialId={socialId}
              assets={this.state.assets}
              searchTerm={this.state.searchTerm}
              onSelectAsset={addAsset}
              categoryIds={categoryIds}
              categories={this.props.categories}
              onUpload={this.props.onDropAsset}
            />
          </div>
          }
        </div>
        <div className='post-item-actions'>
          <div className='left-actions'>
            {calendarSlot !== undefined && calendarSlot.node.category &&
            <Button className='category-button' style={{backgroundColor: hexToRGB(categoryColor, 0.25), color: categoryColor}} onClick={() => onShowCampaign(calendarSlot.node.category.id)}>
              {calendarSlot.node.category.name}
            </Button>
            }
            { contentSchedule.id &&
            <span className='remove-action' onClick={() => this.props.onDeletePost()}>
              <Icon name='trash' />
            </span>
            }
            { contentSchedule.content &&
            <Popup
              trigger={
                <span className='comment-action'>
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
            {!this.state.showAssets &&
            <Popup content='Edit media' size='tiny' trigger={
              <span className='add-image-action' onClick={() => this.setState({showAssets: true})}>
                <Icon.Group>
                  <Icon name={'image'} inverted/>
                  <Icon corner name={'add'} inverted/>
                </Icon.Group>
              </span>
            }/>
            }
          </div>
          <div className='actions'>
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
                  <span onClick={() => this.props.onPersist({moderationStatus: 'WAITING'})}>
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
                  <span onClick={() => this.props.onPersist({moderationStatus: 'ACCEPTED'})}>
                    <Icon name='check' className={moderationButtonClass.check} />
                  </span>
                }
                content='Approved'
                size='tiny'
                position='top center'
                inverted
              />
            </div>
          </div>
        </div>
      </Tab.Pane>
    )
  }
}

const clickOutsideConfig = {
  handleClickOutside: (instance) => {
    return instance.onClickOutside
  }
}

const SelectedStateWithClickHandler = onClickOutside(SelectedState, clickOutsideConfig)

export default class Container extends Component {
  render () {
    return <SelectedStateWithClickHandler outsideClickIgnoreClass='ignore-react-onclickoutside' {...this.props}/>
  }
}
