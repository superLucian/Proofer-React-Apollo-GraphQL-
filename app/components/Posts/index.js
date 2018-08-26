import React, {Component} from 'react'

import PostList from './PostList'

class Posts extends Component {
  render () {
    const {socialId, socialIds} = this.props
    if (!socialId) {
      return (
        <div className='page-wrapper'>
          Please select a social profile on the left, or click the + to connect a new one.
        </div>
      )
    }

    return (
      <div className='page-wrapper posts-page'>
        <PostList socialIds={socialIds} socialId={socialId}/>
      </div>
    )
  }
}

export default Posts
