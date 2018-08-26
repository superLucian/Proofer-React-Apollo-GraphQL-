import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { graphql, compose } from 'react-apollo'
import {createCommentMutation} from './graphql/CommentQueries'
import calendarSlotsGql from '../Posts/graphql/calendarSlots.gql'
import Notification from '../Notification'
import { Grid, Comment, Form, Button } from 'semantic-ui-react'
import Gravatar from 'react-gravatar'
import moment from 'moment'

import './styles.scss'

class ContentComments extends Component {
  constructor (props) {
    super(props)
    let comments = props.comments.map(e => e.node)
    this.state = {
      commentText: '',
      btnStatus: false,
      savingComment: false,
      comments: comments.sort(function(a, b) {
          return moment(a.createdAt).diff(moment(b.createdAt), 'seconds')
      })
    }
  }

  componentWillReceiveProps = (nextprops) => {
    let comments = nextprops.comments
    this.setState({
      btnStatus : this.state.commentText.length > 0 ? true : false,
      comments: comments.sort(function(a, b) {
          return moment(a.createdAt).diff(moment(b.createdAt), 'seconds')
      })
    })
  }
  componentDidMount = () => {
    moment.updateLocale('en', {
      relativeTime : {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
      }
    })
    this.scrollToBottom()
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.comments.length != this.state.comments.length)
      this.scrollToBottom()
  }

  handleChange = (e, data) => {
    const {value} = data
    this.setState({btnStatus : value.length > 0 ? true: false, commentText: value})
  }

  onCreateComment = () => {
    const {contentId, createComment} = this.props
    const {commentText} = this.state

    this.setState({savingComment : true})
    createComment({ commentText, contentId })
    .then((data) => {
      this.setState({
        commentText: '',
        btnStatus: false,
        savingComment: false
      })
      Notification.success('Saved successfully.')
      this.scrollToBottom()
    }).catch((e) => {
      this.setState({savingComment : false})
      Notification.error('Saving error')
    })
  }

  scrollToBottom = () => {
    const {contentId} = this.props
    const messageList  = document.getElementById('comment_list_'+contentId)
    const scrollHeight = messageList.scrollHeight
    const height = messageList.clientHeight
    const maxScrollTop = scrollHeight - height
    ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }


  render () {
    const {contentId} = this.props
    const {btnStatus, commentText, savingComment, comments} = this.state

    return (<Grid padded className='content-comments ignore-react-onclickoutside'>
        <Grid.Row className='comments-list' id={'comment_list_'+contentId}>
          {comments && <Comment.Group>
              { comments.map(comment => <Comment key={comment.id}>
                  <Comment.Avatar as={() => <div className='avatar'><Gravatar email={comment.user.email} size={26} default='identicon' /></div>} />
                  <Comment.Content>
                      <Comment.Author as='a'>{comment.user.firstName + ' ' + comment.user.lastName}</Comment.Author>
                      <Comment.Metadata>
                        <div>{moment(comment.createdAt+'+00:00').fromNow()}</div>
                      </Comment.Metadata>
                      <Comment.Text>{comment.text}</Comment.Text>
                  </Comment.Content>
              </Comment>)}

              {comments.length == 0 && 'Be first to comment on this content' }
          </Comment.Group>}
        </Grid.Row>
        <Grid.Row className='reply-form' verticalAlign={'bottom'}>
          <Form reply onSubmit={this.onCreateComment}>
              <Form.TextArea value={commentText} onChange={this.handleChange} autoHeight rows={2} width={14} placeholder={'Type a comment here'} />
              <Button loading={savingComment} disabled={!btnStatus} circular icon='send' primary size='small' floated={'right'} />
          </Form>
        </Grid.Row>
    </Grid>)
  }
}

export default compose(
    graphql(createCommentMutation, {
      props ({ ownProps, mutate }) {
        return {
          createComment ({commentText, contentId}) {
            return mutate({
              variables: {
                input: {
                  text: commentText,
                  contentId: contentId
                }
              },
              refetchQueries: [{
                query: calendarSlotsGql,
                variables: {
                  profileIds: [ownProps.socialId],
                  type: 'WEEKLY'
                }
              }]
            })
          }
        }
      }
    })
  )(ContentComments)
