import React from 'react'
import { graphql } from 'react-apollo'
import { Grid, Icon } from 'semantic-ui-react'
import Loader from '../Loader'
import Freshness from '../Freshness'
import CampaignsItemsWrapper from './CampaignsItemsWrapper'
import {fetchOneCategoryQuery} from './graphql/categoryQueries'

import './styles/index.scss'

class Campaigns extends React.Component {

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

  render () {
    const {data} = this.props

    if (data.loading) {
      return <Loader />
    }

    if (data.error) {
      return (<div className='page-wrapper'>
        {data.error.message}
      </div>)
    }

    if (!data.category) {
      return (<Grid centered>
        There is no available contents
      </Grid>)
    }

    let totalLike = 0;
    const contents = data.category.contents.edges.map((m) => m.node);

    contents.map((content, i) => {
      totalLike = parseInt(totalLike) + parseInt(this.countLikes(content.schedules))
    })

    const catInfo = {
      name: data.category.name,
      id: data.category.id,
      color: data.category.color || '#36BF99',
      backgroundUrl: data.category.backgroundUrl || '#f9f9f9',
      posts: data.category.contents.edges.length
    }

    if (process.env.BROWSER) {
      if (window.innerWidth < 600) {
        return (
          <div className='campaigns-item-wrapper' onClick={() => this.handleToggleItems(catInfo.id)}>
            <div className='campaigns-item'>
              <div className='campaigns-title'>
                <div className='campaigns-color' style={{backgroundColor: catInfo.color}} />
                {catInfo.name}
              </div>
              <div className='campaigns-likes'>Total likes <span><Icon name='heart' color='red' /><span className='thin-number'>{totalLike}</span></span></div>
              <div className='campaigns-freshness'>Freshness <Freshness percentage={90} /></div>
            </div>
            <div className='campaigns-items show'>
              <CampaignsItemsWrapper
                categoryId={catInfo.id}
                mobile
              />
            </div>
          </div>
        )
      }
    }

    return (
      <div className='campaigns-item-wrapper' onClick={() => this.handleToggleItems(catInfo.id)}>
        <div className='campaigns-item'>
          <div className='campaigns-title'>
            <div className='campaigns-color' style={{backgroundColor: catInfo.color}} />
            {catInfo.name}
          </div>
          <div className='campaigns-posts'>Posts <span className='bold-number'>{catInfo.posts}</span></div>
          <div className='campaigns-likes'>Total likes <span><Icon name='heart' color='red' /><span className='thin-number'>{totalLike}</span></span></div>
          <div className='campaigns-freshness'>Freshness <Freshness percentage={90} /></div>
        </div>
        <div className='campaigns-items show'>
          <CampaignsItemsWrapper
            categoryId={catInfo.id}
          />
        </div>
      </div>
    )
  }
}

export default graphql(fetchOneCategoryQuery, {
  options: (props) => ({
    variables: {
      id: props.categoryId
    }
  })
})(Campaigns)
