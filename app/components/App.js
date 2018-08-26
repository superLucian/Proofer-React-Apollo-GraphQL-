import './App.scss'

let offlineInstalled = false

const App = ({ children }) => {
  if (process.env.OFFLINE_SUPPORT && process.browser && !offlineInstalled) {
    const OfflinePlugin = require('offline-plugin/runtime') // eslint-disable-line global-require

    OfflinePlugin.install({
      onUpdateReady () {
        OfflinePlugin.applyUpdate()
      },
      onUpdated () {
        window.location.reload()
      }
    })
    offlineInstalled = true
  }

  return (<div>{children}</div>)
}

export default App
