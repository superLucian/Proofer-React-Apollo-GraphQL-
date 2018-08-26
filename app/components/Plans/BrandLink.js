import React, {Component} from 'react'
import { graphql, compose} from 'react-apollo'
import { checkoutPageUrl } from './graphql/queries'


const BrandLink =({data}) =>  {

    return <a className="ui button fluid" style={{'backgroundColor': '#fb9f30'}} href={data.checkoutPageUrl}>Upgrade to Brand</a>;
}

export default compose(
  graphql(checkoutPageUrl, {
    options: (ownprops) => ({
      variables: {
        plan: "BRAND"
      }
    })
  })
)(BrandLink)
