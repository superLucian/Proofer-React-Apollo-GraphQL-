export default () => {}

export function dump (obj) {
  let out = ''
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      out += `${key}: ${obj[key]}\n`
    }
  }

  return out
}

export function mergeObjects (...args) {
  const dst = {}
  let src
  let p
  const aargs = [].splice.call(args, 0)

  while (aargs.length > 0) {
    src = aargs.splice(0, 1)[0]
    if (toString.call(src) === '[object Object]') {
      for (p in src) {
        if (Object.prototype.hasOwnProperty.call(src, p)) {
          if (toString.call(src[p]) === '[object Object]') {
            dst[p] = mergeObjects(dst[p] || {}, src[p])
          } else {
            dst[p] = src[p]
          }
        }
      }
    }
  }

  return dst
}

export function isEmpty (obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function getCorrectHours (time) {
  let hours = Math.floor(time / 60)
  let minutes = (time % 60)
  return hours.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}) + ':' + minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
}

export function es6DateToDateTime (date) {
  let day = date.getDate()
  const year = date.getFullYear()
  let month = date.getMonth() + 1 // ES6 getMonth returns 0-11, we need it in the format 01-12
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return `${year}-${month}-${day} ${getCorrectHours(date)}:00`
}

export function es6TimeToTime (time) {
  let hour = time.getHours()
  let minute = time.getMinutes()
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  return `${parseInt(hour, 10) * 60} ${parseInt(minute, 10)}`
}

export function convertDateToUTC (date) {
  const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000)

  let day = utcDate.getDate()
  const year = utcDate.getFullYear()
  let month = utcDate.getMonth() + 1 // ES6 getMonth returns 0-11, we need it in the format 01-12
  let hour = utcDate.getHours()
  let minute = utcDate.getMinutes()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }

  return `${day}-${month}-${year} ${hour}:${minute}`
}

export function hexToRGB (hex, opacity) {
  hex = parseInt(hex.slice(1), 16)
  let r = hex >> 16
  let g = hex >> 8 & 0xFF
  let b = hex & 0xFF
  return `rgba(${r},${g},${b},${opacity})`
}

// Convert calendar day/time from server to incorporate user's timezone
export function calendarTimeAndDayWithOffset (calendarSlot, offset) {
  let time = calendarSlot.time - offset
  let day = calendarSlot.day

  if (time > 1440) {
    time = time - 1440
    day = day + 1
  }
  if (time < 0) {
    time = time + 1440
    day = day - 1
  }

  day = day === 7 ? 0 : day
  day = day === -1 ? 6 : day
  return {day, time}
}
