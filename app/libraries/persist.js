import Cookies from 'js-cookie'
import cookies from 'next-cookies'

class persist {
  static get ACCESS_TOKEN_KEY () {
    return 'prAccessToken'
  }
  static willGetAccessToken (context) {
    if (context && context.req) {
      const { prAccessToken } = cookies(context)
      return prAccessToken
    }
    return Cookies.get(persist.ACCESS_TOKEN_KEY)
  }

  static willSetAccessToken (value) {
    return Cookies.set(persist.ACCESS_TOKEN_KEY, value, { expires: 365 })
  }

  static willRemoveAccessToken () {
    return Cookies.remove(persist.ACCESS_TOKEN_KEY)
  }

  static get REFRESH_TOKEN_KEY () {
    return 'prRefreshToken'
  }
  static willGetRefreshToken (context) {
    if (context && context.req) {
      const { prRefreshToken } = cookies(context)
      return prRefreshToken
    }
    return Cookies.get(persist.REFRESH_TOKEN_KEY)
  }

  static willSetRefreshToken (value) {
    return Cookies.set(persist.REFRESH_TOKEN_KEY, value, { expires: 365 })
  }

  static willRemoveRefreshToken () {
    return Cookies.remove(persist.REFRESH_TOKEN_KEY)
  }

  static get TEAM_ID_KEY () {
    return 'prTeamId'
  }
  static willGetTeamId (context) {
    if (context && context.req) {
      const { prTeamId } = cookies(context)
      return prTeamId
    }
    return Cookies.get(persist.TEAM_ID_KEY)
  }

  static willSetTeamId (value) {
    return Cookies.set(persist.TEAM_ID_KEY, value, { expires: 365 })
  }

  static willRemoveTeamId () {
    return Cookies.remove(persist.TEAM_ID_KEY)
  }

  static get EMAIL_KEY () {
    return 'prEmail'
  }
  static willGetEmail (context) {
    if (context && context.req) {
      const { prEmail } = cookies(context)
      return prEmail
    }
    return Cookies.get(persist.EMAIL_KEY)
  }

  static willSetEmail (value) {
    return Cookies.set(persist.EMAIL_KEY, value, { expires: 365 })
  }

  static async willRemoveEmail () {
    return Cookies.remove(persist.EMAIL_KEY)
  }

  static get CURRENT_SOCIAL_PROFILE () {
    return 'prCurrSocialProf'
  }
  static willGetCurrentSocialProfile (context) {
    if (context && context.req) {
      const { prCurrSocialProf } = cookies(context)
      return prCurrSocialProf
    }
    return Cookies.get(persist.CURRENT_SOCIAL_PROFILE)
  }

  static willSetCurrentSocialProfile (value) {
    return Cookies.set(persist.CURRENT_SOCIAL_PROFILE, value, { expires: 365 })
  }

  static willRemoveCurrentSocialProfile () {
    return Cookies.remove(persist.CURRENT_SOCIAL_PROFILE)
  }

  static get CURRENT_MULTIPLE_SOCIAL_PROFILES () {
    return 'prCurrMultiSocialProfs'
  }
  static willGetCurrentMultiSocialProfiles (context) {
    if (context && context.req) {
      const { prCurrMultiSocialProfs } = cookies(context)
      return !!prCurrMultiSocialProfs && JSON.parse(prCurrMultiSocialProfs)
    }
    return JSON.parse(Cookies.get(persist.CURRENT_MULTIPLE_SOCIAL_PROFILES))
  }

  static willSetCurrentMultiSocialProfiles (value) {
    return Cookies.set(persist.CURRENT_MULTIPLE_SOCIAL_PROFILES, value, { expires: 365 })
  }

  static willRemoveCurrentMultiSocialProfiles () {
    return Cookies.remove(persist.CURRENT_MULTIPLE_SOCIAL_PROFILES)
  }
}

export default persist
