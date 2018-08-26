import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { Card, Segment, Grid, Image, Input, Header, Dimmer, Divider, Dropdown } from 'semantic-ui-react'
import Notification from '../Notification'
import { mediaUrl } from '../../libraries/constants'
import persist from '../../libraries/persist'
import Loader from '../Loader'
import Freshness from '../Freshness';
import TopPanel from '../TopPanel';
import Stats from '../TopPanel/Stats';
import {assetsBySocialProfile} from './graphql/AssetQueries'

const options = [
  //{ key: 'performance', text: 'Performance', value: 'performance' },
  { key: 'asset_count', text: 'Total Assets', value: 'assetCount' }
]

class AssetBlocks extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedCategoryId: null,
      searchText: '',
      sortType: ''
    }
  }

  calculateStats = (data) => {
    const {searchText} = this.state;

    let availableAssets = [];

    if(data && data.length > 0){
      availableAssets = data.map((c) => {
        if(searchText && c.name.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
          return [];
        }
        return c.media.edges.map((m) => m.node)
      });
    }

    availableAssets = availableAssets.filter(n => n.length > 0 ? n: false)
    availableAssets = [].concat.apply([], availableAssets);

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

  sortCategories = (categories) => {
    let _categories = [...categories]

    if (this.state.sortType === 'assetCount') {
      return _categories.sort((a, b) => b.media.edges.length - a.media.edges.length)
    }

    return categories
  }

  renderCategory = (category) => {

    if(this.state.searchText
      && category.name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) === -1) {
      return;
    }

    const medias = category.media.edges.map((m) => m.node);

    const content = <Header as='h2' inverted>{medias.length > 6 && '+ ' + (medias.length - 6)}</Header>

    const active = true;

    const mediaList = medias.slice(0, 6).map((m, i) => {
      let isImage = m.url.match(/\.(jpeg|jpg|gif|png)$/) !== null

      if(i > 4) {
        return <Dimmer.Dimmable as={Grid.Column}
            dimmed={active}
            key={m.id}
            className='ui image'
            >
            <Dimmer className='' active={active} onClick={() => this.props.selectCategory(category.id)}>
              <Header as='h2' inverted>{medias.length > 6 && '+ ' + (medias.length - 6)}</Header>
            </Dimmer>
            {isImage ?
              <Image src={m.url} />
              :
              <video src={m.url} className='ui image' />
            }
        </Dimmer.Dimmable>
      }


      return <Grid.Column key={m.id}>
        {isImage ? <Image src={m.url} /> : <video src={m.url} className='ui image' />}
        </Grid.Column>;
    })

    return (<div key={category.id} className="asset-block" >
      <Segment.Group>
        <Segment onClick={() => this.props.selectCategory(category.id)}>
          <div className='assets-item'>
            <div className='category-title'>
              <div className='category-color' style={{backgroundColor: category.color || "#E84A47"}} />
              <Header as='h4'>{category.name}</Header>
            </div>
            <div className='category-assets'>Total Assets <span className='thin-number'>{medias.length}</span></div>
            {/* <div className='divider'/> */}
            <div className='assets-freshness'><div className='category-assets'>Freshness</div><Freshness percentage={80} /></div>
          </div>
        </Segment>
        <Grid columns={3} doubling stackable className="assets-images no-padding" style={{width: '100%'}}>
          {mediaList}
        </Grid>
      </Segment.Group>
    </div>)
  }

  render () {
    const { data } = this.props;
    const { searchText, sortType} = this.state;

    if (data.loading) {
      return <Loader />;
    }

    if (data.error) {
      return <div className='page-wrapper'>
          {data.error.message}
        </div>;
    }
    let categoriesBlocks = [];
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
        <Stats stats={this.calculateStats(data.categories_bySocialProfile)}/>
      }
    />];

    if(data.categories_bySocialProfile && data.categories_bySocialProfile.length > 0){
      const categories = this.sortCategories(data.categories_bySocialProfile)
      categoriesBlocks = categories.map((c) => this.renderCategory(c))
    }

    categoriesBlocks = categoriesBlocks.filter(n => n)


    if(categoriesBlocks.length === 0){
      return [<div className='page-wrapper' key={1}>
        No Assets Found
      </div>, ...returnData];
    }

    return [<Grid className='wrapper-grid' centered key={1}>
      {categoriesBlocks}
    </Grid>, ...returnData];
  }
}


export default compose(
  graphql(assetsBySocialProfile, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.socialId
      }
    })
  })
)(AssetBlocks)
