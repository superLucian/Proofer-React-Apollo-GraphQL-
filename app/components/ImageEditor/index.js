import React from 'react'
import './styles.scss'


export default class ImageEditor extends React.Component {
  state = {
    image: null,
    PhotoEditorUI: null
  }

  componentDidMount() {  
    const PhotoEditorUI = require('photoeditorsdk/desktop-ui');

    this.setState({ PhotoEditorUI });
    window.React = React;

    const image = new Image();
    image.crossOrigin = ''

    image.onload = () => {
      this.setState({ image: image })
    }
    image.src =  this.props.image
  }

  render () {
    if(!this.state.PhotoEditorUI)
      return <div></div>;

    const { ReactComponent } = this.state.PhotoEditorUI;
    return (this.state.image && <ReactComponent
      license='{"owner":"Pavle Stanic","version":"2.1","enterprise_license":false,"available_actions":["magic","filter","transform","sticker","text","adjustments","brush","focus","frames","camera"],"features":["adjustment","filter","focus","overlay","transform","text","sticker","frame","brush","camera","textdesign","library","export"],"platform":"HTML5","app_identifiers":[],"api_token":"Cshfz6jmDxeqAa_uVNVGQA","domains":["https://api.photoeditorsdk.com"],"issued_at":1521797266,"expires_at":1524355200,"signature":"Ty43Nw4HmK+4twqPH10nnyTNTmKV3kDs4s2rHhtnrWZ4Qqt53GcKPbqMa+FDzIqOugoVHdptwqtlqJY8rTlHO/vPqD04xfkQQ6v3OQoY7XG31YMG7Cire5u7LBKN50rlwNIs73MC6nLwFeSbAasIUj1J8zffhVTmJfie8ZFykMzffXpikDed+bUVWnINa3JZNX1eAWyGE8tU7HM4SdcwgRbtHa8ujELcYspynha2O0v0Ib1OJrWjOv/0KIncYU+ReNWa4lOIxXyC9AshVABktqmkNpZUNPGl64Wx52DiXndk751xcEN1oO3fSrBALPz3ksyZXn8Pq2pu+eMQ+MVvrNDOjZR/T5nFnqX/65ZAI3CDWcdc3ED5sz/36o+kSWvlcnZjmdlT/ZgFtm/Zxw//vK9PcxQvNlyZ8x80LQxYI6GE6wAUdXAhTNv0EH4gJNvzSiwBBzyHQ2Qr0n8KTVeAZtEoWiTqxJexJa7Jdf18kAIDUlzsYunWxwgjt/uSQBL3k/kja5iee/bZoYsK3SEd1SxE00GFSz1N0yvLrIzLXURDm040zcNw+eI1B/NmXrsyUZEsmwx89S2+TiZoaPpqty8PRskxHoenDlVRfMmElptbOr2k73BRUi5JX20hOIYLql+DYOOYywC/XT+EOTPBazzlZjhOA94GJmyOH3umQDY="}'
      
      assets={{
        baseUrl: '/static/photoeditorsdk/assets'
      }}
      editor={{image: this.state.image}}
      style={{
        width: 1024,
        height: 576
      }}/>)
  }
}
