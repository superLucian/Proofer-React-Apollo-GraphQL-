import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import {
  Card, Input, Dropdown,
  Segment, Grid,
  Image, Header,
  Icon, Button,
  Label, Confirm,
  Modal, Tab,
  Popup
} from 'semantic-ui-react'
import Notification from '../Notification'
import {hexToRGB} from '../../libraries/helpers'
import Loader from '../Loader'
import Freshness from '../Freshness';
import TopPanel from '../TopPanel';
import Stats from '../TopPanel/Stats';
import AggregateCounts from '../TopPanel/AggregateCounts';
import moment from 'moment'
import _ from 'lodash'
import {campaignByCategory, deleteContent} from './graphql/queries'
import EditContent from "../EditContent/index";
import { createContentMutation } from '../Posts/graphql/contentMutations'


const options = [
  { key: 'avgLikes', text: 'Avg. Likes', value: 'avgLikes' },
  { key: 'mostUsed', text: 'Most used', value: 'mostUsed' },
  { key: 'leastUsed', text: 'Least used', value: 'leastUsed' },
  { key: 'withMedia', text: 'With media', value: 'withMedia' },
]

class CategoryView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      deleteMediaId: null,
      confirmBox: false,
      addAssetBox: false,
      searchText: '',
      sortType: '',
      activeContent: null
    }
  }



  calculateStats = (data) => {
    const {searchText} = this.state;

    let availableCampaigns = data.map( m =>  {
      let categories = m.node.categories.filter(c => c.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
      if(categories.length === 0) {
        return '' ;
      }
      return m.node.categories;
    });

    availableCampaigns = availableCampaigns.filter(n => n.length? n : false)
    availableCampaigns = [].concat.apply([], availableCampaigns);
    availableCampaigns = _.uniqBy(availableCampaigns, 'id');

    const compareDates = {
      currentWeek: {
        dateStart: moment().format('YYYY-MM-DD'),
        dateEnd: moment().format('YYYY-MM-DD')
      },
      compareWeek: {
        dateStart: moment().subtract(1, "months").format('YYYY-MM-DD'),
        dateEnd: moment().subtract(1, "months").format('YYYY-MM-DD')
      }
    }

    return [
        {
          'value' : availableCampaigns.length,
          'label' : 'campaign'
        },
        {
          'value' : 80,
          'label' : 'Freshness',
          'indicator' : 5
        },
        {
          "divider": true
        },
        <AggregateCounts key='aggregates' socialId={this.props.socialId} compareDates={compareDates} />
      ];
  }


  countLikes = (schedules, avg) => {
    let list = schedules.edges.map((m) => m.node);
    let likes = 0;
    if(list.length > 0) {
      list.map(({status}) => {
        if(status && status.favouriteCount){
          likes = parseInt(likes) + parseInt(status.favouriteCount)
        }
      })
      if(avg){
        likes = parseInt(likes / list.length);
      }
    }
    return likes;
  }

  avgUsage = (schedules) => {
    let list = schedules.edges.map((m) => m.node);
    let avgUse = 0;
    let startDate = moment();
    if(list.length > 0) {
      let dates = list.map(({publishAt}) => {
        return moment(publishAt);
      })

      startDate = _.min(dates);
      let totalMonths = 1;
      if(startDate.isSameOrAfter()) {
        totalMonths = 1;
      } else {
        totalMonths = Math.ceil(moment().diff(startDate, 'months', true));
      }

      avgUse = parseFloat(list.length / totalMonths).toFixed(1);
    }
    return avgUse;
  }

  searchHandler = (searchText) => this.setState({searchText});
  sortHandler = (sortType) => this.setState({sortType});

  sortContent = (contents) => {
    let _contents = [...contents]

    if (this.state.sortType === 'avgLikes') {
      return _contents.sort((a, b) => this.avgUsage(b.node.schedules) - this.avgUsage(a.node.schedules))
    }

    if (this.state.sortType === 'mostUsed') {
      return _contents.sort((a, b) => b.node.schedules.edges.length - a.node.schedules.edges.length)
    }

    if (this.state.sortType === 'leastUsed') {
      return _contents.sort((a, b) =>  a.node.schedules.edges.length - b.node.schedules.edges.length)
    }

    if (this.state.sortType === 'withMedia') {
      return _contents.filter(content => content.node.media.length)
    }

    return contents
  }

  duplicateContent = (content) => {
    this.props.createContent({
      contentText: content.text,
      categoryIds: content.categories.map(c => c.id),
      mediaIds: content.media.map(m => m.id),
      socialProfilesIds: [this.props.socialId]
    }).then(data => {
      Notification.success('Content duplicated')
    }).catch(error => {
      console.log(error)
      Notification.error('Error duplicating content')
    })
  }

  renderBlocks = (content) => {

    let m = content.media.length > 0 ? content.media[0]: false
    let isImage = null

    if(m){
      isImage = m.url.match(/\.(jpeg|jpg|gif|png)$/) !== null
    }

    if(this.state.searchText) {
      if (!content.text.toLowerCase().includes(this.state.searchText.toLowerCase())) {
        return;
      }
    }

    let avgUse = this.avgUsage(content.schedules);


    return (
    <Grid.Column key={content.id}>
      <Card fluid className="media-card">
        <Card.Content extra className="right-actions" textAlign={'right'}>
          <Popup
            trigger={<span className="edit-action"><Icon name='pencil' onClick={() => this.setState({activeContent: content, addAssetBox: true})} /></span>}
            content='Edit'
            position='top center'
          />
          <Popup
            trigger={<span className="copy-action"><Icon name='copy' onClick={() => this.duplicateContent(content)} /></span>}
            content='Duplicate'
            position='top center'
          />
          {/*<span className="archive-action"><Icon name='archive' /></span>*/}
          <Popup
            trigger={<span className="remove-action"><Icon name='trash' onClick={() => this.onDeleteMedium(content.id)} /></span>}
            content='Delete'
            position='top center'
          />
        </Card.Content>

        {m && (isImage ? <Image key={m.id} src={m.url} />
            : <video key={m.id} src={m.url} className='ui image' />)}

        <Card.Content>
          <p className="text-block">{content.text}</p>

          {content.categories.map(c => {
            return <Label key={c.id} style={{
              backgroundColor: (c.color)?hexToRGB(c.color, 0.25) : hexToRGB("#E84A47", 0.25),
              color: (c.color)? hexToRGB(c.color, 1) : hexToRGB("#E84A47", 1),
              fontWeight: 900
              }}>
              {c.name}
            </Label>
          })}

        </Card.Content>

        <Card.Content className="content-stats">
          <Grid container columns={3}>
            <Grid.Column stretched>
              <div className="text-small">Total Usage</div>
              <span><strong>{content.schedules.edges.length}</strong> time{content.schedules.edges.length > 1 && 's' }</span>
              {/* <div className="text-small">since <strong>Apr '17</strong></div> */}
            </Grid.Column>
            <Grid.Column stretched>
              <div className="text-small">Avg. Usage</div>
              <span><strong>{avgUse}</strong> times</span>
              <div className="text-small">per <strong>month</strong></div>
            </Grid.Column>
            <Grid.Column stretched>
              <div className="text-small">Avg. Likes</div>
              <span><Icon name='heart' color='red' /><span className='thin-number'>{this.countLikes(content.schedules, true)}</span></span>
              <div className="text-small">per <strong>post</strong></div>
            </Grid.Column>
          </Grid>

        </Card.Content>
      </Card>
    </Grid.Column>)
  }

  toggleAssetModel = (addAssetBox) => this.setState({ addAssetBox, activeContent: null })

  onCloseModal = () => {
    this.setState({
      dateTime: '',
      createPostOpen: false
    })
  }

  onTogglePanel = (catId) => {
    console.log('Right panel open/close')
    this.setState({
      rightPanelOpen: catId !== this.state.rightPanelCatId,
      rightPanelCatId: catId !== this.state.rightPanelCatId ? catId : '',
    })
  }

  onDeleteMedium = (deleteMediaId) => {
    var confirmBox = true
    this.setState({deleteMediaId, confirmBox})
  }

  handleCancel = () => this.setState({ confirmBox: false, deleteMediaId: null })

  handleConfirm = () => {
    const { deleteMediaId } = this.state
    const { deleteContent } = this.props

    this.setState({
      confirmBox: false,
      deleteMediaId: null
    })

    deleteContent({ deleteMediaId })
    .then((data) => {
      Notification.success('Deleted successfully.')
    }).catch((e) => {
      Notification.error('Deletion error.')
    })
  }

  closeEditContentModal = () => { this.setState({addAssetBox: false}) }

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
    const sortedContents = this.sortContent(category.contents.edges)
    let mediaList = [];
    mediaList = sortedContents.map(m => this.renderBlocks(m.node));

    let totalLike = 0;
    const contents = category.contents.edges.map((m) => m.node);

    contents.map((content, i) => {
      totalLike = parseInt(totalLike) + parseInt(this.countLikes(content.schedules))
    })

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
        placeholder="Sort by:"
        options={options}
        value={sortType}
        onChange={(event, {value}) => this.sortHandler(value)}
      />
      }
      middleBlock={
        <Stats stats={this.calculateStats(category.contents.edges)}/>
      }
    />];

    return [<Grid key={132} style={{margin: '0'}}>
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
                    <div className='category-likes'>Total Likes <span><Icon name='heart' color='red' /><span className='thin-number'>{totalLike}</span></span></div>
                    <div className='assets-freshness'><div className='category-assets'>Freshness</div><Freshness percentage={80} /></div>
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column widescreen={2} largeScreen={3} laptop={3} tablet={3} mobile={6} floated={'right'}>
                <Button fluid size={'mini'} className="light-green no-margin add-post" onClick={(e) => this.toggleAssetModel(true)}>Add Post to Campaign</Button>
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
              No Content Available
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
    className='post-item'
    size='small'
    onClose={(e) => this.toggleAssetModel(false)}
    open={this.state.addAssetBox}>
      <EditContent
        socialId={this.props.socialId}
        categoryId={this.props.categoryId}
        categories={this.props.categories}
        content={this.state.activeContent}
        onClose={this.closeEditContentModal}
      />
    </Modal>,
    ...returnData
  ];
  }
}

export default compose(
  graphql(campaignByCategory, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.categoryId
      }
    })
  }),
  graphql(createContentMutation, {
    props({ownProps, mutate}) {
      return {
        createContent(vars) {
          return mutate({
            variables: {
              input: vars
            },
            update: (proxy, {data: {createContent}}) => {
              let data = proxy.readQuery({query: campaignByCategory, variables: {id: ownProps.categoryId}})
              data.category.contents.edges.push({ node: createContent.content })
              proxy.writeQuery({query: campaignByCategory, variables: {id: ownProps.categoryId}, data})
            }
          })
        }
      }
    }
  }),
  graphql(deleteContent, {
    props ({ ownProps, mutate }) {
      return {
        deleteContent ({deleteMediaId}) {
          return mutate({
            variables: {
              input: {
                contentId: deleteMediaId,
                inBank: false
              }
            },
            update: (proxy, {data: {deleteContent}}) => {
              let data = proxy.readQuery({query: campaignByCategory, variables: {id: ownProps.categoryId}})
              for (const [index, c] of data.category.contents.edges.entries()) {
                if (c.node.id === deleteMediaId) {
                  data.category.contents.edges.splice(index, 1)
                  proxy.writeQuery({query: campaignByCategory, variables: {id: ownProps.categoryId}, data})
                }
              }
            }
          })
        }
      }
    }
  })
)(CategoryView)
