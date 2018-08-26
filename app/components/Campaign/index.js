import React, {Component} from 'react'
import { graphql, compose } from 'react-apollo'
import CampaignBlock from './CampaignBlock'
import CategoryView from './CategoryView'
import Loader from '../Loader'
import { Dropdown, Input } from 'semantic-ui-react'
import {campaignBySocialProfile} from './graphql/queries'

import './styles/index.scss'
import '../Posts/PostItem/styles.scss'

class Campaign extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedCategoryId: null
    }
  }

  selectCategory = (selectedCategoryId)  => this.setState({selectedCategoryId})


  render() {
    const {selectedCategory, isPanel, socialId, data} = this.props

    const {selectedCategoryId} = this.state

    if (data.loading) {
      return <Loader />;
    }

    if (data.error) {
      return <div className='page-wrapper'>
        {data.error.message}
      </div>;
    }

    if(selectedCategoryId != null) {
      return  <div key={1} className='page-wrapper campaign-page category-view'>
        <CategoryView
          categoryId={selectedCategoryId}
          socialId={socialId}
          back={() => this.selectCategory(null)}
          categories={data.categories_bySocialProfile}
        />
      </div>;
    } else {
      return <div key={1} id={isPanel ? 'assets-sticky' : ''}
          className={isPanel ? 'campaign-page scroll-page' : 'page-wrapper campaign-page'}>
          <CampaignBlock
            isPanel={isPanel}
            selectedCategory={selectedCategory}
            selectCategory={this.selectCategory}
            socialId={socialId}
            categories={data.categories_bySocialProfile}
          />
        </div>;
    }
  }
}

export default compose(
  graphql(campaignBySocialProfile, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.socialId
      }
    })
  })
)(Campaign);
