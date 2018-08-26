import React from 'react'
import { Grid, Button, Icon} from 'semantic-ui-react'
// import Line from ''

import Status from './Status'
import './styles.scss'

class PostStatus extends React.Component {
  render () {

    return (
      <Grid className='post-status'>
        <Grid.Row columns={3}>
          <Grid.Column width={2}>
            <span className='letter title'>Post Status</span>
          </Grid.Column>
          <Grid.Column width={11}>
            <span className='letter date'>15th - 21st</span>
            <span className='letter title'> July</span>
          </Grid.Column>
          <Grid.Column width={2}>
            <Button icon className='postview-button'>
              <span className="content"><Icon name='list'/> Post View</span>
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Status/>
        </Grid.Row>
        <Grid.Row columns={7} textAlign='center'>
          <Grid.Column> M </Grid.Column>
          <Grid.Column> T </Grid.Column>
          <Grid.Column> W </Grid.Column>
          <Grid.Column> F </Grid.Column>
          <Grid.Column> T </Grid.Column>
          <Grid.Column> S </Grid.Column>
          <Grid.Column> S </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={7} textAlign='center'>
          <Grid.Column> 15 </Grid.Column>
          <Grid.Column> 16 </Grid.Column>
          <Grid.Column> 17 </Grid.Column>
          <Grid.Column> 18 </Grid.Column>
          <Grid.Column> 19 </Grid.Column>
          <Grid.Column> 20 </Grid.Column>
          <Grid.Column> 21 </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default PostStatus
