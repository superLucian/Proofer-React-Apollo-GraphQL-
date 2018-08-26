import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { Button, Popup, Icon, Dropdown } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import Notification from '../Notification'
import Loader from '../Loader'
import { createMediaTag, removeMediaTag } from './graphql/assetsMutations'
import {getAssets, getCategorybySocialIdQuery} from './graphql/AssetQueries'
import uploadMedia from './uploadMediaMethod'

import './styles/addAssets.scss'

class AddAssets extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      newAsset: null,
      tags: props.categoryIds || [],
      suggestions: [],
      uploading: false
    }
  }

  onDrop = (file) => {
    this.setState({
      newAsset: file[0]
    })
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  onSaveAsset = () => {
    const { newAsset } = this.state
    this.setState({
      uploading: true
    })

    if (newAsset) {
      uploadMedia([newAsset]).then((mediaIds) => {
        const mediaId = mediaIds[0]
        const categoryIds = this.state.tags
        this.props.createTag({mediaId, categoryIds})
        .then((data) => {
          console.log('Media uploaded!')
          Notification.success('New Asset is added.')
          this.setState({
            newAsset: null,
            uploading: false,
            isOpen: !this.state.isOpen
          })
          this.props.onSelectAsset(data.data.editMediumAddCategories.media)
        })
        .catch((e) => {
          console.log(e)
          Notification.error('Add assets Error')
        })
      })
    }
  }

  handleChange = (e, { value }) => {
    value = (value.length > 0) ? value : [this.props.selectedCategory.id]
    this.setState({ tags: value })
  }

  onCategoryChange = (e, value) => {
    const categories = this.getSuggestions(true)
    this.props.onCategoryChange(categories.filter((category) => category.id === value.value )[0])
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

  renderDropdownView = () => {
    const { socialProfile } = this.props
    const fetchedArray = !socialProfile ? [] : socialProfile.categories
    if (fetchedArray.length === 0) {
      return <Loader />
    }
    const suggestions = this.getSuggestions()

    return (
      <div className='assets-dropdown-content ignore-react-onclickoutside'>
        <div className='assets-dropdown-inner-content'>
          <Dropzone
            ref='dropzone'
            onDrop={this.onDrop}
            className='assets-drop-image'
          >
            {this.state.newAsset ?
              <img src={this.state.newAsset.preview} />
              :
              <p>Drag and Drop Asset or Click to Browse Files</p>
            }
          </Dropzone>
          <div className='assets-tags'>
            <Dropdown
              ref='dropdown'
              placeholder='Add to category'
              fluid
              multiple
              search
              selection
              value={this.state.tags}
              options={suggestions}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className='add-assets-buttons'>
          <Button onClick={this.handleClose}>Cancel</Button>
          <Button disabled={this.state.uploading} className='savecategory-button' onClick={this.onSaveAsset}>{this.state.uploading ? <Loader /> : 'Save Asset'}</Button>
        </div>
      </div>
    )
  }

  render () {
    const { socialProfile, selectedCategory } = this.props
    const fetchedArray = !socialProfile ? [] : socialProfile.categories
    if (fetchedArray.length === 0) {
      return <Loader />
    }

    const suggestions = this.getSuggestions()
    return (<div>
      {selectedCategory && <Dropdown
        key={'dropdown'}
        placeholder='Select category'
        className='link item'
        fluid
        selection
        value={selectedCategory.id}
        options={suggestions}
        onChange={this.onCategoryChange}
      />}
      {this.props.simpleUpload ?
        <Dropzone className='add-assets-dropzone' onDrop={this.props.onUpload}>
          <Button className='success empty'>Upload Image</Button>
        </Dropzone>
        :
        <Popup
          key={'popup'}
          open={this.state.isOpen}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          className='add-assets'
          trigger={<Button className='success empty'>Upload Image</Button>}
          content={this.renderDropdownView()}
          on='click'
          position='bottom right'
        />
      }
    </div>)
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
            refetchQueries: [{
              query: getAssets,
              variables: {
                categoryIds: ownProps.categoryIds || (ownProps.selectedCategoryId && ownProps.selectedCategory.id) || []
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
)(AddAssets)
