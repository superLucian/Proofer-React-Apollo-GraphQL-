import React from 'react'
import { Segment } from 'semantic-ui-react'

import TopPanel from '../TopPanel'
import { Dropdown } from 'semantic-ui-react'

import PostStatus from './PostStatus'
import MiddleTable from './MiddleTable'
import ToDo from './ToDo'

class DashboardView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      platformType: ''
    }
  }

  platformHandler = (platformType) => this.setState({platformType});

  render() {
    const { platformType } = this.state

    return (<div>
      <TopPanel
        leftBlock={
          <Dropdown
            ref='platform_dropdown'
            search
            selection
            placeholder="All Platforms:"
            options={[]}
            value={platformType}
            onChange={(event, {value}) => this.platformHandler(value)}
          />
        }
        rightBlock=''
        middleBlock=''
      />
      <div className="dashboard-page">
        <Segment><PostStatus/></Segment>
        <MiddleTable/>
        <ToDo/>
      </div>
    </div>)
  }
}

export default DashboardView