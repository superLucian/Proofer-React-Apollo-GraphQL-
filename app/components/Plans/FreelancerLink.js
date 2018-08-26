import React, {Component} from 'react'
import { graphql, compose} from 'react-apollo'
import { checkoutPageUrl } from './graphql/queries'


const FreelancerLink =({data}) =>  {

    return <a className="ui button fluid" style={{'backgroundColor': '#5490f3'}} href={data.checkoutPageUrl}>Upgrade to Freelancer</a>;
}

export default compose(
  graphql(checkoutPageUrl, {
    options: (ownprops) => ({
      variables: {
        plan: "FREELANCER"
      }
    })
  })
)(FreelancerLink)
