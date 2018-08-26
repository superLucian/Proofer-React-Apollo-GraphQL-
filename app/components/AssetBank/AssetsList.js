import React, {Component} from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import {getAssets, deleteMedium} from './graphql/AssetQueries'
import Loader from '../Loader'
import Notification from '../Notification'
// import {createFilter} from 'react-search-input'
// import AddAssets from './AddAssets'
import { Image, Icon, Confirm } from 'semantic-ui-react'
import MasonryInfiniteScroller from 'react-masonry-infinite'
import { Draggable } from 'react-drag-and-drop'

// const KEYS_TO_FILTERS = ['id']

import './styles.scss'

class AssetsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasMore: this.props.hasNextPage,
      endCursor: this.props.endCursor,
      oldEndCursor: '',
      loading: false,
      assets: this.props.assets,
      deleteMediaId: null,
      confirmBox: false
    }
  }

  searchUpdated = (term) => {
    this.setState({
      searchTerm: term
    })
  }

  loadMore = (pageNumber) => {
    const _assets = this.state.assets
    const { oldEndCursor, endCursor, loading } = this.state
    if (endCursor === oldEndCursor || loading) {
      return
    }
    /* console.log('=== Load More ===')
    console.log('endCursor - ' + endCursor)
    console.log('oldEndCursor - ' + oldEndCursor) */
    this.setState({
      loading: true
    })
    this.props.client.query({
      query: getAssets,
      variables: {
        categoryIds: this.props.selectedCategory ? [this.props.selectedCategory.id] : [],
        after: endCursor
      }
    }).then((graphQLResult) => {
      const { errors, data } = graphQLResult
      if (errors) {
        if (errors.length > 0) {
          Notification.error(errors[0].message)
        }
      } else {
        // console.log('newCursor - ' + data.media_find.pageInfo.endCursor)
        this.setState({
          assets: [..._assets, ...data.media_find.edges],
          hasMore: data.media_find.pageInfo.hasNextPage,
          endCursor: data.media_find.pageInfo.endCursor,
          oldEndCursor: endCursor,
          loading: false
        })
      }
    }).catch((error) => {
      Notification.error(error.message)
    })
  }

  onDeleteMedium = (deleteMediaId, index) => {
    var confirmBox = true
    this.setState({deleteMediaId, confirmBox})
  }

  handleCancel = () => this.setState({ confirmBox: false, deleteMediaId: null })

  handleConfirm = () => {
    const { deleteMediaId, assets } = this.state
    const { deleteMedium } = this.props

    const newAssets = []

    for (let i = 0; i < assets.length; i = i + 1) {
      if (deleteMediaId !== assets[i].node.id) {
        newAssets.push(assets[i])
      }
    }

    this.setState({
      confirmBox: false,
      deleteMediaId: null,
      assets: newAssets
    })

    deleteMedium({ deleteMediaId })
    .then((data) => {
      Notification.success('Deleted successfully.')
    }).catch((e) => {
      Notification.error('Deletion error.')
    })
  }

  render () {
    const {sortOption, isPanel} = this.props
    const { assets } = this.state

    if (assets.length === 0) {
      return (<div className={isPanel ? 'assets-page scroll-page' : 'page-wrapper assets-page'}>
        <div className='no-content'>
          Assets not found
        </div>
      </div>)
    }

    const filteredAsset = []
    assets.map(asset => {
      const item = asset.node
      if (sortOption) {
        const isImage = item.url.match(/\.(jpeg|jpg|png)$/) !== null
        const isGif = item.url.match(/\.(gif)$/) !== null
        const isVideo = item.url.match(/\.(mp4|ogg|webm)$/) !== null

        if (sortOption === 'image' && isImage) {
          filteredAsset.push(asset)
        }
        if (sortOption === 'gif' && isGif) {
          filteredAsset.push(asset)
        }
        if (sortOption === 'video' && isVideo) {
          filteredAsset.push(asset)
        }
      } else {
        filteredAsset.push(asset)
      }
    })

    return (<div>
      <MasonryInfiniteScroller
        className='categoryGrid'
        pageStart={0}
        loadMore={this.loadMore}
        sizes={!isPanel ? [{ columns: 3, gutter: 10 }, { mq: '768px', columns: 4, gutter: 25 }, { mq: '1024px', columns: 5, gutter: 20 }] : [{ columns: 3, gutter: 15 }]}
        loader={<Loader />}
        pack
        packed='data-packed'
        hasMore={this.state.hasMore}
      >
        {filteredAsset.length === 0 ?
          <div className='parent-asset no-content'>
            Assets not found
          </div>
          :
          filteredAsset.map((asset, index) => {
            const assetInfo = {
              id: asset.node.id,
              url: asset.node.url
            }

            const isImage = asset.node.url.match(/\.(jpeg|jpg|gif|png)$/) !== null

            return (<div key={Math.random()} className='parent-asset'>
              <Draggable type='asset' data={JSON.stringify(assetInfo)} className='draggable-asset'>
                <div className='image-holder'>
                  {isImage ?
                    <Image src={assetInfo.url} className='asset-background' />
                    :
                    <video src={assetInfo.url} className='asset-background'>
                      Your browser does not support the video tag.
                    </video>
                  }
                  <span className='image-action remove' onClick={() => this.onDeleteMedium(assetInfo.id, index)}><Icon name='trash' /></span>
                </div>
              </Draggable>
            </div>)
          })
        }
      </MasonryInfiniteScroller>
      <Confirm
        className='deleteConfirm'
        open={this.state.confirmBox}
        onCancel={this.handleCancel}
        onConfirm={this.handleConfirm}
        size='small'
      />
    </div>)
  }
}

export default compose(
  graphql(deleteMedium, {
    props ({ ownProps, mutate }) {
      return {
        deleteMedium ({deleteMediaId}) {
          return mutate({
            variables: {
              input: {
                id: deleteMediaId
              }
            },
            refetchQueries: [{
              query: getAssets,
              variables: {
                profileIds: ownProps.socialProfilesIds ? ownProps.socialProfilesIds : [ownProps.socialId]
              }
            }]
          })
        }
      }
    }
  })
)(withApollo(AssetsList))
