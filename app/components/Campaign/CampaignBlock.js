import React, { Component } from 'react'
import { Segment, Grid, Image, Input, Header, Dimmer, Dropdown, Icon } from 'semantic-ui-react'
import Notification from '../Notification'
import { mediaUrl } from '../../libraries/constants'
import persist from '../../libraries/persist'
import Loader from '../Loader'
import Freshness from '../Freshness';
import TopPanel from '../TopPanel';
import Stats from '../TopPanel/Stats';
import AggregateCounts from '../TopPanel/AggregateCounts';
import moment from 'moment'

const options = [
  { key: 'total-likes', text: 'Total Likes', value: 'totalLikes' },
  { key: 'contentCount', text: 'No. of Content', value: 'contentCount' }
]

class CampaignBlock extends Component {
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

    let availableCampaigns = [];

    if(data && data.length > 0){
      availableCampaigns = data.map(c => {
        if(searchText && c.name.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
          return [];
        }
        return c;
      });
    }

    availableCampaigns = availableCampaigns.filter(n => n)
    availableCampaigns = [].concat.apply([], availableCampaigns);

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

  searchHandler = (searchText) => this.setState({searchText});
  sortHandler = (sortType) => this.setState({sortType});

  countLikes = (schedules) => {
    let list = schedules.edges.map((m) => m.node);
    let likes = 0;
    if(list) {
      list.map(({status}) => {
        if(status && status.favouriteCount){
          likes = parseInt(likes) + parseInt(status.favouriteCount)
        }
      })
    }
    return likes;
  }

  sortCategories = (categories) => {
    let _categories = [...categories]

    if (this.state.sortType === 'totalLikes') {
      return _categories.sort((a, b) => {
        let aTotalLikes = 0
        a.contents.edges.map(content => aTotalLikes += this.countLikes(content.node.schedules))

        let bTotalLikes = 0
        b.contents.edges.map(content => bTotalLikes += this.countLikes(content.node.schedules))

        return bTotalLikes - aTotalLikes
      })
    }

    if (this.state.sortType === 'contentCount') {
      return _categories.sort((a, b) => b.contents.edges.length - a.contents.edges.length)
    }

    return categories
  }

  renderCategory = (category) => {

    if(this.state.searchText
      && category.name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) === -1) {
      return;
    }

    const contents = category.contents.edges.map((m) => m.node);

    const active = true;
    let totalLike = 0;

    contents.map((content, i) => {
      totalLike = parseInt(totalLike) + parseInt(this.countLikes(content.schedules))
    })

    const contentList = contents.slice(0, 6).map((content, i) => {
      let m = content.media.length > 0 ? content.media[0]: false
      let isImage = null

      if(m){
        isImage = m.url.match(/\.(jpeg|jpg|gif|png)$/) !== null
      }

      if(i > 4) {
        return <Dimmer.Dimmable as={Grid.Column}
            dimmed={active}
            key={content.id}
            className='ui image'
            >
            <Dimmer className='' active={active} onClick={() => this.props.selectCategory(category.id)}>
              <Header as='h2' inverted>{contents.length > 6 && '+ ' + (contents.length - 6)}</Header>
            </Dimmer>
            {m ? (isImage ? <Image src={content.url} /> : <video src={content.url} className='ui image' />)
              :
              <p className="ui image text-block">{content.text}</p>
            }
        </Dimmer.Dimmable>
      }

      return <Grid.Column key={content.id}>
        {m ? (isImage ? <Image src={m.url} /> : <video src={m.url} className='ui image' />)
          :
          <p className='ui image text-block'>{content.text}</p>
        }
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
            <div className='campaigns-likes'>Total Likes <span><Icon name='heart' color='red' /><span className='thin-number'>{totalLike}</span></span></div>
            <div className='divider'/>
            <div className='assets-freshness'><div className='category-assets'>Freshness</div><Freshness percentage={80} /></div>
          </div>
        </Segment>
        <Grid columns={3} doubling stackable className="campaign-blocks no-padding" style={{width: '100%'}}>
          {contentList}
        </Grid>
      </Segment.Group>
    </div>)
  }

  render () {
    let { categories } = this.props;
    const { searchText, sortType} = this.state;

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
        <Stats stats={this.calculateStats(categories)}/>
      }
    />];

    if(categories && categories.length > 0){
      categories = this.sortCategories(categories)
      categoriesBlocks = categories.map((c) => this.renderCategory(c));
    }

    categoriesBlocks = categoriesBlocks.filter(n => n)


    if(categoriesBlocks.length === 0){
      return [<div className='page-wrapper' key={1}>
        No Content Found
      </div>, ...returnData];
    }

    return [<Grid className='wrapper-grid' centered key={1}>
      {categoriesBlocks}
    </Grid>, ...returnData];
  }
}


export default CampaignBlock
