import Notification from '../../Notification'
import {es6DateToDateTime} from '../../../libraries/helpers'

// Create/Update Content
// Add Media to Content
// Update ContentSchedule
const editPost = ({postItem, socialProfileId = null, dateTime = null, moderationStatus = null}) => {
  const {createContent, updateContentSchedule, contentSchedule, calendarSlot, editContentAddMedia} = postItem.props
  const {state} = postItem

  const doUpdateContentSchedule = (contentId = null) => {
    // Set update variables only if not null
    let updateObject = {
      contentScheduleId: contentSchedule.id,
      socialProfileId: socialProfileId || state.socialProfile.id,
      ...dateTime ? {dateTime: es6DateToDateTime(dateTime)} : null,
      ...contentId ? {contentId} : {contentId: state.newContentId || contentSchedule.content.id},
      ...moderationStatus && {moderationStatus}
    }
    updateContentSchedule(updateObject)
      .then(() => {
        Notification.success('Edited successfully.')
        postItem.setState({newAssets: [], newContentId: null})
      }).catch((e) => {
        console.log(e)
        Notification.error('Editing error.')
      })
  }

  const doAddMedia = () => {
    if (state.newAssets.length) {
      editContentAddMedia({
        contentId: state.newContentId || contentSchedule.content.id,
        mediaIds: state.newAssets.map(e => {return e.id})
      }).then(() => {
        doUpdateContentSchedule()
      })
    } else {
      doUpdateContentSchedule()
    }
  }

  if (contentSchedule.id) {
    if (state.text !== contentSchedule.content.text && !state.newContentId) {
      let contentCreateObject = {
        ...state.text && {contentText: state.text || ''},
        mediaIds: state.assets.map(e => {return e.id}),
        ...calendarSlot && {categoryIds: [calendarSlot.node.category.id]},
        socialProfilesIds: [socialProfileId || state.socialProfile.id]
      }
      createContent(contentCreateObject)
        .then((data) => {
          doUpdateContentSchedule(data.data.createContent.content.id)
        }).catch((e) => {
          console.log(e)
          Notification.error('Update content error.')
        })
    } else {
      doAddMedia()
    }
  }
}

export default editPost
