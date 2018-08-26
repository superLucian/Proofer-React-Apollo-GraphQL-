const routes = require('next-routes')()

//
// Because of awesome Next.js, You don't need to add routes for all pages.
// Every file on Pages folder basically has route as they named.
// (index.js => /, about.js => /about, ...etc.)
//
// If you want to change url (for SEO or put different path), please add your route below.
// for more info, please look at https://github.com/Sly777/ran/blob/master/docs/Routing.md
//
//
// Please add your route between of comments
//
// ------------ ROUTES ---------------

// Main routes
routes.add('index', '/app', '/app')

// Auth routes
routes.add('login', '/app/login', '/app/login')
routes.add('signup', '/app/signup/:message', '/app/signup')
routes.add('forgot', '/app/forgot', '/app/forgot')
routes.add('reset', '/app/reset/:resetToken', '/app/reset')

// Content routes
routes.add('onboarding', '/app/onboarding', '/app/onboarding')
routes.add('dashboard', '/app/dashboard', '/app/dashboard')
routes.add('posts', '/app/posts', '/app/posts')
routes.add('calendar', '/app/calendar', '/app/calendar')
routes.add('campaign', '/app/campaign', '/app/campaign')
routes.add('assetbank', '/app/assetbank', '/app/assetbank')
routes.add('manageusers', '/app/manageusers', '/app/manageusers')
routes.add('unfollow', '/app/unfollow', '/app/unfollow')

// ------------ ROUTES ---------------

module.exports = routes
