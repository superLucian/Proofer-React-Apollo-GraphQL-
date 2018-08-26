import Document, { Head, Main, NextScript } from 'next/document'
import Helmet from 'react-helmet'
import 'cross-fetch/polyfill'
import AppIcons from '../components/AppIcons'

export default class MyDocument extends Document {
  static async getInitialProps (...args) {
    const documentProps = await super.getInitialProps(...args)
    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it
    return { ...documentProps, helmet: Helmet.rewind() }
  }

  // should render on <html>
  helmetHtmlAttrComponents () {
    return this.props.helmet.htmlAttributes.toComponent()
  }

  // should render on <head>
  helmetHeadComponents () {
    const keys = Object.keys(this.props.helmet)
      .filter(el => el !== 'htmlAttributes')
      .map(el => this.props.helmet[el].toComponent())
      .filter(
        el =>
          el.length > 0 ||
          !(Object.keys(el).length === 0 && el.constructor === Object)
      )

    return keys.length ? keys : []
  }

  render () {
    return (
      <html lang='en' {...this.helmetHtmlAttrComponents()}>
        <Head>
          <meta name='robots' content='index,follow' />
          <meta httpEquiv='expires' content='10800' />
          <meta name='generator' content='Proofer' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0' />
          {this.helmetHeadComponents()}
          {AppIcons()}
          <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css' />
          <link rel='stylesheet' href='/_next/static/style.css' />
        </Head>
        <body>
          <div className='root'>
            <Main />
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}
