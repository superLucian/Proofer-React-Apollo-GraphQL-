import React from 'react'
import { Grid } from 'semantic-ui-react'

import CalendarTable from './CalendarTable'
import Campaigns from '../Campaigns'

class CalendarView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      slots: props.slots,
      catId: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    const {slots} = nextProps
    this.setState({ slots })
  }

  handleAddEvent = (evt) => {
    const {slots} = this.state
    const defaultRow = {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {}
    }
    const generatedTime = this.generateTimeValue(0, 287)
    slots[generatedTime] = defaultRow
    this.setState({ slots })
  }

  generateTimeValue = (bottom, top) => {
    return (Math.floor(Math.random() * (1 + top - bottom)) + bottom) * 5
  }

  handleRowDel = (time) => {
    let {slots} = this.state
    delete slots[time]
    this.setState({
      slots
    })
  }

  handleCalendarTable = (slotTime, category, slotDay) => {
    const { slots } = this.state
    const slotsObject = Object.assign({}, slots, {
      [slotTime]: Object.assign({}, slots[slotTime], {
        [slotDay]: Object.assign({}, slots[slotTime][slotDay], {
          category
        })
      })
    })
    this.setState({
      slots: slotsObject
    })
  }

  onTogglePanel = (catId) => {
    this.setState({
      catId: catId !== this.state.catId ? catId : '',
      categoryItemEnabled: false,
      rightPanelOpen: catId !== this.state.catId
    })
  }

  onSlotsUpdate = (slots) => {
    this.setState({
      slots
    })
  }

  render () {
    const {socialId, categories} = this.props
    const {slots, catId, rightPanelOpen} = this.state

    return (<Grid className='calendar-page' centered>
      <Grid.Column tablet={rightPanelOpen ? 10 : 16} computer={rightPanelOpen ? 10 : 16} largeScreen={rightPanelOpen ? 10 : 14} widescreen={rightPanelOpen ? 10 : 10} className='margin-t-20'>
        <CalendarTable
          onCalendarTableUpdate={this.handleCalendarTable}
          onRowAdd={this.handleAddEvent}
          onRowDel={this.handleRowDel}
          onCellClicked={(catId) => this.onTogglePanel(catId)}
          onSlotsUpdate={this.onSlotsUpdate}
          socialId={socialId}
          slots={slots}
          categories={categories}
          catId={catId}
        />
      </Grid.Column>
      {rightPanelOpen && <Campaigns
        open={rightPanelOpen}
        width={6}
        socialId={socialId}
        categoryId={catId}
        onTogglePanel={this.onTogglePanel}
      />
      }
    </Grid>)
  }
}

export default CalendarView
