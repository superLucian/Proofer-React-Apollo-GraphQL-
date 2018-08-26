import { mediaUrl } from '../../libraries/constants'
import persist from '../../libraries/persist'

const uploadMedia = (images) => {
  const mediaIds = []
  let sendCount = 0
  let receiveCount = 0

  return new Promise((resolve, reject) => {
    images.map((file, index) => {
      const authorization = 'Bearer' + persist.willGetAccessToken()
      const teamGID = persist.willGetTeamId()

      sendCount++

      const mediaFormData = new FormData()
      mediaFormData.append('mediaFile', file)

      const xhr = new XMLHttpRequest()
      xhr.open('post', mediaUrl, true)
      xhr.setRequestHeader('authorization', authorization)
      xhr.setRequestHeader('x-proof-teamid', teamGID)

      xhr.onload = function () {
        if (this.status === 200) {
          receiveCount++

          const oneMediaId = JSON.parse(this.response)['media_ids']
          mediaIds.push(oneMediaId[0])
          if (sendCount !== 0 && receiveCount !== 0 && sendCount === receiveCount && receiveCount === images.length) {
            resolve(mediaIds)
          }
        } else {
          reject(this.statusText)
        }
      }
      xhr.send(mediaFormData)

      return true
    })
  })
}

export default uploadMedia