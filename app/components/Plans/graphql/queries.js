import gql from 'graphql-tag'

export const checkoutPageUrl = gql`
query checkoutPageUrl($plan : PaymentPlan){
  checkoutPageUrl(plan: $plan)
}`


export const  updatePaymentPlanMutation= gql`
mutation updatePaymentPlan($input: UpdatePaymentPlanInput!) {
  updatePaymentPlan(input: $input)
}`
