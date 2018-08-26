import React, { Component } from 'react'
import { Grid, Icon, Image, Modal, Button} from 'semantic-ui-react'
import ImageEditor from '../ImageEditor'

import './styles.scss'

export default class ImageGrid extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isOpenFirstModal: false
      // isOpenImageEditorSecond: false
    }
  }

  // closeImageEditor = () => {
  //   this.setState({
  //     isOpenImageEditorFirst: false
  //   })
  // }

  renderSecondColumn(assets) {
    return assets.map(e => {
      return (
        <Grid.Row style={{'height': 300 / assets.length}} key={e.id}>
          <Image src={e.url}/>
          {/*<span className="image-action" style={{marginRight: "2em"}} onClick={() => this.setState({ isOpenImageEditorSecond: true })}>
                      <Icon name='edit' />
          </span>*/}
          {this.props.onDelete !== undefined &&
            <span className='image-action remove' onClick={() => this.props.onDelete(e.id)}><Icon name='close'/></span>
          }
        </Grid.Row>
      )
    })
  }

  render () {
    const assets = [...this.props.assets]
    return (
      <div>
        <div className={'image-grid-wrapper ' + 'count' + assets.length}>
          <Grid columns={assets.length === 1 ? 1 : 2}>
            <Grid.Column>
              <Image src={assets[0].url} />
              <span className="image-action" style={{marginRight: "2em"}} onClick={() => this.setState({ isOpenFirstModal: true })}>
                <Icon name='edit' />
              </span>
              {this.props.onDelete !== undefined &&
                <span className='image-action' onClick={() => this.props.onDelete(assets[0].id)}><Icon name='close'/></span>
              }
            </Grid.Column>
            {assets.length > 1 &&
              <Grid.Column>
                {this.renderSecondColumn(assets.splice(1))}
              </Grid.Column>
            }
          </Grid>
        </div>
        <div>
          { this.state.isOpenFirstModal && 
          <Modal open={true} closeOnDimmerClick={false}>
            <Button onClick={()=> this.setState({isOpenFirstModal: false})}> Close </Button>
            <ImageEditor image={assets[0].url}/>
          </Modal> }
        </div>
      </div>
    )
  }
}

