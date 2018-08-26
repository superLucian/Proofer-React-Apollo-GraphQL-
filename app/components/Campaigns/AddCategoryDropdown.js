import React, { Component } from 'react'
import {Button, Popup, Icon} from 'semantic-ui-react'
import Notification from '../Notification'
import ColorPickerCell from './ColorPickerCell'
import ColorNames from './consts/color.json'
import persist from '../../libraries/persist'
import { graphql } from 'react-apollo'
import { createCategoryMutation } from './graphql/categoryMutations'
import { getCategorybySocialIdQuery } from './graphql/categoryQueries'

class AddCategoryDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      categoryName: '',
      categoryColor: '#36BF99',
      isOpen: this.props.open
    }
  }

  onCategoryNameChange = (e) => {
    this.setState({
      categoryName: e.target.value
    })
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  onSave = () => {
    let {categoryName, isOpen, categoryColor} = this.state

    const socialProfileId = persist.willGetCurrentSocialProfile()

    if (categoryName !== '') {
      this.props.createCategory({categoryName, socialProfileId, color: categoryColor})
      .then((data) => {
        Notification.success('New Category is added.')
        this.setState({
          isOpen: !isOpen
        })
      })
    }
  }

  onCategoryColorChange = (colorCode) => {
    console.log(colorCode)
    this.setState({
      categoryColor: colorCode
    })
  }

  renderDropdownView = () => {
    const {categoryName, categoryColor} = this.state
    return (
      <div className='dropdown-content'>
        <div className='category-title-view'>
          <input
            type='text'
            className='category-name-input'
            placeholder='Enter category name'
            value={categoryName}
            style={{backgroundColor: categoryColor}}
            onChange={this.onCategoryNameChange}
          />
        </div>
        <div className='category-color-view'>
          <p className='category-title'>
            Select a Color
          </p>

          <div className='category-color-picker'>
            {
              ColorNames.color.map((color, index) => (
                <ColorPickerCell
                  key={index}
                  colorCode={color.name}
                  categoryColorChange={this.onCategoryColorChange}
                />
              ))
            }
          </div>
        </div>
        <div className='category-button-view'>
          <Button onClick={this.handleClose}>Cancel</Button>
          <Button className='savecategory-button' onClick={this.onSave}>Save Category</Button>
        </div>
      </div>)
  }

  render () {
    return (<Popup
      open={this.state.isOpen}
      onClose={this.handleClose}
      onOpen={this.handleOpen}
      className='add-category'
      trigger={<Icon name='plus circle' />}
      content={this.renderDropdownView()}
      on='click'
      position='top right'
    />)
  }
}

export default graphql(createCategoryMutation, {
  props ({ownProps, mutate}) {
    return {
      createCategory ({categoryName, socialProfileId, color}) {
        return mutate({
          variables: {
            input: {
              categoryName,
              socialProfileId,
              color
            }
          },
          refetchQueries: [{
            query: getCategorybySocialIdQuery,
            variables: {
              id: ownProps.socialId
            }
          }]
        })
      }
    }
  }
})(AddCategoryDropdown)
