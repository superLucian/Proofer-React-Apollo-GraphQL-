import { RetryLink } from 'apollo-link-retry'

const max = (operation) => operation.getContext().max
const delay = 5000
const interval = (delay, count) => {
  if (count > 5) return 10000
  return delay
}

const link = new RetryLink({
  max,
  delay,
  interval
})

export default link
