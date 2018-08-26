import React from 'react'
import {Grid, Table, Header, Button, Icon, Image} from 'semantic-ui-react'
import Freshness from '../Freshness'
import './styles.scss'

class MiddleTable extends React.Component {
  render () {
    return (
      <Table structured basic celled className='dashboard'>
        <Table.Header className='title'>
          <Table.Row>
            <Table.HeaderCell>
              <Icon name='question'></Icon>
              <span>Your Trends</span>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Icon name='bullhorn' size='large'></Icon>
              <span> Best Performing Campaign </span>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Icon name='list'></Icon>
              <span className='title'> Best Performing Post </span>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Header>
                <Header.Content>
                  <span className='trends_subtitle'> #ThatAwfulTVShow </span>
                  <Header.Subheader>
                    <span className='trends_comment'> 1,666 Tweets </span>
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Header>
                <Header.Content>
                  <span className='trends_subtitle'> Donald Trump </span>
                  <Header.Subheader>
                    <span className='trends_comment'> 1,666 Tweets </span>
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Header>
                <Header.Content>
                  <span className='trends_subtitle'> #pizzahour </span>
                  <Header.Subheader>
                    <span className='trends_comment'> 1,666 Tweets </span>
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Header>
                <Header.Content>
                  <span className='trends_subtitle'> #holidaysarecoming </span>
                  <Header.Subheader>
                    <span className='trends_comment'> 1,666 Tweets </span>
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Table.Cell>

            <Table.Cell>
              <Grid>
                <Grid.Row className='middle_table'>
                  <span className='campaign_color'></span>
                  <span className='campaign_subtitle'> Promotions </span>
                  <span className='comment'> Total Likes </span>
                  <span className='campaign_favorite'>
                    <Icon name='heart' color='red' size='tiny'></Icon>
                     3.5k
                  </span>
                  <span className='freshness'> Freshness </span>
                  <Freshness percentage={95} />
                </Grid.Row>
                <Grid.Row>
                  <span className='title second'> 
                    <Icon name='bullhorn' size='large'></Icon>
                    Under-Performing Campaign
                  </span>
                </Grid.Row>
                <Grid.Row className='middle_table'>
                  <span className='campaign_color second_color'></span>
                  <span className='campaign_subtitle'> Offer </span>
                  <span className='comment'> Total Likes </span>
                  <span className='campaign_favorite'>
                    <Icon name='heart' color='red' size='tiny'></Icon>
                     992
                  </span>  
                  <span className='freshness'> Freshness </span>
                  <Freshness percentage={32} />
                </Grid.Row>
              </Grid>
            </Table.Cell>

            <Table.Cell>
              <Table.Row>
                <Table.Cell>
                  <span className='comment'>Who do you call on to help get through our epic pizza challenge?</span>
                  <span className='link'> #squadgoals </span>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Image src='../static/images/best_performing.png' size='medium' />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <span className='comment'>
                    <Icon name='heart' color='red' size='large'></Icon>
                     1.7k
                  </span>
                  <span className='comment'>
                    <Icon name='retweet' color='green' size='large'></Icon>
                     108
                  </span>
                  <span className='comment message'>
                    <Icon name='comment' color='grey' size='small'></Icon>
                     40
                  </span>
                  <Button className='promotions_btn'>
                  <span className='content'> promotions</span>
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
     )
  }
}

export default MiddleTable
