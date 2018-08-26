import React from 'react'
import {Header, Grid, Image, Table, Button, Icon} from 'semantic-ui-react'
import Freshness from '../Freshness'
import './styles.scss'

class ToDo extends React.Component {
  render () {
  	const ToDosTitle = (
		<Table.Header>
      <Table.Row>
        <Table.HeaderCell>
          <span className='title'>To-Dos</span>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <span className='comment todo_color'>All(7)</span>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <span className='comment'>Next Hour(1)</span>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <span className='comment'>Today(2)</span>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <span className='comment'>Tomorrow(4)</span>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <span className='comment'><Icon name='commenting' size='medium'/>Feedback(6)</span>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <span className='comment'><Icon name='warning sign' size='medium'/>Alerts(1)</span>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
   )
  	const ToDosHeader = (
  		<Table.Header className='comment todo_header left'>
      	<Table.Row >
          <Table.HeaderCell><Icon name='question' size='medium'/>Client</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell><Icon name='comment outline' size='medium'/>Message</Table.HeaderCell>
          <Table.HeaderCell>Platform</Table.HeaderCell>
          <Table.HeaderCell><Icon name='time' size='medium'/>Due</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
	  )
  	const ToDosBody = (
  		<Table.Body>
  			<Table.Row>
  				<Table.Cell>
	  				<Header>
	  					<Image src='../static/images/user-photo.png' size='mini' />
	  					<span className='todo_content'> Bill Murray </span>
	  				</Header>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'><Icon name='commenting' size='medium'/>Feedback</span>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'>Lorem ipsum dolor sit amet, consectetur...</span>
  				</Table.Cell>
  				<Table.Cell>
  					<Icon size='large' name='twitter' color='blue' className='social-icon'></Icon>
  					<Icon size='large' name='facebook' className='social-icon'></Icon>
  					<Icon size='large' name='instagram' className='social-icon'></Icon>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content red'>Next Hour</span>
  				</Table.Cell>
  			</Table.Row>
  			<Table.Row>
  				<Table.Cell>
  					<Header>
	  					<Image src='../static/images/user-photo.png' size='mini' />
	  					<span className='todo_content'> Bill Murray </span>
	  				</Header>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'><Icon name='commenting' size='medium'/>Feedback</span>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'>Lorem ipsum dolor sit amet, consectetur...</span>
  				</Table.Cell>
  				<Table.Cell>
  					<Icon size='large' name='twitter' color='blue' className='social-icon'></Icon>
  					<Icon size='large' name='facebook' className='social-icon'></Icon>
  					<Icon size='large' name='instagram' className='social-icon'></Icon>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content orange'>Today</span>
  				</Table.Cell>
  			</Table.Row>
  			<Table.Row>
  				<Table.Cell>
  					<Header>
	  					<Image src='../static/images/user-photo.png' size='mini' />
	  					<span className='todo_content'> Bill Murray </span>
	  				</Header>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'><Icon name='commenting' size='medium'/>Feedback</span>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'>Lorem ipsum dolor sit amet, consectetur...</span>
  				</Table.Cell>
  				<Table.Cell>
  					<Icon size='large' name='twitter' color='blue' className='social-icon'></Icon>
  					<Icon size='large' name='facebook' className='social-icon'></Icon>
  					<Icon size='large' name='instagram' className='social-icon'></Icon>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_comment orange'>Today</span>
  				</Table.Cell>
  			</Table.Row>
  			<Table.Row>
  				<Table.Cell>
  					<Header>
	  					<Image src='../static/images/user-photo.png' size='mini' />
	  					<span className='todo_content'> Bill Murray </span>
	  				</Header>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'><Icon name='commenting' size='medium'/>Feedback</span>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'>Lorem ipsum dolor sit amet, consectetur...</span>
  				</Table.Cell>
  				<Table.Cell>
  					<Icon size='large' name='twitter' color='blue' className='social-icon'></Icon>
  					<Icon size='large' name='facebook' className='social-icon'></Icon>
  					<Icon size='large' name='instagram' className='social-icon'></Icon>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_comment green'>Tomorrow</span>
  				</Table.Cell>
  			</Table.Row>
  			<Table.Row>
  				<Table.Cell>
  					<Header>
	  					<Image src='../static/images/user-photo.png' size='mini' />
	  					<span className='todo_content'> Bill Murray </span>
	  				</Header>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'><Icon name='commenting' size='medium'/>Feedback</span>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'>Lorem ipsum dolor sit amet, consectetur...</span>
  				</Table.Cell>
  				<Table.Cell>
  					<Icon size='large' name='twitter' color='blue' className='social-icon'></Icon>
  					<Icon size='large' name='facebook' className='social-icon'></Icon>
  					<Icon size='large' name='instagram' className='social-icon'></Icon>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content green'>Tomorrow</span>
  				</Table.Cell>
  			</Table.Row>
  			<Table.Row>
  				<Table.Cell>
  					<Header>
	  					<Image src='../static/images/user-photo.png' size='mini' />
	  					<span className='todo_content'> Bill Murray </span>
	  				</Header>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'><Icon name='commenting' size='medium'/>Feedback</span>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content'>Lorem ipsum dolor sit amet, consectetur...</span>
  				</Table.Cell>
  				<Table.Cell>
  					<Icon size='large' name='twitter' color='blue' className='social-icon'></Icon>
  					<Icon size='large' name='facebook' className='social-icon'></Icon>
  					<Icon size='large' name='instagram' className='social-icon'></Icon>
  				</Table.Cell>
  				<Table.Cell>
  					<span className='todo_content green'>Tomorrow</span>
  				</Table.Cell>
  			</Table.Row>
  		</Table.Body>
  	)
    return (
    	<div>
	      <Table attached='top' structured basic className='dashboard'>
	      {ToDosTitle}
	      </Table>
	      <Table attached structured className='dashboard'>
	      {ToDosHeader}
	      </Table>
	      <Table attached structured basic className='dashboard'>
	      {ToDosBody}
	      </Table>
	    </div>
    )
  }
}

export default ToDo
