import React, { Component } from 'react'
import {Dropdown, Icon, Image, Menu, List} from 'semantic-ui-react'


class SelectProfile extends Component {
	constructor(props){
    super(props);
    this.state = {
		active:this.props.socialId
	}
	console.log(props)
	this.changeColor = this.changeColor.bind(this);
  }

  componentWillMount() {
    const { myTeams, teamId, socialId } = this.props
    if (!socialId && teamId && myTeams) {
		  myTeams.edges.map((currentValue) => {
				const team = currentValue.node
				if (teamId === team.id) {
					this.props.useSocialProf(team.socialProfiles.edges[0].node.id)
				}
			})
		}
  }
  
  
  changeColor(profileId,index){
	  this.props.useSocialProf(profileId,index)
	  this.setState({active : profileId})  
  }

  render () {
	const { data, myTeams, teamId, socialId,active } = this.props
	let teams = []
	let profiles = []
	let avatar
	if (myTeams) {
	  teams = myTeams.edges.map((currentValue) => {
			const team = currentValue.node
				if (teamId === team.id) {
					profiles = team.socialProfiles.edges.map((currentValue , i) => {
					const profile = currentValue.node
					if (profile) {
						if (profile.profilePicture) {
							avatar = (
								<Image 
									avatar 
									src={profile.profilePicture}
									value={profile.id}
									style={{border: this.state.active === profile.id ?'2.4px solid #E84A47':''}}
									title={profile.name}
									onClick={(e) => this.changeColor(profile.id,i)}
								/>
							)
						} 
						else {
							let icon = 'twitter'
							switch (profile.socialNetwork) {
								case 'TWITTER':
									icon = 'twitter'
									break
								case 'FACEBOOK':
									icon = 'facebook f'
									break
								case 'LINKEDIN':
									icon = 'linkedin'
									break
								default:
									icon = 'plus'
							}
							avatar = (
								<Icon 
									className="social-icon"
									style={{border: this.state.active === profile.id ?'2.4px solid #E84A47':''}}
									circular 
									bordered
									color='red'
									size='large'
									name={icon}
									title={profile.name}
									value={profile.id}
									onClick={(e) => this.changeColor(profile.id, i)}
								/>
							)
						}
						return (
							<span className='profileItem'>
								{avatar}
							</span>
						)
					}
					return {}
				})
			}
			return {}
		})
	}
	return (
	  <div>
			{teamId ? profiles : []}
	  </div>
	)
}
}

export default SelectProfile;
