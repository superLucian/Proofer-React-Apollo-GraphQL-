import React, {Component} from 'react'
import { graphql, compose } from 'react-apollo'
import { updatePaymentPlanMutation } from './graphql/queries'
import { Button, Confirm, Icon } from 'semantic-ui-react'
import Notification from '../Notification'
import AgencyLink from './AgencyLink'
import FreelancerLink from './FreelancerLink'
import BrandLink from './BrandLink'
import {meHeader} from '../Header/graphql/queries'

import './styles.scss'

class Plans extends Component {
  constructor (props) {
    super(props)

    this.state = {
      load: false,
      open: false,
      requestPlan: ''
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      load: false,
      open: false,
      requestPlan: ''
    });
  }

  savePlan = (plan) => {
      this.setState({ requestPlan: plan , open: true});
  }

  handlePlanCancel = () =>  this.setState({open: false});

  handlePlanConfirm = () => {
    const {updatePaymentPlan, currentPlan} = this.props
    const {requestPlan} = this.state

    this.setState({open: false, load:true});
    let plan = requestPlan;
    updatePaymentPlan({ plan })
      .then(() => {
        this.setState({ load:false })
        Notification.success('Plan changed Successfully');
      })
      .catch((e) => {
        this.setState({ load:false })
        Notification.error('Update plan Error');
      });
  }


  render () {
    const {currentPlan} = this.props;
    const {open, load} = this.state;

    return [
    <div className="ui container fluid">
      <div className="ui header center aligned">Get Premium</div>
      <div className="ui cards four">
        <div className="ui card">
          <div className="content">
            {currentPlan === "FREE" && <a className="ui label left corner" style={{'borderColor': '#767676', 'color': '#fff'}}>
              <i className="icon check"></i>
            </a>}
            <div className="header center aligned">Individual</div>
            {/*<div className="meta center aligned">free and unlimited</div>*/}
            <div className="ui divider horizontal">FREE</div>
            <div className="ui list">
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <Icon name='twitter'/>
                  <Icon name='facebook'/>
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <Icon name='instagram'/> (planning)
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>1</b> social profile
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>0</b> team members
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>Unlimited</b> scheduled content
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>50</b> reusable posts
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>50</b> stored media
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  Proofing
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  Editorial Calendar
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>100</b> Unfollows
                </div>
              </div>
            </div>
          </div>
          <div className="extra content">
            {currentPlan === "FREE" ?
              <Button disabled loading={load} className="grey" fluid>You are on this plan</Button>
              :
              <Button loading={load} className="grey" fluid onClick={() => this.savePlan("FREE")}>Downgrade to Individual</Button>
            }
          </div>
        </div>
        <div className="ui card raised">
          <div className="content">
            {currentPlan === "FREELANCER" && <a className="ui label left corner" style={{'borderColor': '#5490f3', 'color': '#fff'}}>
              <i className="icon check"></i>
            </a>}
            <div className="header center aligned">Freelancer</div>
            {/*<div className="meta center aligned">Agency</div>*/}
            <div className="ui divider horizontal">$12 / month</div>
            <div className="ui list">
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <Icon name='twitter'/>
                  <Icon name='facebook'/>
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <Icon name='instagram'/> (planning)
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>5</b> social profiles
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>0</b> team members
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>Unlimited</b> scheduled content
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>200</b> reusable posts
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>300</b> stored media
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  Proofing
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  Editorial Calendar
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>300</b> Unfollows
                </div>
              </div>
            </div>
          </div>
          <div className="extra content">
            {currentPlan === "FREE" ?
              <FreelancerLink loading={load} />
              :
              <Button
                disabled={currentPlan === "FREELANCER"}
                className="blue" loading={load}
                fluid
                onClick={() => this.savePlan("FREELANCER")}
                style={{'backgroundColor': '#5490f3'}}
              >
                {currentPlan === "FREELANCER" ?
                  'You are on this plan'
                  :
                  'Upgrade to Freelancer'
                }
              </Button>
            }
          </div>
        </div>
        <div className="ui card">
          <div className="content">
            {currentPlan === "BRAND" && <a className="ui label left corner" style={{'borderColor': '#fb9f30', 'color': '#fff'}}>
              <i className="icon check"></i>
            </a>}
            <div className="header center aligned">Brand</div>
              {/*<div className="meta center aligned">Agency</div>*/}
            <div className="ui divider horizontal">$30 / month</div>
            <div className="ui list">
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <Icon name='twitter'/>
                  <Icon name='facebook'/>
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <Icon name='instagram'/> (planning)
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>5</b> social profiles
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>5</b> team members
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>Unlimited</b> scheduled content
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>600</b> reusable posts
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>800</b> stored media
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  Proofing
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  Editorial Calendar
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>1000</b> Unfollows
                </div>
              </div>
            </div>
          </div>
          <div className="extra content">
            {currentPlan === "FREE" ?
              <BrandLink loading={load} />
              :
              <Button
                disabled={currentPlan === "BRAND"}
                className="grey" loading={load}
                fluid
                onClick={() => this.savePlan("BRAND")}
                style={{'backgroundColor': '#fb9f30'}}
              >
                {currentPlan === "BRAND" ?
                  'You are on this Plan'
                  :
                  'Upgrade to Brand'
                }
              </Button>
            }
          </div>
        </div>
        <div className="ui card">
          <div className="content">
            {currentPlan === "AGENCY" && <a className="ui label left corner" style={{'borderColor': '#fa456d', 'color': '#fff'}}>
              <i className="icon check"></i>
            </a>}
            <div className="header center aligned">Agency</div>
            {/*<div className="meta center aligned">Agency</div>*/}
            <div className="ui divider horizontal">$100 / month</div>
            <div className="ui list">
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <Icon name='twitter'/>
                  <Icon name='facebook'/>
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <Icon name='instagram'/> (planning)
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>25</b> social profile
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>15</b> team members
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>Unlimited</b> scheduled content
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>5000</b> reusable posts
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>5000</b> stored media
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  Proofing
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  Editorial Calendar
                </div>
              </div>
              <div className="item">
                <i className="icon checkmark"></i>
                <div className="content">
                  <b>2000</b> Unfollows
                </div>
              </div>
            </div>
          </div>
          <div className="extra content">
            {currentPlan === "FREE" ?
              <AgencyLink loading={load} />
              :
              <Button
                disabled={currentPlan === "AGENCY"}
                className="grey"
                loading={load}
                fluid
                onClick={() => this.savePlan("AGENCY")}
                style={{'backgroundColor': '#fa456d'}}
              >
                {currentPlan === "AGENCY" ?
                  'You are on this plan'
                  :
                  'Upgrade to Agency'
                }
              </Button>
            }
          </div>
        </div>
      </div>
    </div>,
    <Confirm
      open={this.state.open}
      onCancel={this.handlePlanCancel}
      onConfirm={this.handlePlanConfirm}
    />
    ];
  }
}

export default compose(
  graphql(updatePaymentPlanMutation,{
    props({ owProps,mutate }) {
      return {
        updatePaymentPlan({ plan }) {
          return mutate({
            variables:{
              input:{
                plan
              }
            },
            refetchQueries: [{
              query: meHeader
            }]
          })
        }
      }
    }
  })
)(Plans)
