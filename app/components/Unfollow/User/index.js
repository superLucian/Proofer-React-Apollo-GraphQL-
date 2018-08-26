import React, { Component } from 'react'
import {Grid, Image, Button} from 'semantic-ui-react'

import './styles.scss'

class User extends Component {
  render () {
    const { user, onUnfollow, onFollow } = this.props

    return (
      <Grid.Row className='unfollow-user'>
        <Grid.Column width={12}>
          <Image avatar src={user.profilePicture} />
          <span className='user-name'>{user.name}</span>
          <a href={"https://twitter.com/" + user.screenName} target="_blank"><span className='screen-name'>@{user.screenName}</span></a>
        </Grid.Column>
        <Grid.Column verticalAlign='middle' textAlign='center' width={4}>
          {user.pending === undefined &&
          <Button className='success' onClick={() => onUnfollow(user.id)}>Unfollow</Button>
          }
          {user.pending === true &&
          <Button className='success empty pending'>Pending...</Button>
          }
          {user.pending === false &&
          <Button className='success empty' onClick={() => onFollow(user.id)}>Follow</Button>
          }
        </Grid.Column>
      </Grid.Row>
    )
  }
}

export default User
