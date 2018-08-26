import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import {notFollowingBack, notFollowingBackLessThanOneDay} from "../notFollowingBackQueries";
import { Grid, Pagination } from "semantic-ui-react";
import User from "../User/index";
import {followMutation, unfollowMutation} from "../followUnfollowMutations";
import Notification from '../../Notification/index'
import Loader from "../../Loader/index";

import '../styles.scss'

const USERS_PER_PAGE = 40

class UnfollowLists extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 0,
      notFollowingBackMap: this.convertToMap(this.props.notFollowingBack.data),
      notFollowingBackLessThanOneDayMap: this.convertToMap(this.props.notFollowingBackLessThanOneDay.data),
      justUnfollowedMap: new Map()
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      notFollowingBackMap: this.convertToMap(nextProps.notFollowingBack.data),
      notFollowingBackLessThanOneDayMap: this.convertToMap(nextProps.notFollowingBackLessThanOneDay.data),
    })
  }

  handlePaginationChange = (e, { activePage }) => {
    this.setState({
      page: activePage - 1
    })
  }

  convertToMap = (list) => {
    if (list) {
      let map = new Map()
      list.map(user => {
        map.set(user.id, user)
      })
      return map
    }
    return null
  }

  onUnfollow = (userId) => {
    let notFollowingBack = new Map(this.state.notFollowingBackMap)
    let justUnfollowed = new Map(this.state.justUnfollowedMap)
    notFollowingBack.delete(userId)
    let user = Object.assign({}, this.state.notFollowingBackMap.get(userId))
    user.pending = true
    justUnfollowed.set(userId, user)
    this.setState({
      notFollowingBackMap: notFollowingBack,
      justUnfollowedMap: justUnfollowed
    })
    this.props.unfollow({id: userId})
    .then((data) => {
      let notFollowingBack = new Map(this.state.notFollowingBackMap)
      let justUnfollowed = new Map(this.state.justUnfollowedMap)
      user.pending = false
      justUnfollowed.set(userId, user)
      this.setState({
        notFollowingBackMap: notFollowingBack,
        justUnfollowedMap: justUnfollowed
      })
    })
    .catch((error) => {
      let notFollowingBack = new Map(this.state.notFollowingBackMap)
      let justUnfollowed = new Map(this.state.justUnfollowedMap)
      Notification.error(error)
      user.pending = undefined
      notFollowingBack.set(userId, user)
      justUnfollowed.delete(userId)
      this.setState({
        notFollowingBackMap: notFollowingBack,
        justUnfollowedMap: justUnfollowed
      })
    })
  }

  onFollow = (userId) => {
    let notFollowingBack = new Map(this.state.notFollowingBackMap)
    let justUnfollowed = new Map(this.state.justUnfollowedMap)
    let user = Object.assign({}, this.state.justUnfollowedMap.get(userId))
    user.pending = undefined
    notFollowingBack.set(userId, user)
    justUnfollowed.delete(userId)
    this.setState({
      notFollowingBackMap: notFollowingBack,
      justUnfollowedMap: justUnfollowed
    })
    this.props.follow({id: userId})
    .catch((error) => {
      let notFollowingBack = new Map(this.state.notFollowingBackMap)
      let justUnfollowed = new Map(this.state.justUnfollowedMap)
      user.pending = undefined
      justUnfollowed.set(userId, user)
      notFollowingBack.delete(userId)
      this.setState({
        notFollowingBackMap: notFollowingBack,
        justUnfollowedMap: justUnfollowed
      })
      Notification.error(error)
    })
  }

  renderPeople = (userMap) => {
    const start = this.state.page * USERS_PER_PAGE
    const end = start + USERS_PER_PAGE
    let list = Array.from(userMap.values())
    list.reverse()
    list = list.slice(start, end)
    return list.map(e => {
      return (
        <User key={e.id} user={e} onUnfollow={this.onUnfollow} onFollow={this.onFollow}/>
      )
    })
  }

  render () {
    if (this.props.notFollowingBack.loading || this.props.notFollowingBackLessThanOneDay.loading || !this.props.socialProfile) {
      return <section><Loader/></section>
    }

    let {notFollowingBackMap, justUnfollowedMap, notFollowingBackLessThanOneDayMap} = this.state
    let createdAt = new Date(this.props.socialProfile.createdAt)
    let newAccount = false
    let pendingAccount = false

    if (createdAt > new Date().setHours(new Date().getHours() - 2) && (this.props.socialProfile.twitterFriends.count === 0 || this.props.socialProfile.twitterFollowers.count === 0)) {
      pendingAccount = true
    } else if (createdAt > new Date().setDate(new Date().getDate() - 1)) {
      notFollowingBackMap = new Map([...notFollowingBackMap, ...notFollowingBackLessThanOneDayMap])
      newAccount = true
    }

    if (pendingAccount) {
      return (
        <div className='unfollow-wrapper'>
          We are collecting your data, please check back in a few minutes!
        </div>
      )
    }

    return (
      <div className='unfollow-wrapper'>
        <div style={{width: '40%'}} className='not-following'>
          <span className='title'>People not following you back...</span>
          <span style={{display: 'block'}}> We found {this.state.notFollowingBackMap.size + this.state.notFollowingBackLessThanOneDayMap.size} users.</span>
          {!newAccount &&
          <span style={{display: 'block'}}> Hiding {notFollowingBackLessThanOneDayMap.size} users that you followed less than a day ago.</span>
          }
          {notFollowingBackMap.size > USERS_PER_PAGE ?
          <Pagination activePage={this.state.page + 1} totalPages={Math.ceil(notFollowingBackMap.size / USERS_PER_PAGE)} onPageChange={this.handlePaginationChange} />
            :
            <div style={{height: '98px'}}/>
          }
          <Grid columns={2}>
            {this.renderPeople(notFollowingBackMap)}
          </Grid>
          {notFollowingBackMap.size > USERS_PER_PAGE &&
            <Pagination activePage={this.state.page + 1} totalPages={Math.ceil(notFollowingBackMap.size / USERS_PER_PAGE)} onPageChange={this.handlePaginationChange} />
          }
        </div>
        <div style={{width: '20%'}}/>
        <div style={{width: '30%'}} className='just-unfollowed'>
          <span className='title'>People you just unfollowed...</span>
          {justUnfollowedMap.size > USERS_PER_PAGE ?
          <Pagination activePage={this.state.page + 1} totalPages={Math.ceil(justUnfollowedMap.size / USERS_PER_PAGE)} onPageChange={this.handlePaginationChange} />
            :
          <div style={{height: '127px'}}/>
          }
          <Grid columns={2}>
            {this.renderPeople(justUnfollowedMap)}
          </Grid>
          {justUnfollowedMap.size > USERS_PER_PAGE &&
          <Pagination activePage={this.state.page + 1} totalPages={Math.ceil(justUnfollowedMap.size / USERS_PER_PAGE)} onPageChange={this.handlePaginationChange} />
          }
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(notFollowingBack, {
    options: (props) => ({
      variables: {
        socialProfileId: props.socialId
      }
    }),
    props: ({data: {twitterFriendsNotFollowing, loading, error}}) => ({notFollowingBack: {data: twitterFriendsNotFollowing, loading, error}})
  }),
  graphql(notFollowingBackLessThanOneDay, {
    options: (props) => ({
      variables: {
        socialProfileId: props.socialId
      }
    }),
    props: ({data: {twitterFriendsNotFollowingLessThanOneDay, loading, error}}) => ({notFollowingBackLessThanOneDay: {data: twitterFriendsNotFollowingLessThanOneDay, loading, error}})
  }),
  graphql(unfollowMutation, {
    props ({ ownProps, mutate }) {
      return {
        unfollow ({id}) {
          return mutate({
            variables: {
              socialProfileId: ownProps.socialId,
              twitterUserId: id
            }
          })
        }
      }
    }
  }),
  graphql(followMutation, {
    props({ownProps, mutate}) {
      return {
        follow({id}) {
          return mutate({
            variables: {
              socialProfileId: ownProps.socialId,
              twitterUserId: id
            }
          })
        }
      }
    }
  })
)(UnfollowLists)
