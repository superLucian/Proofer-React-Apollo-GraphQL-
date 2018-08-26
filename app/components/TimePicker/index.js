import React from 'react'

import './styles.scss'

class TimePicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timeValue: ''
    }
  }

  setTime = (value) => {
    this.setState({
      timeValue: value
    })
  }

  renderSelect = (count) => {
    const items = Array(count).keys().map(item =>
      <li
        onClick={this.setTime}
      >
        {item < 10 ? '0' + item : item}
      </li>
    )
    return (<div className='pfr-time-select'>
      <ul>
        {items}
      </ul>
    </div>)
  }

  render () {
    const {timeValue} = this.state
    return (<div class='pfr-time-picker-panel'>
      <div class='pfr-time-picker-panel-inner'>
        <div class='pfr-time-picker-panel-input-wrap'>
          <input class='pfr-time-picker-panel-input' value={timeValue} />
          <a class='pfr-time-picker-panel-clear-btn' role='button' title='clear'>x</a>
        </div>
        <div class='pfr-time-picker-panel-combobox'>
          {this.renderSelect(23)}
          {this.renderSelect(59)}
        </div>
      </div>
    </div>)
  }
}

export default TimePicker
