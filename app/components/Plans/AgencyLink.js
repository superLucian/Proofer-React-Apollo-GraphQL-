import React, {Component} from 'react'
import { graphql, compose} from 'react-apollo'
import { checkoutPageUrl } from './graphql/queries'


const AgencyLink =({data}) =>  {

    return <a className="ui button fluid" style={{'backgroundColor': '#fa456d'}} href={data.checkoutPageUrl}>Upgrade to Agency</a>;
}

export default compose(
  graphql(checkoutPageUrl, {
    options: (ownprops) => ({
      variables: {
        plan: "AGENCY"
      }
    })
  })
)(AgencyLink)
