import React from 'react'
import CircularProgressbar from 'react-circular-progressbar'

import './styles.scss'

class Freshness extends React.Component {
  onChangeFilter = (e, { value }) => {
    this.setState({ value })
  }

  classForPercentage = (percent) => {
    if (percent < 80) return 'green'
    if (percent < 50) return 'red'
    return 'green'
  }

  textForPercentage = (pct) => `${pct}`

  render () {
    const {percentage} = this.props
    return [<CircularProgressbar
      className='pr-progress'
      percentage={percentage}
      classForPercentage={this.classForPercentage}
      textForPercentage={this.textForPercentage}
      key='freshness'
    />
    /* ,
    <svg height="0">
    <defs>
        <radialGradient id="green-grad" cx="50%" cy="50%" r="95%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#e6ffe6" />
          <stop offset="90%" stop-color="#00c400" />
          <stop offset="100%" stop-color="#001a00" />
        </radialGradient>

        <radialGradient id="grey-grad" cx="50%" cy="50%" r="95%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#fff" />
          <stop offset="90%" stop-color="#ddd" />
          <stop offset="100%" stop-color="#ccc" />
        </radialGradient>

        <radialGradient id="red-grad" cx="50%" cy="50%" r="95%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#fdd" />
          <stop offset="90%" stop-color="#f00" />
          <stop offset="100%" stop-color="#900" />>
        </radialGradient>
      </defs>
    </svg> */
    ]
  }
}

export default Freshness
