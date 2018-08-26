import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Button, Icon } from "semantic-ui-react";
import WhiteLogo from '../../static/images/proofer-logo-white.svg'
import contentSchedulesGql from '../Posts/graphql/contentSchedules.gql'

import './styles.scss'
import { approveAllMutation } from "./approveAllMutation";
import { convertDateToUTC } from "../../libraries/helpers";

class ApproveAllButton extends Component {
  constructor (props) {
    super (props)
    this.state = {
      loading: false
    }
  }

  doApproveAll = () => {
    const { socialProfileId, startDate, endDate} = this.props

    this.setState({loading: true})

    let startPublishAt = new Date(startDate)
    let endPublishAt = new Date(endDate)
    startPublishAt.setHours(0)
    endPublishAt.setHours(23, 59)
    startPublishAt = convertDateToUTC(startPublishAt)
    endPublishAt = convertDateToUTC(endPublishAt)

    this.props.approveAll({socialProfileId, startPublishAt, endPublishAt}).then(() => {
      this.setState({loading: false})
    })
  }

  render () {
    return (
      <Button
        className='success approve_all'
        size={'mini'}
        icon
        labelPosition='right'
        onClick={() => {this.doApproveAll()}}
        loading={this.state.loading}
      >
        APPROVE ALL
        <Icon as={() => <WhiteLogo style={{width: '15px', background: 'transparent', right: '5px'}} className='icon'/>}/>
      </Button>
    )
  }
}

export default graphql(approveAllMutation, {
  props({ownProps, mutate}) {
    return {
      approveAll({socialProfileId, startPublishAt, endPublishAt}) {
        return mutate({
          variables: {
            input: {
              socialProfileId,
              startPublishAt,
              endPublishAt
            }
          },
          update: (proxy, { data: { approveAllContentSchedules } }) => {
            let data = proxy.readQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [ownProps.socialProfileId]} })
            const indexes = approveAllContentSchedules.contentSchedule.map((cs => cs.id))
            for (const [index, contentSchedule] of data.contentSchedules_find.edges.entries()) {
              const i = indexes.indexOf(contentSchedule.node.id)
              if (i !== -1) {
                contentSchedule.node = approveAllContentSchedules.contentSchedule[i]
                data.contentSchedules_find.edges[index] = contentSchedule
              }
            }
            proxy.writeQuery({ query: gql`${contentSchedulesGql}`, variables: {profileIds: [ownProps.socialProfileId]}, data })
          }
        })
      }
    }
  }
})(ApproveAllButton)