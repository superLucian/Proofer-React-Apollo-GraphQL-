import {Component} from 'react'
import { graphql, compose } from 'react-apollo'
import { getAssets } from './graphql/AssetQueries'
import AssetBlocks from './AssetBlocks'
import CategoryView from './CategoryView'
import Loader from '../Loader'
import { Dropdown, Input} from 'semantic-ui-react'

import './styles/index.scss'

class AssetsBank extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedCategoryId: null
    }
  }

  selectCategory = (selectedCategoryId)  => this.setState({selectedCategoryId})


  render() {
    const {selectedCategory, isPanel, socialId} = this.props

    const {selectedCategoryId} = this.state

    if(selectedCategoryId != null) {
      return  <div key={1} className='page-wrapper assets-page category-view'>
        <CategoryView
          categoryId={selectedCategoryId}
          socialId={socialId}
          back={() => this.selectCategory(null)}
        />
      </div>;
    } else {
      return <div key={1} id={isPanel ? 'assets-sticky' : ''}
          className={isPanel ? 'assets-page scroll-page' : 'page-wrapper assets-page'}>
          <AssetBlocks
            isPanel={isPanel}
            selectedCategory={selectedCategory}
            selectCategory={this.selectCategory}
            socialId={socialId}
          />
        </div>;
    }

  }
}

export default AssetsBank;
