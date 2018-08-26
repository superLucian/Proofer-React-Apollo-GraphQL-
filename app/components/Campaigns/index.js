import React, {Component} from 'react'
import { Grid, Dropdown } from 'semantic-ui-react'
import Campaigns from './Campaigns'
import CampaignsMulti from './CampaignsMulti'
import onClickOutside from 'react-onclickoutside'

import './styles/index.scss'

class CampaignsIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  onChangeFilter = (e, { value }) => {
    this.setState({ value })
  }

  onTogglePanel = () => {
    console.log('CLick outside method')
    this.props.onTogglePanel(this.props.categoryId)
  }


  render () {
    const {id, width, mobile, tablet, computer, largeScreen, widescreen, isMulti} = this.props
    const {value} = this.state

    let style = {
      position: 'fixed',
      top: 80,
      right: 0,
      zIndex: 100,
      width: '42em',
      maxWidth: '42em',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.2)'
    }

    const options = [
      { key: 1, text: 'Popularity', value: 1 },
      { key: 2, text: 'A-Z', value: 2 },
      { key: 3, text: 'Z-A', value: 3 }
    ]

    return (<Grid.Column className='campaigns-panel ignore-react-onclickoutside' {...{width, tablet, computer, largeScreen, widescreen}}>
      <div id={id} style={style}>
        <div className='campaigns-header'>
          <div className='title' onClick={this.props.onTogglePanel}>Campaigns</div>
          <Dropdown
            onChange={this.handleChange}
            options={options}
            placeholder='Sort by'
            selection
            value={value}
          />
        </div>
        <div className='campaigns-content'>
          {isMulti ?
            <CampaignsMulti
              categoryId={this.props.categoryId}
              socialId={this.props.socialId}
              />
            :
            <Campaigns
              categoryId={this.props.categoryId}
            />
          }
        </div>
      </div>
    </Grid.Column>)
  }
}

const clickOutsideConfig = {
  handleClickOutside: (instance) => {
    console.log(instance)
    return instance.onTogglePanel
  }
}

const CampaignsIndexWithClickHandler = onClickOutside(CampaignsIndex, clickOutsideConfig)

export default class Container extends Component {
  render () {
    return <CampaignsIndexWithClickHandler outsideClickIgnoreClass='ignore-react-onclickoutside' {...this.props} />
  }
}
