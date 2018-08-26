import { notify as notifyDefault } from 'react-notify-toast'

const Notification = {
  error: (message, time = 10000, notify = notifyDefault) => {
    if (message.graphQLErrors) {
      notify.show(message.graphQLErrors[0].message, 'error', time)
    } else {
      notify.show(message.replace('GraphQL error: ', ''), 'error', time)
    }
  },
  success: (message, time = 3000, notify = notifyDefault) => {
    notify.show(message, 'success', time)
  },
  warning: (message, time = 6000, notify = notifyDefault) => {
    notify.show(message, 'warning', time)
  },
  custom: (message, color, time = 3000, notify = notifyDefault) => {
    notify.show(message, 'custom', time, color)
  },
  createQueue: () => {
    return {
      show: notifyDefault.createShowQueue()
    }
  }
}

export default Notification
