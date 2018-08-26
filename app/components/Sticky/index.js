import React, {Component} from 'react'
import {Grid} from 'semantic-ui-react'

import './styles.scss'

class Sticky extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stuck: false
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const elem = document.getElementById('sticky')
    const elemGrid = document.getElementById('sticky-grid')
    const assetsElem = document.getElementById('rightbar-sticky')
    const distance = elem.offsetTop - window.pageYOffset
    const offset = window.pageYOffset
    const stickPoint = elem.offsetTop
    if ((distance <= 0) && !this.state.stuck) {
      elemGrid.classList.add('fixed')
      if (assetsElem) {
        assetsElem.style.position = 'fixed'
        assetsElem.style.top = '50px'
        assetsElem.style.width = 'calc(50% - calc(0.5 * 220px))' // 0.5 = 8 columns, 220px = left navbar + posts container padding
      }
      this.setState({
        stuck: true
      })
    } else if (this.state.stuck && (offset <= stickPoint)) {
      elemGrid.classList.remove('fixed')
      if (assetsElem) {
        assetsElem.style.position = 'relative'
        assetsElem.style.width = '100%'
      }
      this.setState({
        stuck: false
      })
    }
  }

  render () {
    const { className, children, rightPanelOpen } = this.props
    const tablet = this.state.stuck? 10 : 16;
    const computer = this.state.stuck? 8 : 16;
    const largeScreen = this.state.stuck? 8 : 16;
    return (
      <div id="sticky-grid">
        <Grid>
          <Grid.Row>
            {!rightPanelOpen && this.state.stuck &&
              // Offset column
              <Grid.Column tablet={3} computer={4} largeScreen={4} />
            }
            <Grid.Column
              tablet={tablet} computer={computer} largeScreen={largeScreen}
              id='sticky'
              className={`sticky-block ${className}`}
            >
              {children}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>)
  }
}

export default Sticky
