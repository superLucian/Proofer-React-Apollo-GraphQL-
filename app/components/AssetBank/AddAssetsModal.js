import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { Button, Modal, Segment, Transition, Dropdown, Grid } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import Notification from '../Notification'
import Loader from '../Loader'
import PreviewImages from './PreviewImages'
import { mediaUrl } from '../../libraries/constants'
import persist from '../../libraries/persist'
import { createMediaTag, removeMediaTag } from './graphql/assetsMutations'
import {getCategorybySocialIdQuery, assetsByCategory} from './graphql/AssetQueries'

import './styles/addAssetModal.scss'

const dropzoneStyle = {
  'border': '#ccc dashed',
  'margin': '10px'
}

class AddAssetsModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedCategoryIds: [props.selectedCategory],
      visible: false,
      uploadMedia: [],
      savingAssets: false
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      descriptionText: '',
      selectedCategoryIds: [nextProps.selectedCategory],
      visible: false,
      uploadMedia: [],
      savingAssets: false
    })
  }


  onDrop = (files) => {
    var uploadMedia = this.state.uploadMedia
    uploadMedia = uploadMedia.concat(files)
    this.setState({ uploadMedia })
  }

  removeUploads = (e, index) => {
    const uploadMedia = this.state.uploadMedia
    uploadMedia.splice(index.value,1)
    this.setState({uploadMedia})
  }

  selectCategory = (e, category) => {
    let selectedCategoryIds = this.state.selectedCategoryIds.filter(function(item) {
        return item !== category.value
    })
    if(category.checked)
      selectedCategoryIds.push(category.value)

    this.setState({ selectedCategoryIds })
  }

  onSaveAssets = () => {
    this.setState({savingAssets: true})
    const { uploadMedia, selectedCategoryIds } = this.state

    if( selectedCategoryIds.length > 0 && uploadMedia.length > 0)
    {
        this.uploadMediaContent(uploadMedia).then((mediaIds) => {
          this.onCreateTag( mediaIds, selectedCategoryIds)
        })
    }
  }

  uploadMediaContent = (images) => {
    let mediaIds = []
    let sendCount = 0
    let receiveCount = 0

    return new Promise((resolve, reject) => {
      images.map((file, index) => {
        const authorization = 'Bearer ' + persist.willGetAccessToken()
        const teamGID = persist.willGetTeamId()

        sendCount++

        const mediaFormData = new FormData()
        mediaFormData.append('mediaFile', file)

        const xhr = new XMLHttpRequest()
        xhr.open('post', mediaUrl, true)
        xhr.setRequestHeader('authorization', authorization)
        xhr.setRequestHeader('X-Proof-TeamId', teamGID)

        xhr.onload = function () {
          if (this.status === 200) {
            receiveCount++
            const oneMediaId = JSON.parse(this.response)['media_ids']
            mediaIds.push(oneMediaId[0])
            if (sendCount !== 0 && receiveCount !== 0 && sendCount === receiveCount && receiveCount === images.length) {
              resolve(mediaIds)
            }
          } else {
            reject(this.statusText)
          }
        }
        xhr.send(mediaFormData)

        return true
      })
    })
  }

  onCreateTag = (mediaIds, categoryIds) => {
    const { createTag } = this.props
    let media_count = 0
    let promises = mediaIds.map((mediaId) => createTag({mediaId, categoryIds}))

    Promise.all(promises).then((data) => {
      Notification.success('New Asset is added.')
      this.setState({savingAssets: false})
      this.props.closeModal()
    })
    .catch((e) => {
      Notification.error('Add assets Error')
      this.setState({savingAssets: false})
      this.props.closeModal()
    })

  }



  getSuggestions = (list) => {
    const { socialProfile } = this.props
    const fetchedArray = !socialProfile ? [] : socialProfile.categories
    const availableCategories = fetchedArray.edges.map((e) => ({...e.node}))
    if(!list) {
      return availableCategories.map((category, index) => {
        return { key: category.id, value: category.id, text: category.name }
      })
    }
    return availableCategories
  }

  handleChange = (e, {value}) => {
    value = (value.length > 0) ? value : [this.props.selectedCategory]
    this.setState({ selectedCategoryIds: value })
  }

  render () {
    const {modalOpen, onCloseModal, selectedCategoryId, socialProfile} = this.props
    const fetchedArray = !socialProfile ? [] : socialProfile.categories
    if (fetchedArray.length === 0) {
      return <Loader />
    }

    const { selectedCategoryIds, visible, uploadMedia, savingAssets} = this.state

    const isEnabled = selectedCategoryIds.length > 0 && uploadMedia.length > 0

    const suggestions = this.getSuggestions()

    return (<Modal.Content>
        <Segment.Group>
          <Segment>
            <div className='ui centered grid'>
              <Dropzone
                accept='image/*, video/*'
                ref='dropzone'
                onDrop={this.onDrop}
                className='sixteen wide column center aligned'
                style={dropzoneStyle}
              >
                <h3>Drag and Drop <br /> Asset or search below</h3>
              </Dropzone>
            </div>
          </Segment>
          {uploadMedia.length > 0 && <PreviewImages files={uploadMedia} removeUploads={this.removeUploads} />}
          <Segment secondary compact>
            <Dropdown
              ref='dropdown'
              placeholder='Add to category'
              fluid
              multiple
              search
              selection
              value={this.state.selectedCategoryIds}
              options={suggestions}
              onChange={this.handleChange}
            />
          </Segment>

        </Segment.Group>
        <div className="action-btns">
          <Button positive loading={savingAssets} floated={'right'} disabled={!isEnabled} onClick={this.onSaveAssets}>
            Save Assets
          </Button>
          <Button className="btn-cancel"  floated={'right'} onClick={() => this.props.closeModal()}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
    )
  }
}

export default compose(
  graphql(createMediaTag, {
    props ({ownProps, mutate}) {
      return {
        createTag ({mediaId, categoryIds}) {
          return mutate({
            variables: {
              input: {
                mediaId,
                categoryIds
              }
            },
            refetchQueries:  [{
              query: assetsByCategory,
              variables: {
                id: ownProps.selectedCategory
              }
            }]
          })
        }
      }
    }
  }),
  graphql(getCategorybySocialIdQuery, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.socialId
      }
    }),
    props: ({data: { socialProfile }}) => ({ socialProfile })
  })
)(AddAssetsModal)
