import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import {
  Card, Input, Dropdown,
  Segment, Grid,
  Image, Header,
  Icon, Button,
  Label, Confirm,
  Modal, Popup
} from 'semantic-ui-react'
import Notification from '../Notification'
import {hexToRGB} from '../../libraries/helpers'
import Loader from '../Loader'
import Freshness from '../Freshness';
import TopPanel from '../TopPanel';
import Stats from '../TopPanel/Stats';
import AddAssetsModal from './AddAssetsModal';
import {assetsByCategory ,deleteMedium} from './graphql/AssetQueries'


const options = [
  //{ key: 'oldest', text: 'Oldest', value: 'oldest' },
  //{ key: 'newest', text: 'Newest', value: 'newest' },
  { key: 'images', text: 'Image', value: 'images' },
  { key: 'videos', text: 'Video', value: 'videos' },
  { key: 'gifs', text: 'Gif', value: 'gifs' },
]

class CategoryView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      deleteMediaId: null,
      confirmBox: false,
      addAssetBox: false,
      searchText: '',
      sortType: ''
    }
  }

  calculateStats = (data) => {
    const {searchText} = this.state;

    let availableAssets = data.map( m =>  {

      let categories = m.node.categories.filter(c => c.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);

      if(categories.length === 0) {
        return '' ;
      }
      return m.node;
    });

    availableAssets = availableAssets.filter(n => n)

    let assets, urls, gifs, images, videos;
      urls = []
      assets = []
      gifs = []
      images = []
      videos = []

    availableAssets.map(item => {

      assets.indexOf(item.id) === -1 && assets.push(item.id)

      if (item.url.match(/\.(jpeg|jpg|png)$/) !== null) {
        images.indexOf(item.id) === -1 && images.push(item.id)
      } else if (item.url.match(/\.(gif)$/) !== null) {
        gifs.indexOf(item.id) === -1 && gifs.push(item.id)
      } else if (item.url.match(/\.(mp4|ogg|webm)$/) !== null) {
        videos.indexOf(item.id) === -1 && videos.push(item.id)
      }
    });

    return [
        {
          'value' : assets.length,
          'label' : 'assets'
        },
        {
          'value' : images.length,
          'label' : 'images'
        },
        {
          'value' : gifs.length,
          'label' : 'gifs'
        },
        {
          'value' : videos.length,
          'label' : 'videos'
        },
        {
          'value' : 80,
          'label' : 'Freshness',
          'indicator' : 5
        }
      ];
  }

  searchHandler = (searchText) => this.setState({searchText});
  sortHandler = (sortType) => this.setState({sortType});

  renderMedia = (m) => {

    let isImage = m.url.match(/\.(jpeg|jpg|gif|png)$/) !== null
    let categories = [];
    if(this.state.searchText) {
      categories = m.categories.filter(c => c.name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1);

      if(categories.length === 0) {
        return;
      }
    }


    return (
    <Grid.Column key={m.id}>
      <Card fluid className="media-card">
        <Card.Content extra className="right-actions" textAlign={'right'}>
          {/*<span className="edit-action"><Icon name='pencil' /></span>
          <span className="copy-action"><Icon name='copy' /></span>
          <span className="archive-action"><Icon name='archive' /></span>*/}
          <Popup
            trigger={<span className="remove-action"><Icon name='trash' onClick={() => this.onDeleteMedium(m.id)} /></span>}
            content='Delete'
            position='top center'
          />
        </Card.Content>

        {isImage ? <Image key={m.id} src={m.url} />
            : <video key={m.id} src={m.url} className='ui image' />}

        <Card.Content extra textAlign={'left'}>
          {m.categories.map(c => {
            return <Label key={c.id} style={{
              backgroundColor: (c.color)?hexToRGB(c.color, 0.25) : hexToRGB("#E84A47", 0.25),
              color: (c.color)? hexToRGB(c.color, 1) : hexToRGB("#E84A47", 1),
              fontWeight: 900
              }}>
              {c.name}
            </Label>
          })}

        </Card.Content>
      </Card>
    </Grid.Column>)
  }

  toggleAssetModel = (addAssetBox) => this.setState({ addAssetBox })

  onDeleteMedium = (deleteMediaId) => {
    var confirmBox = true
    this.setState({deleteMediaId, confirmBox})
  }

  handleCancel = () => this.setState({ confirmBox: false, deleteMediaId: null })

  handleConfirm = () => {
    const { deleteMediaId } = this.state
    const { deleteMedium } = this.props

    this.setState({
      confirmBox: false,
      deleteMediaId: null
    })

    deleteMedium({ deleteMediaId })
    .then((data) => {
      Notification.success('Deleted successfully.')
    }).catch((e) => {
      Notification.error('Deletion error.')
    })
  }

  sortMedia = (media) => {
    let _media = [...media]
    const imageMimes = ['image/jpeg', 'image/png']
    const videoMimes = ['video/quicktime', 'video/mp4']
    const gifMimes = ['image/gif']

    if (this.state.sortType === 'images') {
      return _media.filter(m => imageMimes.indexOf(m.node.mime) > -1)
    }
    if (this.state.sortType === 'videos') {
      return _media.filter(m => videoMimes.indexOf(m.node.mime) > -1)
    }
    if (this.state.sortType === 'gifs') {
      return _media.filter(m => gifMimes.indexOf(m.node.mime) > -1)
    }
    //if (this.state.sortType === 'oldest') {
    //}
    //if (this.state.sortType === 'newest') {
    //}

    return media
  }


  render () {
    const { data } = this.props;
    const { searchText, sortType } = this.state;


    if (data.loading) {
      return <Loader />
    }

    if (data.error) {
      return (<div className='page-wrapper'>
        {data.error.message}
      </div>)
    }

    const category = data.category;
    const media = this.sortMedia(category.media.edges)
    let mediaList = [];
    mediaList = media.map(m => this.renderMedia(m.node));

    let returnData = [<TopPanel key={0}
      leftBlock={
        <Input
          icon='search'
          iconPosition='left'
          placeholder='Search'
          value={searchText}
          onChange={(event, {value}) => this.searchHandler(value)}
        />
      }
      rightBlock={
        <Dropdown
        ref='sort_dropdown'
        search
        selection
        placeholder="Filter:"
        options={options}
        value={sortType}
        onChange={(event, {value}) => this.sortHandler(value)}
      />
      }
      middleBlock={
        <Stats stats={this.calculateStats(category.media.edges)}/>
      }
    />];

    return [<Grid key={0} style={{margin: '0'}}>
      <Grid.Row>
        <Grid.Column width={16} stretched>
          <Grid padded={'vertically'} stretched>
            <Grid.Row  verticalAlign={'middle'}>
              <Grid.Column >
                <Button circular basic icon='chevron left' className="back-btn light-green" onClick={this.props.back}  />
              </Grid.Column>
              <Grid.Column widescreen={6} largeScreen={6} laptop={6} tablet={8} mobile={16}>
                <Segment style={{padding: '15px'}} className='campaign-single' >
                  <div className='assets-item'>
                    <div className='category-title'>
                    <div className='category-color' style={{backgroundColor: category.color || "#E84A47"}} />
                      <Header as='h4'>{category.name}</Header>
                    </div>
                    <div className='category-assets'>Total Assets <span className='thin-number'>{mediaList.length}</span></div>
                    <div className='assets-freshness'><div className='category-assets'>Freshness</div><Freshness percentage={80} /></div>
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column widescreen={2} largeScreen={3} laptop={3} tablet={3} mobile={6} floated={'right'}>
                <Button fluid size={'mini'} className="light-green no-margin add-asset" onClick={(e) => this.toggleAssetModel(true)}>Add Asset</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Grid.Column widescreen={15} largeScreen={15} laptop={15} tablet={15} mobile={16} floated={'right'}>
          {mediaList.length ?
            <Grid padded={'vertically'} columns="3" centered doubling stackable className="masonry">
              {mediaList}
            </Grid>
            :
            <div className='page-wrapper'>
              No Assets Available
            </div>
          }
        </Grid.Column>
      </Grid.Row>
    </Grid>,
    <Confirm key={1}
      className='deleteConfirm'
      open={this.state.confirmBox}
      onCancel={this.handleCancel}
      onConfirm={this.handleConfirm}
      size='tiny'
    />,
    <Modal key={2}
    className="add-asset-modal"
    closeIcon={true}
    closeOnDimmerClick={false}
    size='small'
    onClose={(e) => this.toggleAssetModel(false)}
    open={this.state.addAssetBox}>
    <AddAssetsModal
      socialId={this.props.socialId}
      selectedCategory={this.props.categoryId}
      closeModal={(e) => this.toggleAssetModel(false)}
    />
    </Modal>,
    ...returnData
  ];
  }
}


export default compose(
  graphql(assetsByCategory, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.categoryId
      }
    })
  }),
  graphql(deleteMedium, {
    props ({ ownProps, mutate }) {
      return {
        deleteMedium ({deleteMediaId}) {
          return mutate({
            variables: {
              input: {
                mediaId: deleteMediaId,
                inBank: false
              }
            },
            update: (proxy, { data: { deleteMedium } }) => {
              let data = proxy.readQuery({ query: assetsByCategory, variables: { id: ownProps.categoryId } })
              for (const [index, m] of data.category.media.edges.entries()) {
                if (m.node.id === deleteMediaId) {
                  data.category.media.edges.splice(index, 1)
                  proxy.writeQuery({ query: assetsByCategory, variables: { id: ownProps.categoryId }, data })
                }
              }
            }
          })
        }
      }
    }
  })
)(CategoryView)
