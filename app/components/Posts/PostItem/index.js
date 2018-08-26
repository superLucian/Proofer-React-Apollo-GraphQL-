import React, {Component} from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import NormalState from './NormalState'
import SelectedState from './SelectedState'
import {
  createContentMutation, createContentScheduleMutation, deleteContentScheduleMutation, editContentAddMediaMutation, editContentRemoveMediaMutation, updateContentMutation, updateContentScheduleMutation
} from '../graphql/contentMutations'
import Notification from '../../Notification'
import contentSchedulesGql from '../graphql/contentSchedules.gql'
import editPost from './editPostMethod'
import createPost from './createPostMethod'
import uploadMedia from '../../AssetBank/uploadMediaMethod'
import { Droppable } from 'react-drag-and-drop'
import { createMediaTag } from '../../AssetBank/graphql/assetsMutations'
import Dropzone from 'react-dropzone'

import './styles.scss'

class PostItem extends Component {
  constructor (props) {
    super(props)
    const { contentSchedule, calendarSlot, socProfile } = props

    let text = ''
    let assets = []
    let newContentId = null
    let moderationStatus = null

    if (contentSchedule) {
      moderationStatus = contentSchedule.moderationStatus
      if (contentSchedule.content) {
        text = contentSchedule.content.text
        if (contentSchedule.content.media.length) {
          contentSchedule.content.media.map((media) => {
            assets.push(media)
          })
        }
      }
    }

    let socialProfile = socProfile
    if (contentSchedule.id) {
      socialProfile = contentSchedule.socialProfile
    } else if (calendarSlot) {
      socialProfile = calendarSlot.node.socialProfile
    }

    this.state = {
      text,
      assets,
      newAssets: [],
      newContentId,
      moderationStatus,
      editEnabled: false,
      socialProfile,
      showAssets: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { contentSchedule } = nextProps
    if (contentSchedule) {
      if (contentSchedule.id !== this.props.contentSchedule.id) {
        let text = ''
        let assets = []
        let moderationStatus = contentSchedule.moderationStatus

        if (contentSchedule.content) {
          text = contentSchedule.content.text
          if (contentSchedule.content.media.length) {
            contentSchedule.content.media.map((media) => {
              assets.push(media)
            })
          }
        }

        this.setState({text, assets, moderationStatus})
      }
    }
  }

  onFocus = (showAssets = false) => {
    this.setState({
      editEnabled: true,
      showAssets
    })
  }

  onChange = (text) => {
    this.setState({
      text
    })
  }

  onClickOutside = (e) => {
    this.state.editEnabled &&
    this.setState({
      editEnabled: false,
      showAssets: false
    })
  }

  validateAssets = () => {
    const {assets, socialProfile} = this.state
    const imageMimes = ['image/jpeg', 'image/png']
    const gifMimes = ['image/gif']
    const videoMimes = ['video/quicktime', 'video/mp4']

    if (this.state.socialProfile.socialNetwork === 'TWITTER') {
      if (assets.length > 4) {
        Notification.error('You can not save more then 4 images for twitter.')
        return false
      } else {
        let video = 0
        let gif = 0
        let image = 0

        assets.map(asset => {
          if (imageMimes.indexOf(asset.mime) > -1) {
            image += 1
          } else if (gifMimes.indexOf(asset.mime) > -1) {
            gif += 1
          } else if (videoMimes.indexOf(asset.mime) > -1) {
            video += 1
          }
        })

        if ((assets.length > 1 && assets.length !== image)
          || (assets.length > 1 && (gif > 1 || video > 1))) {
          Notification.error('You can have a maximum of 4 images OR 1 gif OR 1 video for twitter.')
          return false
        }
      }
    } else if (this.state.socialProfile.socialNetwork === 'FACEBOOK') {
      if (socialProfile.facebookPageName === null && assets.length > 4) {
        Notification.error('you can not add more than 4 images or videos')
        return false
      } else if (socialProfile.facebookPageName !== null && assets.length > 1) {
        Notification.error('you can not add more than 1 image, gif or video on facebook page')
        return false
      }
    } else if (assets.length > 4) {
      Notification.error('you can not add more than 4 images or videos')
      return false
    }
    return true
  }

  addAsset = (asset) => {
    let { assets, newAssets } = this.state
    assets.push(asset)
    newAssets.push(asset)
    this.setState({
      assets,
      newAssets
    })
  }

  onDeleteMedia = (mediaId) => {
    let savedAssets = []
    if (this.props.contentSchedule.content) {
      savedAssets = this.props.contentSchedule.content.media
    }
    let runMutation = false
    let { assets, newAssets } = this.state
    const _assets = Object.assign({}, assets)
    const _newAssets = Object.assign({}, newAssets)

    savedAssets.map(asset => {
      if (asset.id === mediaId) {
        runMutation = true
      }
    })

    // Remove media from Posts state
    assets.map((asset, index) => {
      if (asset.id === mediaId) {
        assets.splice(index, 1)
      }
    })
    newAssets.map((asset, index) => {
      if (asset.id === mediaId) {
        newAssets.splice(index, 1)
      }
    })

    this.setState({assets, newAssets})

    if (runMutation) { // Asset was saved, we need to remove from server
      const { editContentRemoveMedia } = this.props
      const contentId = this.state.newContentId || this.props.contentSchedule.content.id
      editContentRemoveMedia({contentId, mediaIds: [mediaId]})
      .then((data) => {
        Notification.success('Deleted successfully.')
      }).catch((e) => {
        console.log(e)
        Notification.error('Deletion error.')
        this.setState({assets: _assets, newAssets: _newAssets})
      })
    }
  }

  onDeletePost = () => {
    const {contentSchedule, deleteContentSchedule} = this.props
    if (contentSchedule.id) {
      let _state = Object.assign({}, this.state)
      this.setState({
        text: '',
        moderationStatus: null,
        assets: [],
        newAssets: [],
        newContentId: null,
        editEnabled: false
      })

      deleteContentSchedule({id: contentSchedule.id})
      .then(data => {
        Notification.success('Deleted successfully.')
      }).catch(e => {
        console.log(e)
        Notification.error('Deletion error.')
        this.setState(_state)
      })
    }
  }

  onPersist = (props = {}) => {
    const that = this
    if (props.moderationStatus) {
      this.setState({moderationStatus: props.moderationStatus, editEnabled: false})
    }
    if (!this.validateAssets()) {
      return
    }

    if (this.props.contentSchedule.id) {
      editPost({postItem: that, onCloseModal: this.props.onCloseModal, ...props})
    } else {
      createPost({postItem: that, onCloseModal: this.props.onCloseModal, ...props})
    }
  }

  onDrop = (data, dateTime) => {
    const content = JSON.parse(data.post)
    this.setState({
      newContentId: content.id,
      text: content.text,
      assets: content.media
    }, () => {this.onPersist(); this.props.onShowCampaign(false)})
  }

  onDropAsset = (files) => {
    const { calendarSlot } = this.props
    let { assets } = this.state

    if (files.length) {
      files.map(file => {
        assets.push({
          url: file.preview,
          mime: file.type
        })
      })
    }
    this.setState({
      assets
    })
    uploadMedia(files).then((mediaIds) => {
      mediaIds.map((mediaId, index) => {
        let categoryId = null
        if (calendarSlot !== undefined && calendarSlot.node.category) categoryId = calendarSlot.node.category.id
        if (categoryId) {
          this.props.createTag({mediaId, categoryIds: [categoryId]})
            .then((data) => {
              Notification.success('Media uploaded')
              let newAssets = this.state.newAssets
              newAssets.push(data.data.editMediumAddCategories.media)
              this.setState({newAssets}, () => {if (index === files.length - 1 && this.state.text) this.onPersist()})
            })
        } else {
          Notification.success('Media uploaded')
          let newAssets = this.state.newAssets
          newAssets.push({
            id: mediaId
          })
          this.setState({newAssets}, () => {if (index === files.length - 1 && this.state.text) this.onPersist()})
        }
      })
    })
  }

  render () {
    const { contentSchedule, calendarSlot, dateTime, onShowCampaign } = this.props
    if (this.state.editEnabled) {
      return (
        <Dropzone className='post-item-dropzone' onDrop={(files) => this.onDropAsset(files)} disableClick>
          <SelectedState
            _key={this.props._key}
            key={this.props._key}
            socProfile={this.props.socProfile}
            contentSchedule={contentSchedule}
            text={this.state.text}
            assets={this.state.assets}
            moderationStatus={this.state.moderationStatus}
            calendarSlot={calendarSlot}
            categories={this.props.categories}
            onChange={this.onChange}
            addAsset={this.addAsset}
            onDeleteMedia={this.onDeleteMedia}
            onDeletePost={this.onDeletePost}
            onPersist={this.onPersist}
            onClickOutside={this.onClickOutside}
            onDropAsset={this.onDropAsset}
            onShowCampaign={onShowCampaign}
            editEnabled={this.state.editEnabled}
            showAssets={this.state.showAssets}
            newAssets={this.state.newAssets}
          />
        </Dropzone>
      )
    }

    return (<Droppable
      types={['post']} // <= allowed drop types
      onDrop={(post) => this.onDrop(post, dateTime)}
    >
      <NormalState
        _key={this.props._key}
        key={this.props._key}
        contentSchedule={contentSchedule}
        text={this.state.text}
        assets={this.state.assets}
        moderationStatus={this.state.moderationStatus}
        calendarSlot={calendarSlot}
        dateTime={dateTime}
        onShowCampaign={onShowCampaign}
        onFocus={this.onFocus}
        onPersist={this.onPersist}
        onDeletePost={this.onDeletePost}
      />
    </Droppable>
    )
  }
}

export default compose(
  graphql(createContentMutation, {
    props ({ ownProps, mutate }) {
      return {
        createContent (vars) {
          return mutate({
            variables: {
              input: vars
            }
          })
        }
      }
    }
  }),
  graphql(updateContentMutation, {
    props ({ ownProps, mutate }) {
      return {
        updateContent ({ contentText, contentId }) {
          return mutate({
            variables: {
              input: {
                contentText,
                contentId
              }
            }
          })
        }
      }
    }
  }),
  graphql(editContentAddMediaMutation, {
    props ({ ownProps, mutate }) {
      return {
        editContentAddMedia ({contentId, mediaIds}) {
          return mutate({
            variables: {
              input: {
                contentId,
                mediaIds
              }
            },
            update: (proxy, { data: { editContentAddMedia } }) => {
              let profileId = ownProps.contentSchedule.socialProfile.id || ownProps.calendarSlot.node.id
              let data = proxy.readQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [profileId]} })
              for (const [index, contentSchedule] of data.contentSchedules_find.edges.entries()) {
                if (contentSchedule.node.content.id === editContentAddMedia.content.id) {
                  data.contentSchedules_find.edges[index].node.content = editContentAddMedia.content
                  proxy.writeQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [profileId]}, data })
                  break
                }
              }
            }
          })
        }
      }
    }
  }),
  graphql(editContentRemoveMediaMutation, {
    props ({ ownProps, mutate }) {
      return {
        editContentRemoveMedia ({contentId, mediaIds}) {
          return mutate({
            variables: {
              input: {
                contentId,
                mediaIds
              }
            },
            update: (proxy, { data: { editContentRemoveMedia } }) => {
              let profileId = ownProps.contentSchedule.socialProfile.id || ownProps.calendarSlot.node.id
              let data = proxy.readQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [profileId]} })
              for (const [index, contentSchedule] of data.contentSchedules_find.edges.entries()) {
                if (contentSchedule.node.content.id === editContentRemoveMedia.content.id) {
                  data.contentSchedules_find.edges[index].node.content = editContentRemoveMedia.content
                  proxy.writeQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [profileId]}, data })
                  break
                }
              }
            }
          })
        }
      }
    }
  }),
  graphql(createContentScheduleMutation, {
    props ({ ownProps, mutate }) {
      return {
        createContentSchedule ({contentId, socialProfileId, contentSchedulePublishAt, calendarSlotId, moderationStatus}) {
          return mutate({
            variables: {
              input: {
                contentId,
                socialProfileId,
                contentSchedulePublishAt,
                calendarSlotId,
                moderationStatus
              }
            },
            update: (proxy, { data: { createContentSchedule } }) => {
              let data = proxy.readQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [socialProfileId]} })
              data.contentSchedules_find.edges.push({node: createContentSchedule.contentSchedule, __typename: 'ContentScheduleEdge'})
              proxy.writeQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [socialProfileId]}, data })
            }
          })
        }
      }
    }
  }),
  graphql(updateContentScheduleMutation, {
    props ({ ownProps, mutate }) {
      return {
        updateContentSchedule ({contentId, socialProfileId, contentSchedulePublishAt, contentScheduleId, calendarSlotId, moderationStatus}) {
          return mutate({
            variables: {
              input: {
                contentId,
                socialProfileId,
                contentSchedulePublishAt,
                contentScheduleId,
                calendarSlotId,
                moderationStatus
              }
            },
            update: (proxy, { data: { editContentSchedule } }) => {
              let data = proxy.readQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [socialProfileId]} })
              for (const [index, contentSchedule] of data.contentSchedules_find.edges.entries()) {
                if (contentSchedule.node.id === editContentSchedule.contentSchedule.id) {
                  data.contentSchedules_find.edges[index].node = editContentSchedule.contentSchedule
                  proxy.writeQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [socialProfileId]}, data })
                  break
                }
              }
            }
          })
        }
      }
    }
  }),
  graphql(deleteContentScheduleMutation, {
    props ({ ownProps, mutate }) {
      return {
        deleteContentSchedule ({id}) {
          return mutate({
            variables: {
              input: { id }
            },
            update: (proxy, { data: { deleteContentScheduleMutation } }) => {
              let socialProfileId = ownProps.contentSchedule.socialProfile.id || ownProps.calendarSlot.node.id
              let data = proxy.readQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [socialProfileId]} })
              for (const [index, contentSchedule] of data.contentSchedules_find.edges.entries()) {
                if (contentSchedule.node.id === id) {
                  data.contentSchedules_find.edges.splice(index, 1)
                  proxy.writeQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [socialProfileId]}, data })
                  break
                }
              }
            }
          })
        }
      }
    }
  }),
  graphql(createMediaTag, {
    props({ownProps, mutate}) {
      return {
        createTag({mediaId, categoryIds}) {
          return mutate({
            variables: {
              input: {
                mediaId,
                categoryIds
              }
            }
          })
        }
      }
    }
  })
)(PostItem)
