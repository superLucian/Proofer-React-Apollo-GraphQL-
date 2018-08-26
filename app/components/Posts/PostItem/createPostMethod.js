import Notification from '../../Notification'
import {convertDateToUTC} from '../../../libraries/helpers'

// Create new Content
// Add Media if required
// CreateContentSchedule
const createPost = ({postItem, socialProfileId = null, dateTime = null, moderationStatus = null, onCloseModal = null}) => {
  console.log("PostItem")
  console.log(postItem)
  const {createContent, createContentSchedule, contentSchedule, calendarSlot, editContentAddMedia} = postItem.props
  const {state} = postItem

  const doCreateContentSchedule = (contentId = null) => {
    // Set update variables only if not null
    let createObject = {
      socialProfileId: socialProfileId || state.socialProfile.id,
      contentSchedulePublishAt: dateTime ? convertDateToUTC(dateTime) : convertDateToUTC(postItem.props.dateTime),
      ...contentId ? {contentId} : {contentId: state.newContentId || contentSchedule.content.id},
      ...moderationStatus && {moderationStatus},
      ...calendarSlot && {calendarSlotId: calendarSlot.node.id}
    }
    createContentSchedule(createObject)
      .then(() => {
        Notification.success('Created successfully.')
        postItem.setState({newAssets: [], newContentId: null})
        if (onCloseModal) onCloseModal()
      }).catch((e) => {
        console.log(e)
        Notification.error('Creating error.')
      })
  }

  const doAddMedia = () => {
    if (state.newAssets.length) {
      editContentAddMedia({
        contentId: state.newContentId || contentSchedule.content.id,
        mediaIds: state.newAssets.map(e => {return e.id})
      }).then(() => {
        doCreateContentSchedule()
      })
    } else {
      doCreateContentSchedule()
    }
  }

  // If re-using a Content and changed the text
  // OR if it's a new Content
  if ((contentSchedule.id && state.text !== contentSchedule.content.text) || (!contentSchedule.id && state.text) && !state.newContentId) {
    let contentCreateObject = {
      ...state.text && {contentText: state.text},
      mediaIds: state.newAssets.map(e => {return e.id}),
      ...calendarSlot && {categoryIds: [calendarSlot.node.category.id]},
      socialProfilesIds: [socialProfileId || state.socialProfile.id]
    }
    createContent(contentCreateObject)
      .then((data) => {
        doCreateContentSchedule(data.data.createContent.content.id)
      }).catch((e) => {
        console.log(e)
        Notification.error('Create content error.')
      })
  } else {
    doAddMedia()
  }
}
export default createPost
