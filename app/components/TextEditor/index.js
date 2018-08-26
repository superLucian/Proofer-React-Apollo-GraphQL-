import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'

import createHashtagPlugin from 'draft-js-hashtag-plugin'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import createCounterPlugin from 'draft-js-counter-plugin'
import twitter from 'twitter-text'

import './style.scss'
import './draft-emoji.scss'
import './draft-counter.scss'

export default class TextEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editorState: createEditorStateWithText(this.props.defaultValue)
    }
    this._emojiPlugin = createEmojiPlugin({ useNativeArt: true })
    this._hashtagPlugin = createHashtagPlugin()
    this._counterPlugin = createCounterPlugin()
  }

  componentDidMount () {
    if (this.props.editEnabled) {
      this.editor.focus()
    }
  }

  focus = (e) => {
    console.log(this.editor)
    if (!this.editor.isFocused) {
      this.editor.focus()
    }
  }

  onChange = (editorState) => {
    const newText = editorState.getCurrentContent().getPlainText()
    this.setState({ editorState })
    this.props.onChange(newText)
  }

  updateEditorState = (text) => {
    this.setState({
      editorState: createEditorStateWithText(text)
    })
    // this.props.onChange(text)
  }

  customCountFunction(str) {
    return str ? twitter.getTweetLength(str) : 0
  }

  getLimit = () => {
    const { socialNetwork } = this.props
    switch (socialNetwork) {
      case 'TWITTER':
        return 280
      case 'INSTAGRAM':
        return 2200
      case 'FACEBOOK':
        return
    }
  }

  render () {
    const { EmojiSuggestions, EmojiSelect } = this._emojiPlugin
    const { CustomCounter } = this._counterPlugin

    const plugins = [
      this._hashtagPlugin,
      this._emojiPlugin,
      this._counterPlugin
    ]

    return (<div key={this.props.index} id={this.props.id} className='content-editor'>
      <div className='content-editor-wrapper'>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          placeholder='Write something...'
          ref={(element) => { this.editor = element }}
        />
        <EmojiSuggestions
          ref={(element) => { this.s = element }}
        />
        {this.props.attachMediaIcon && <div className='attach-media'><Icon name='image' onClick={this.props.onShowAttachAssets} /></div>}
      </div>
      <div className='emoji-picker'>
        <CustomCounter countFunction={this.customCountFunction} limit={this.getLimit()}/>
        <EmojiSelect />
      </div>
    </div>)
  }
}
