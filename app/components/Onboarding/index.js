import React, {Component} from 'react'
import { graphql, compose } from 'react-apollo'
import Link from 'next/link'
import Loader from '../Loader'
import TopPanel from '../TopPanel'
import Freshness from '../Freshness'
import { Header, Grid, Card, Icon, Segment, Dimmer, Button, Label, List } from 'semantic-ui-react'
import Logo from '../../static/images/proofer-logo-colored.svg'
import CreateCampaign from '../Campaign/CreateCampaign'

if (process.env.BROWSER) {
  require('./styles.scss')
}

class Onboard extends Component {
  render () {
    const toppanel = (<TopPanel leftBlock='' rightBlock=''
      middleBlock={<Header size='huge'>Getting Started</Header>}
   />)
    return [
      toppanel,
      <div key={1} className='page-wrapper onboaring-page'>
        <Grid centered>
          <Grid.Row columns={2}>
            <Grid.Column width='9'>
              <div className='onboarding-main'>
                <Grid verticalAlign='middle' centered>
                  <Grid.Row columns={3} className='steps'>
                    <Grid.Column textAlign='center' className='step'>
                      <div className='step-icon'>
                        <Icon name='announcement' size='huge' />
                        <Label circular icon={{name:'check', corner: true, fitted: true}} color='green' floating />
                      </div>
                      <Header >Campaign</Header>
                      <p>Lorem ipsum dolor <br /> sit amet</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center' className='step active-step'>
                      <div className='step-icon'>
                        <Icon name='pencil' size='huge' />
                      </div>
                      <Header >Post</Header>
                      <p>Complete Campaign <br />  to unlock Post</p>
                    </Grid.Column>
                    <Grid.Column textAlign='center' className='step'>
                      <Dimmer.Dimmable dimmed>
                        <Dimmer active inverted>
                          <Icon name='lock' size='big' />
                        </Dimmer>
                        <div className='step-icon'>
                          <Logo width='3em' className='sidebar-logo' viewBox='0 0 50 63' />
                        </div>
                      </Dimmer.Dimmable>
                      <Header >Proofer</Header>
                      <p>Complete Post to <br /> unlock Proofer</p>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Column>
                      <Card.Group itemsPerRow={2} centered>
                        <Card fluid>
                          <Card.Content>
                            <Label circular icon={{name:'check', corner: true, fitted: true}} color='green' floating />
                            <Card.Header>
                            Create
                            </Card.Header>
                            <Card.Description>
                              Create your first <br /> campaign
                            </Card.Description>
                            <CreateCampaign />
                          </Card.Content>
                        </Card>
                        <Card fluid>
                          <Card.Content>
                            <Card.Header>
                              Schedule
                            </Card.Header>
                            <Card.Description>
                              Schedule your <br /> campaign
                            </Card.Description>
                            <Link prefetch href='/app/dashboard'>
                              <span className='ui button success approve_all'>
                                Start!
                              </span>
                            </Link>
                          </Card.Content>
                        </Card>
                      </Card.Group>
                    </Grid.Column>

                  </Grid.Row>
                </Grid>
              </div>
            </Grid.Column>
            <Grid.Column width='5' className='steps-right'>
              <Segment.Group>
                <Segment secondary textAlign='center' className='steps-header'>
                  <div className='ui header'>Your Progress</div>
                  <Freshness percentage={24} />
                </Segment>
                <Segment padded>
                  <List>
                    <List.Item>
                      <List.Icon name='check' color='green' />
                      <List.Content>
                        <List.Header>Sign Up</List.Header>
                        <List.List>
                          <List.Item>
                            <List.Icon name='check' color='green' />
                            <List.Content>
                              <List.Description>Set Account Password</List.Description>
                            </List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name='check' color='green' />
                            <List.Content>
                              <List.Description>Registered Email Address</List.Description>
                            </List.Content>
                          </List.Item>
                        </List.List>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Icon name='minus' color='grey' />
                      <List.Content>
                        <List.Header>Campaign</List.Header>
                        <List.List>
                          <List.Item>
                            <List.Icon name='minus' color='grey' />
                            <List.Content>
                              <List.Description>Create your first campaign</List.Description>
                            </List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name='minus' color='grey' />
                            <List.Content>
                              <List.Description>Create a campaign schedule</List.Description>
                            </List.Content>
                          </List.Item>
                        </List.List>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Icon name='minus' color='grey' />
                      <List.Content>
                        <List.Header>Post</List.Header>
                        <List.List>
                          <List.Item>
                            <List.Icon name='minus' color='grey' />
                            <List.Content>
                              <List.Description>Compose post</List.Description>
                            </List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name='minus' color='grey' />
                            <List.Content>
                              <List.Description>Send for approval</List.Description>
                            </List.Content>
                          </List.Item>
                        </List.List>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Icon name='minus' color='grey' />
                      <List.Content>
                        <List.Header>Proof</List.Header>
                        <List.List>
                          <List.Item>
                            <List.Icon name='minus' color='grey' />
                            <List.Content>
                              <List.Description>Review post</List.Description>
                            </List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Icon name='minus' color='grey' />
                            <List.Content>
                              <List.Description>Approve post</List.Description>
                            </List.Content>
                          </List.Item>
                        </List.List>
                      </List.Content>
                    </List.Item>
                  </List>
                </Segment>
              </Segment.Group>
              <div className='onboarding-btns'>
                <Button className='add-social' fluid>Add social media account</Button>
                <Button className='success empty' fluid>Let me jump in!</Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    ]
  }
}

export default Onboard
