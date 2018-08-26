import gql from 'graphql-tag'

export const editUser = gql`
	mutation editUser($input:EditUserInput!) {
		editUser(input:$input){
			clientMutationId
		}
	} 
`;

export const changePassword = gql`
	mutation changePassword($input:PasswordChangeInput!) {
		changePassword(input:$input)
	} 
`;
