import React from 'react'
import { graphql, compose } from 'react-apollo'
import {getAssets} from './graphql/AssetQueries'

import Loader from '../Loader'
import AssetDrop from './AssetDrop'

import './dropdown.scss'

class AssetDropdown extends React.Component {
  render() {
    const {socialId, uploadAsset, onSelectAsset, assetData, categoryIds, categories} = this.props
    if (assetData.loading) {
      return <Loader/>
    }

    if (assetData.error) {
      return (<div className='page-wrapper'>
        {assetData.error.message}
      </div>)
    }
    const assets = assetData.media_find.edges
    let tags = new Map()
    categories.map(category => tags.set(category.id, category))
    return (
      <AssetDrop
        assets={assets}
        tags={tags}
        socialId={socialId}
        onSelectAsset={onSelectAsset}
        categoryIds={categoryIds}
        simpleUpload
        onUpload={this.props.onUpload}
      />
    )
  }
}

export default compose(
  graphql(getAssets, {
    options: (ownProps) => ({
      variables: {
        categoryIds: ownProps.categories.map(cat => cat.id)
      }
    }),
    name: 'assetData'
  })
)(AssetDropdown)
