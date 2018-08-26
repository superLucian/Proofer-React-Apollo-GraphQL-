import React, { Component } from 'react'
import { Segment, Image, Button, Dimmer, Grid } from 'semantic-ui-react'

export default class PreviewImages extends Component {
    state = {
      active: {}
    }

    handleMouseEvent = (index, status) => {
      let active = this.state.active
      active[index] = status
      this.setState({ active })
    }

    removeUploads = (e, data) => this.props.removeUploads(e, data)

    render () {
      const { active } = this.state
      const {files} = this.props
      return (<Segment raised basic>
        <Image.Group size='tiny'>
          <Grid divided verticalAlign='middle'>
            <Grid.Row columns={6}>
              {files.map((file, index) => {
                const isPhoto = (/\.(jpe?g|png|gif|bmp)$/i.test(file.name)) ? true : false
                return (
                  <Dimmer.Dimmable as={Grid.Column}
                    dimmed={active}
                    key={index}
                    dimmed={(active[index] !== undefined) ? active[index] : false}
                    onMouseEnter={(e) => this.handleMouseEvent(index, true)}
                    onMouseLeave={(e) => this.handleMouseEvent(index, false)}>
                    <Dimmer active={(active[index] !== undefined) ? active[index] : false} inverted>
                      <Button color='red'
                        size='mini'
                        value={index}
                        onClick={this.removeUploads}
                      >
                        Delete
                      </Button>
                    </Dimmer>
                    {isPhoto ?
                      <Image src={file.preview} className='no-padding' />
                      :
                      <video src={file.preview} className='ui tiny rounded spaced image' />
                    }
                  </Dimmer.Dimmable>)
              })}
            </Grid.Row>
          </Grid>
        </Image.Group>
      </Segment>)
    }
}
