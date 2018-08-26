import React, { Component } from 'react'
import { Popup, Icon } from 'semantic-ui-react'
import Notification from '../Notification'
import SearchInput from 'react-search-input'
import persist from '../../libraries/persist'
import { graphql } from 'react-apollo'
import { createCategoryMutation } from '../Campaigns/graphql/categoryMutations'
import { getCategorybySocialIdQuery } from '../Campaigns/graphql/categoryQueries'

import './styles.scss'

class FilterSearchInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: '',
      isOpen: false,
      filterModalVisible: false
    }
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  onFavourite = () => {
    const sortOption = 'favourite'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onSortAZ = () => {
    const sortOption = 'aToZ'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onSortZA = () => {
    const sortOption = 'zToA'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onPopular = () => {
    const sortOption = 'popular'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onMostImages = () => {
    const sortOption = 'mostimages'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onLeastImages = () => {
    const sortOption = 'leastimages'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onSortImages = () => {
    const sortOption = 'image'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onSortGifs = () => {
    const sortOption = 'gif'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onSortVideos = () => {
    const sortOption = 'video'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  onSortHashtags = () => {
    const sortOption = 'hashtag'
    this.props.onFilter(sortOption)
    this.setState({
      isOpen: false
    })
  }

  searchUpdated = (term) => {
    this.props.searchUpdated(term)
    this.setState({
      searchTerm: term,
      isOpen: false,
      filterModalVisible: !!term
    })
  }

  onCreateCategory = () => {
    const { searchTerm } = this.state

    const socialProfileId = persist.willGetCurrentSocialProfile()

    if (searchTerm !== '') {
      this.props.createCategory({categoryName: searchTerm, socialProfileId, color: '#36BF99'})
      .then((data) => {
        Notification.success('New Category is added.')
      })
    }
  }

  render () {
    const { searchTerm, filterModalVisible } = this.state
    const { type } = this.props
    let searchSuggestion = (
      <div className='sort-entire-view'>
        <div className='sort-title-view' onClick={this.onFavourite}>
          <Icon name='heart' />
          <span className='category-title'>
            Favourites
          </span>
        </div>
        <div className='sort-title-view' onClick={this.onSortAZ}>
          <Icon name='arrow up' />
          <span className='category-title'>
            Sort A-Z
          </span>
        </div>
        <div className='sort-title-view' onClick={this.onSortZA}>
          <Icon name='arrow down' />
          <span className='category-title'>
            Sort Z-A
          </span>
        </div>
        <div className='sort-title-view' onClick={this.onPopular}>
          <Icon name='smile' />
          <span className='category-title'>
            Popular
          </span>
        </div>
        <div className='sort-title-view' onClick={this.onMostImages}>
          <Icon name='fire' />
          <span className='category-title'>
            Most images
          </span>
        </div>
        <div className='sort-title-view' onClick={this.onLeastImages}>
          <Icon name='sun' />
          <span className='category-title'>
            Least images
          </span>
        </div>
      </div>
    )

    if (type === 'assets') {
      searchSuggestion = (
        <div className='sort-entire-view'>
          <div className='sort-title-view' onClick={this.onSortImages}>
            <Icon name='image' />
            <span className='category-title'>
              Images
            </span>
          </div>
          <div className='sort-title-view' onClick={this.onSortGifs}>
            <i className='icon gif'>GIF</i>
            <span className='category-title'>
              GIFs
            </span>
          </div>
          <div className='sort-title-view' onClick={this.onSortVideos}>
            <Icon name='youtube' />
            <span className='category-title'>
              Videos
            </span>
          </div>
          <div className='sort-title-view' onClick={this.onSortHashtags}>
            <Icon name='hashtag' />
            <span className='category-title'>
              Hashtags
            </span>
          </div>
        </div>
      )
    }
    return (<div className='filter-search-input'>
      <Popup
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        className='add-assets'
        trigger={<SearchInput className='search-input' onChange={this.searchUpdated} />}
        content={searchSuggestion}
        on='click'
        position='top right'
      />
      {filterModalVisible && (
        <div className='sort-entire-view'>
          <div className='sort-title-view'>
            <Icon name='search' />
            <span className='category-title'>
              All items with <b>{searchTerm}</b>
            </span>
          </div>
          <div className='sort-title-view' onClick={this.onCreateCategory}>
            <Icon name='plus' />
            <span className='category-title'>
              Add <b>{searchTerm}</b> as Category
            </span>
          </div>
        </div>
      )}
    </div>)
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
})(FilterSearchInput)
