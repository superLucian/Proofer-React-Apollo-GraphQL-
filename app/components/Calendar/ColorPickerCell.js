import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

export default class ColorPickerCell extends Component {
  constructor (props) {
    super(props)

    this.state = {
      activeColorCode: this.props.selectedCategoryColorCode
    }
  }

  handleColorChange = (event) => {
    const { name } = event.target
    this.props.categoryColorChange(name)
  }

  render () {
    const { colorCode } = this.props
    return (<Button type='button'
      style={{ backgroundColor: colorCode }}
      size='mini'
      active
      compact
      className='category-button-cell'
      name={colorCode}
      onClick={this.handleColorChange}
    />)
  }
}
