import React, { Component } from 'react'
import { Icon, Image, Popup } from 'semantic-ui-react'
import { withApollo } from 'react-apollo'
import { Draggable } from 'react-drag-and-drop'
import MasonryInfiniteScroller from 'react-masonry-infinite'

import Notification from '../Notification'
import Loader from '../Loader'
import {fetchOneCategoryQuery} from './graphql/categoryQueries'

import './styles/react-search-input.scss'

class CampaignsItems extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasMore: this.props.hasNextPage,
      endCursor: this.props.endCursor,
      oldEndCursor: '',
      loading: false,
      items: this.props.items
    }
  }

  loadMore = (pageNumber) => {
    const _items = this.state.items
    const { oldEndCursor, endCursor, loading } = this.state
    if (endCursor === oldEndCursor || loading) {
      return
    }
    console.log('=== Load More ===')
    this.setState({
      loading: true
    })
    this.props.client.query({
      query: fetchOneCategoryQuery,
      variables: {
        id: this.props.categoryId,
        after: endCursor
      }
    }).then((graphQLResult) => {
      const { errors, data } = graphQLResult
      if (errors) {
        if (errors.length > 0) {
          Notification.error(errors[0].message)
        }
      } else {
        const availableContent = data.category.contents.edges.map((e) => ({...e.node}))
        this.setState({
          items: [..._items, ...availableContent],
          hasMore: data.category.contents.pageInfo.hasNextPage,
          endCursor: data.category.contents.pageInfo.endCursor,
          oldEndCursor: endCursor,
          loading: false
        })
      }
    }).catch((error) => {
      Notification.error(error.message)
    })
  }

  renderImages = (media) => {
    return media.map(m => <Image className='post-image' src={m.url} inline/>)
  }

  countLikeFavsPosted = (schedules) => {
    let list = schedules.edges.map((m) => m.node);
    let likes = 0;
    let favs = 0;
    let posted = list.length;
    if(list.length > 0) {
      list.map(({status}) => {
        if(status && status.favouriteCount){
          likes = parseInt(likes) + parseInt(status.favouriteCount)
        }
        if(status && status.retweetCount){
          favs = parseInt(favs) + parseInt(status.retweetCount)
        }
      })
    }
    return {likes, favs, posted};
  }

  render () {
    const {items} = this.state

    if (items.length === 0) {
      return <div className='post-short-item'>
        No posts
      </div>
    }

    return (<div>{/*<MasonryInfiniteScroller
      className='categoryGrid'
      pageStart={0}
      loadMore={this.loadMore}
      sizes={[{ columns: 3, gutter: 10 }]}
      loader={<Loader />}
      pack
      packed='data-packed'
      hasMore={this.state.hasMore}
    >*/}
      {items.map((content, index) => {
        let {likes, favs, posted} = this.countLikeFavsPosted(content.schedules);
        return (<Draggable type='post' data={JSON.stringify(content)}>
          <div key={content.id} className='post-short-item'>
            <div className='post-short-content'>
              <div className='post-short-stat'>
                <Popup
                  key={0}
                  trigger={<Icon name='exchange' />}
                  content='Drag and Drop into your post'
                  inverted
                />
                <div>
                  <Icon name='twitter' />
                  <Icon name='facebook' />
                  <Icon name='instagram' />
                </div>
                <div className='social-stat'>
                  <span><Icon name='heart' />{likes}</span>
                  <span><Icon name='refresh' />{favs}</span>
                  {/* <span><Icon name='comment' />10</span> */}
                </div>
                <div>
                  <b>Times posted:&nbsp;{posted}</b>
                </div>
              </div>
              {content.text && <div className='post-short-desc'>
                {content.text}
              </div>
              }
              {!!content.media.length &&
                this.renderImages(content.media)
              }
            </div>
          </div>
        </Draggable>)
      })}
      {this.props.mobile && <div>
      </div>}
    </div>)
  }
}

export default withApollo(CampaignsItems)
