import React from 'react'
import {Image, Button, Input} from 'semantic-ui-react'
import AddAssets from '../AssetBank/AddAssets'
import {hexToRGB} from '../../libraries/helpers'

import './dropdown.scss'

class AssetsDrop extends React.Component {
  constructor (props) {
    super(props)
    let assets = []
    this.props.assets.filter(item => {
      item.node.categories.map(cat => {
        if (this.props.categoryIds.includes(cat.id)) {
          assets.push(item)
        }
      })
    })
    this.state = {
      allAssets: this.props.assets,
      assets,
      allTags: this.props.tags,
      tags: new Map([...this.props.tags].filter(item => this.props.categoryIds.includes(item[1].id))),
      searchTerm: ''
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.assets.length !== this.props.assets.length) {
      this.setState({assets: nextProps.assets})
    }
  }

  loadMore = () => {
    const assets = this.props.assetData.media_find.edges
    const tags = []
    assets.map(asset => asset.categories.map(cat => tags.push(cat)))
    this.setState({
      assets,
      tags
    })
  }

  onFilterAssetTag = (searchTerm) => {
    const assets = []
    this.state.allAssets.filter(item => {
      item.node.categories.map(cat => {
        if (cat.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          assets.push(item)
        }
      })
    })
    let tags = new Map()
    for ([tagId, tag] of this.state.allTags) {
      if (tag.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        tags.set(tagId, tag)
      }
    }
    this.setState({
      assets,
      tags,
      searchTerm
    })
  }

  onSelectAssetTag = (searchTerm) => {
    const assets = []
    this.state.allAssets.filter(item => {
      item.node.categories.map(cat => {
        if (cat.name === searchTerm) {
          assets.push(item)
        }
      })
    })
    let tags = new Map()
    for ([tagId, tag] of this.state.allTags) {
      if (tag.name === searchTerm) {
        tags.set(tagId, tag)
      }
    }
    this.setState({
      assets,
      tags,
      searchTerm
    })
  }

  render () {
    const {onSelectAsset, socialId, categoryIds} = this.props
    const {assets, tags, allTags} = this.state

    return (
      <div className='add-assets-dropdown'>
        <div className='assets-search-upload'>
          <Input
            icon='search'
            iconPosition='left'
            placeholder='Type to filter by asset tag...'
            onChange={(event, {value}) => this.onFilterAssetTag(value)}
          />
          <AddAssets
            socialId={socialId}
            categoryIds={categoryIds}
            onSelectAsset={onSelectAsset}
            simpleUpload={this.props.simpleUpload}
            onUpload={this.props.onUpload}
          />
        </div>
        <div className='asset-tags'>
          {Array.from(tags.values()).map((tag, index) => {
            const backColor = hexToRGB(tag.color, 0.25)
            const catColor = hexToRGB(tag.color, 1)
            return (<Button
              key={index}
              className='asset-button'
              onClick={() => this.onSelectAssetTag(tag.name)}
              style={{backgroundColor: backColor, color: catColor}}
            >
              {tag.name}
            </Button>)
          }
          )}
        </div>
        <div className='asset-list'>
          {assets.length > 0 ?
            assets.map((asset, index) => {
              return (
                <div key={index} className='asset-item' onClick={() => onSelectAsset(asset.node)}>
                  <span className='asset-color-badge' style={{
                    zIndex: 10,
                    borderTop: `20px solid ${asset.node.categories[0] ? asset.node.categories[0].color : '#D6D6D6'}`,
                    borderBottom: '20px solid transparent',
                    borderRight: '20px solid transparent'
                  }}
                />
                  <Image src={asset.node.url} />
                </div>
              )
            })
            :
            <div className='no-assets'>
              Assets not found
            </div>
          }
        </div>
      </div>
    )
  }
}

export default AssetsDrop
