import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import initApollo from '../../libraries/apolloClient'
import gql from 'graphql-tag'

import TextEditor from '../TextEditor/index'
import Notification from '../Notification'
import AssetsDropdown from '../AssetDropdown'
import ImageGrid from '../ImageGrid/index'
import { Button, Icon, Popup } from 'semantic-ui-react'

import uploadMedia from '../AssetBank/uploadMediaMethod'
import { createMediaTag } from '../AssetBank/graphql/assetsMutations'
import { campaignByCategory } from '../Campaign/graphql/queries'
import { createContentMutation, editContentAddMediaMutation, editContentMutation, editContentRemoveMediaMutation } from '../Posts/graphql/contentMutations'

import './styles.scss'

class EditContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAssets: false,
      text: this.props.content ? this.props.content.text : '',
      assets: this.props.content ? this.props.content.media : [],
      newAssets: [],
      saveLoading: false
    }
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

  addAsset = (asset) => {
    let { assets, newAssets } = this.state
    assets.push(asset)
    newAssets.push(asset)
    this.setState({
      assets,
      newAssets
    })
  }

  validateAssets = (socialProfile) => {
    const { assets } = this.state
    const imageMimes = ['image/jpeg', 'image/png']
    const gifMimes = ['image/gif']
    const videoMimes = ['video/quicktime', 'video/mp4']

    if (socialProfile.socialNetwork === 'TWITTER') {
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
    } else if (socialProfile.socialNetwork === 'FACEBOOK') {
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

  onPersist = (socialProfile) => {
    this.setState({saveLoading: true})
    if (!this.validateAssets(socialProfile)) {
      this.setState({saveLoading: false})
      return
    }

    if (this.props.content) {
      this.props.editContent({
        contentId: this.props.content.id,
        contentText: this.state.text
      }).then((data) => {
        if (this.state.newAssets.length) {
          this.props.editContentAddMedia({contentId: this.props.content.id, mediaIds: this.state.newAssets.map(m => m.id)})
            .then((data) => {
              Notification.success('Content edited')
              this.props.onClose()
            }).catch((error) => {
            Notification.error('Edit content error')
          })
        } else {
          Notification.success('Content edited')
          this.props.onClose()
        }
      }).catch((error) => {
        Notification.error('Edit content error')
      })
    } else {
      this.props.createContent({
        contentText: this.state.text,
        mediaIds: this.state.newAssets.map(m => m.id),
        categoryIds: this.props.categoryId,
        socialProfilesIds: [socialProfile.id],
        inBank: true
      }).then((data) => {
        Notification.success('Content created successfully')
        this.props.onClose()
      }).catch((error) => {
        console.log(error)
        Notification.error(error.message)
      })
    }
    this.setState({saveLoading: false})
  }

  onDropAsset = (files) => {
    const { categoryId } = this.props
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
        if (categoryId) {
          this.props.createTag({mediaId, categoryIds: [categoryId]})
            .then((data) => {
              Notification.success('Media uploaded')
              let newAssets = this.state.newAssets
              newAssets.push(data.data.editMediumAddCategories.media)
              this.setState({newAssets}, () => {
              })
            })
        }
      })
    })
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

    return <ImageGrid assets={assets} onDelete={this.onDeleteMedia}/>
  }

  onDeleteMedia = (mediaId) => {
    let savedAssets = []
    if (this.props.content) {
      savedAssets = this.props.content.media
    }
    let runMutation = false
    let { assets, newAssets } = this.state
    const _assets = [...assets]
    const _newAssets = [...newAssets]

    savedAssets.map(asset => {
      if (asset.id === mediaId) {
        runMutation = true
      }
    })

    // Remove media from Posts state
    assets.map((asset, index) => {
      if (asset.id === mediaId) {
        _assets.splice(index, 1)
      }
    })
    newAssets.map((asset, index) => {
      if (asset.id === mediaId) {
        _newAssets.splice(index, 1)
      }
    })

    this.setState({assets: _assets, newAssets: _newAssets})

    if (runMutation) { // Asset was saved, we need to remove from server
      const { editContentRemoveMedia } = this.props
      const contentId =  this.props.content.id
      editContentRemoveMedia({contentId, mediaIds: [mediaId]})
        .then((data) => {
          Notification.success('Deleted successfully.')
        }).catch((e) => {
        Notification.error('Deletion error.')
        this.setState({assets, newAssets})
      })
    }
  }

  render () {
    const socialProfile = this.getSocialProfile()

    return (
      <div className='edit-content'>
        <div className='edit-content-border'>
          <div onClick={() => this.setState({showAssets: false})}>
            <TextEditor
              id="content-textarea"
              className='custom-form-control resize-none'
              socialNetwork={socialProfile.socialNetwork}
              defaultValue={this.state.text}
              onChange={(text) => {this.setState({text})}}
            />
            {this.state.assets.length > 0 &&
            <div className='image-grid content-media'>
              {this.renderAllMedia(this.state.assets)}
            </div>
            }
          </div>
          {this.state.showAssets &&
          <div className='add-assets-wrapper'>
            <AssetsDropdown
              socialId={this.props.socialId}
              assets={this.state.assets}
              categories={this.props.categories}
              categoryIds={this.props.categories.map(c => c.id)}
              onSelectAsset={this.addAsset}
              onUpload={this.onDropAsset}
            />
          </div>
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
        <div className='edit-content-actions'>
          <Button className='success' onClick={() => {this.onPersist(socialProfile)}} loading={this.state.saveLoading}>
            Save Post
          </Button>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(createContentMutation, {
    props({ownProps, mutate}) {
      return {
        createContent(vars) {
          return mutate({
            variables: {
              input: vars
            },
            update: (proxy, {data: {createContent}}) => {
              let data = proxy.readQuery({query: campaignByCategory, variables: {id: ownProps.categoryId}})
              data.category.contents.edges.push({node: createContent.content, __typename: 'ContentsEdge'})
              proxy.writeQuery({query: campaignByCategory, variables: {id: ownProps.categoryId}, data})
            }
          })
        }
      }
    }
  }),
  graphql(editContentMutation, {
    props({ownProps, mutate}) {
      return {
        editContent(vars) {
          return mutate({
            variables: {
              input: vars
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
  }),
  graphql(editContentAddMediaMutation, {
    props({ownProps, mutate}) {
      return {
        editContentAddMedia({contentId, mediaIds}) {
          return mutate({
            variables: {
              input: {
                contentId,
                mediaIds
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
            }
          })
        }
      }
    }
  }),
)(EditContent)