import React from 'react'
import { Grid } from 'semantic-ui-react'
import CampaignsItems from './CampaignsItems'

import './styles/react-search-input.scss'

const CampaignsItemsWrapper = ({ category, mobile }) => {
  if (!category) {
    return (<Grid centered>
      There is no available contents
    </Grid>)
  }

  const items = category.contents.edges.map((e) => ({...e.node}))
  return (<div>
    <CampaignsItems
      hasNextPage={category.contents.pageInfo.hasNextPage}
      endCursor={category.contents.pageInfo.endCursor}
      categoryId={category.id}
      items={items}
      mobile={mobile}
    />
  </div>)
}

export default CampaignsItemsWrapper
