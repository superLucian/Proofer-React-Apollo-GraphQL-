import React, {Component} from 'react'
import { graphql } from 'react-apollo'
import Loader from '../Loader'
import ColorPickerCell from '../Calendar/ColorPickerCell'
import Notification from '../Notification'
import ColorNames from '../Calendar/consts/color.json'
import { Header, Grid, Divider, Segment, Input, Button, Label, Modal} from 'semantic-ui-react'
import {isEmpty, hexToRGB} from '../../libraries/helpers'
import persist from '../../libraries/persist'
import { createCategoryMutation } from '../Campaigns/graphql/categoryMutations'
import { getCategorybySocialIdQuery } from '../Campaigns/graphql/categoryQueries'


if (process.env.BROWSER) {
  require('./styles/create.scss')
}

const DEFAULTCOLOR = '#E2E2E2';

class CreateCampaign extends Component {
  constructor (props) {
    super(props);

    this.state = {
      colorCode: DEFAULTCOLOR,
      categoryName: '',
      submitForm: false
    }
  }

  onCategoryColorChange = (colorCode) => this.setState({colorCode})
  onCategoryNameChange = (e, {value}) => this.setState({categoryName: value})

  onSubmitHandle = () => {
    let {categoryName, colorCode} = this.state
    let error = false;

    const socialProfileId = persist.willGetCurrentSocialProfile()

    if(categoryName === '') {
      Notification.error('Please enter category name or select any suggested category')
    }
    if( colorCode === DEFAULTCOLOR ){
      Notification.error('Assign any color to this category')
    }

    if(error) return;

    if (categoryName !== '' && colorCode !== DEFAULTCOLOR) {
      this.setState({submitForm: true})
      this.props.createCategory({categoryName, socialProfileId, color: colorCode})
      .then((data) => {
        Notification.success('New Category is added.')
        this.setState({submitForm: false, colorCode: DEFAULTCOLOR, categoryName: ''})
      })
    }
  }

  render() {
    return (
      <Modal size={'tiny'} trigger={<Button className='success empty' size={'mini'}>Start</Button>} closeIcon className="create-campaign">
        <Header as="strong">Create Campaign</Header>
        <Modal.Content>
          <h5><small>Use one of our suggested templates</small></h5>
          <Grid columns='equal'  className="suggested-template">
            <Grid.Row stretched>
              <Grid.Column>
                <Segment className="campaigns-item">
                  <div className="campaigns-title">
                    <div className="campaigns-color" style={{backgroundColor: ColorNames.color[2].name}}></div>
                    Menu Items
                  </div>
                  <Button className='success empty' size={'mini'}
                  onClick={() => this.setState({colorCode: ColorNames.color[2].name, categoryName: "Menu Items"})} >Select</Button>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment className="campaigns-item">
                  <div className="campaigns-title">
                    <div className="campaigns-color" style={{backgroundColor: ColorNames.color[5].name}}></div>
                    Opening Times
                  </div>
                  <Button className='success empty' size={'mini'} onClick={() => this.setState({colorCode: ColorNames.color[5].name, categoryName: "Opening Times"})} >Select</Button>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Divider horizontal>Or</Divider>

            <h5><small>Create your own campaign</small></h5>
            <Grid.Row stretched className="create-campaign">
              <Grid.Column>
                <div className="campaigns-item">
                  <div className="campaigns-title">
                    <div className="campaigns-color" style={{backgroundColor: this.state.colorCode}}></div>
                  </div>
                  <Input fluid placeholder='Give your campaign a name!'
                  value={this.state.categoryName}
                  onChange={this.onCategoryNameChange} />
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column className='category-color-picker'>
                <span>Assign a colour : </span>
                  {
                    ColorNames.color.map((color, index) => (
                      <ColorPickerCell
                        key={index}
                        colorCode={color.name}
                        categoryColorChange={this.onCategoryColorChange}
                      />
                    ))
                  }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column textAlign={'right'}>
                <Button className='success empty' disabled={this.state.submitForm} size={'mini'} >Cancel</Button>
                <Button className='success approve_all' loading={this.state.submitForm} size={'mini'}
                onClick={() => this.onSubmitHandle()} >Schedule Campaign</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    )
  }
}

export default graphql(createCategoryMutation, {
  props ({ownProps, mutate}) {
    return {
      createCategory ({categoryName, socialProfileId, color}) {
        return mutate({
          variables: {
            input: {
              categoryName,
              socialProfileId,
              color
            }
          },
          refetchQueries: [{
            query: getCategorybySocialIdQuery,
            variables: {
              id: ownProps.socialId
            }
          }]
        })
      }
    }
  }
})(CreateCampaign)
