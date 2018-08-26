import React from 'react'
import { graphql } from 'react-apollo'
import { Grid, Icon } from 'semantic-ui-react'
import Loader from '../Loader'
import Freshness from '../Freshness'
import CampaignsItemsWrapper from './CampaignsItemsWrapper'
import {getCategorybySocialIdQuery} from './graphql/categoryQueries'

import './styles/index.scss'

class CampaignsMulti extends React.Component {
  state = {
    catIdOpen: this.props.categoryId
  }

  handleToggleItems = (catId) => {
    this.setState({ catIdOpen: catId !== this.state.catIdOpen ? catId : '' })
  }

  componentDidUpdate() {
    if (this.refs[this.state.catIdOpen]) {
      this.refs[this.state.catIdOpen].scrollIntoView(true)
    }
  }

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
    const {catIdOpen} = this.state

    if (data.loading) {
      return <Loader />
    }

    if (data.error) {
      return (<div className='page-wrapper'>
        {data.error.message}
      </div>)
    }

    if (data.socialProfile.categories.edges.length === 0) {
      return (<Grid centered>
        There is no available contents
      </Grid>)
    }



    return data.socialProfile.categories.edges.map(category => {
      const catInfo = {
        name: category.node.name,
        id: category.node.id,
        color: category.node.color || '#36BF99',
        backgroundUrl: category.node.backgroundUrl || '#f9f9f9',
        posts: category.node.contents.edges.length
      }
      let totalLike = 0;
      const contents = category.node.contents.edges.map((m) => m.node);

      contents.map((content, i) => {
        totalLike = parseInt(totalLike) + parseInt(this.countLikes(content.schedules))
      })

      if (process.env.BROWSER) {
        if (window.innerWidth < 600) {
          return (
            <div id={catInfo.id} key={catInfo.id} className='campaigns-item-wrapper' ref={catInfo.id} onClick={() => this.handleToggleItems(catInfo.id)}>
              <div className={catIdOpen === catInfo.id ? 'campaigns-item show' : 'campaigns-item'}>
                <div className='campaigns-title'>
                  <div className='campaigns-color' style={{backgroundColor: catInfo.color}} />
                  {catInfo.name}
                </div>
                <div className='campaigns-likes'>Total likes <span><Icon name='heart' color='red' /><span className='thin-number'>{totalLike}</span></span></div>
                <div className='campaigns-freshness'>Freshness <Freshness percentage={98} /></div>
              </div>
              <div className={catIdOpen === catInfo.id ? 'campaigns-items show' : 'campaigns-items'}>
                <CampaignsItemsWrapper
                  category={category.node}
                />
              </div>
            </div>
          )
        }
      }

      return (
        <div id={catInfo.id} key={catInfo.id} className='campaigns-item-wrapper' ref={catInfo.id} onClick={() => this.handleToggleItems(catInfo.id)}>
          <div className={catIdOpen === catInfo.id ? 'campaigns-item show' : 'campaigns-item'}>
            <div className='campaigns-title'>
              <div className='campaigns-color' style={{backgroundColor: catInfo.color}} />
              {catInfo.name}
            </div>
            <div className='campaigns-posts'>Posts <span className='bold-number'>{catInfo.posts}</span></div>
            <div className='campaigns-likes'>Total likes <Icon name='heart' color='red' /><span className='thin-number'>{totalLike}</span></div>
            <div className='campaigns-freshness'>Freshness <Freshness percentage={98} /></div>
          </div>
          <div className={catIdOpen === catInfo.id ? 'campaigns-items show' : 'campaigns-items'}>
            <CampaignsItemsWrapper
              category={category.node}
            />
          </div>
        </div>
      )
    })
  }
}

export default graphql(getCategorybySocialIdQuery, {
  options: (props) => ({
    variables: {
      id: props.socialId
    }
  })
})(CampaignsMulti)
