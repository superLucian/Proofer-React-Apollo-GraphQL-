import React, {Component} from 'react'
import {Grid, Button, Icon} from 'semantic-ui-react'
import FilterSearchInput from '../FilterSearchInput'
import AddAssets from '../AssetBank/AddAssets'
import AssetsBank from '../AssetBank'
import AddCategoryDropDown from '../Campaigns/AddCategoryDropdown'
import onClickOutside from 'react-onclickoutside'
// import ContentItem from '../Campaigns/ContentItem'
// import CategoryList from '../Category'

import './styles.scss'

class RightPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalOpen: false,
      searchTerm: '',
      sortOption: null,
      categoryItemEnabled: false,
      rightPanelOpen: false,
      selectedCategory: props.selectedCategory || ''
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ selectedCategory: nextProps.selectedCategory || ''})
  }

  onOpenModal = () => {
    this.setState({
      modalOpen: true
    })
  }

  onCloseModal = () => {
    this.setState({
      modalOpen: false
    })
  }

  searchUpdated = (term) => {
    this.setState({
      searchTerm: term
    })
  }

  onFilter = (sortOption) => {
    this.setState({
      sortOption
    })
  }

  onAssetCategorySelected = (selectedCategory) => {
    this.setState({ selectedCategory })
  }

  onCategorySelected = (category) => {
    this.setState({
      categoryItemEnabled: !this.state.categoryItemEnabled,
      selectedCategory: category
    })
  }

  toCategoryPanel = () => {
    this.setState({
      categoryItemEnabled: false,
      selectedCategory: ''
    })
  }

  onTogglePanel = () => {
    this.setState({
      categoryItemEnabled: false,
      selectedCategory: ''
    })
    this.props.onTogglePanel()
  }

  render () {
    const { id, className, open, type, width, tablet, computer, largeScreen, widescreen, socialId } = this.props
    let addButton = <AddCategoryDropDown socialId={this.props.socialId} />
    let title = 'Categories'
    let contentBody = <CategoryList
      {...{width, tablet, computer, largeScreen, widescreen}}
      searchTerm={this.state.searchTerm}
      sortOption={this.state.sortOption}
      onCategorySelected={this.onCategorySelected}
      socialId={this.props.socialId}
      isPanel
    />
    if (type === 'assets') {
      addButton = <AddAssets
        socialId={this.props.socialId}
        selectedCategory={this.state.selectedCategory}
        onCategoryChange={this.onAssetCategorySelected} />
      title = 'Assets'
      contentBody = <AssetsBank
        isPanel
        searchTerm={this.state.searchTerm}
        sortOption={this.state.sortOption}
        socialProfilesIds={[this.props.socialId]}
        selectedCategory={this.state.selectedCategory}
      />
    } else if (type === 'content' || this.state.categoryItemEnabled) {
        addButton = <Icon name='plus circle' onClick={() => this.setState({ modalOpen: true })} />
        title = 'Content for \'' + this.state.selectedCategory.name + '\''
        contentBody = <ContentItem
          categoryId={this.state.selectedCategory.id}
          goBack={this.onCategorySelected}
        />
    }

    const backMethod = this.state.categoryItemEnabled ? this.toCategoryPanel : this.onTogglePanel

    const { modalOpen } = this.state

    const contentWidth = 'calc(50% - calc(0.5 * 220px))' // 0.5 = 8 columns, 220px = left navbar + posts container padding
    let style = {
      position: 'fixed',
      top: 0,
      zIndex: 100,
      width: contentWidth
    }

    if (type === 'category' || type === 'content') {
      style = {
        position: 'fixed',
        top: 0,
        zIndex: 100,
        width: contentWidth
      }
    }

    if (!open) {
      return null
    }

    return (<Grid.Column className={className ? 'right-panel ' + className : 'right-panel'} {...{width, tablet, computer, largeScreen, widescreen}}>
      <div id={id} style={style}>
        <div className='right-panel-header'>
          <div className={this.state.categoryItemEnabled ? 'right-panel-header-left cat-content' : 'right-panel-header-left'}>
            <Button icon onClick={backMethod}>
              {type === 'content' ? <Icon name='chevron left' /> : <Icon name='chevron right' />}
            </Button>
            <div className='title'>{title}</div>
            {addButton}
          </div>
          <div className='right-panel-header-right'>
            <FilterSearchInput
              type={type}
              searchUpdated={this.searchUpdated}
              onFilter={this.onFilter}
              socialId={socialId}
            />
          </div>
        </div>
        <div className='right-pane-content'>
          {contentBody}
        </div>
      </div>
      {/* <CreatePost
        modalOpen={modalOpen}
        socialId={this.props.socialId}
        selectedCategoryId={this.state.selectedCategory.id}
        onCloseModal={this.onCloseModal}
      />*/}
    </Grid.Column>)
  }
}


const clickOutsideConfig = {
  handleClickOutside: (instance) => {
    return instance.onClickOutside
  }
}

const RightPanelWithClickHandler = onClickOutside(RightPanel, clickOutsideConfig)

export default class Container extends Component {
  render () {
    return <RightPanelWithClickHandler outsideClickIgnoreClass='ignore-react-onclickoutside' {...this.props} />
  }
}
