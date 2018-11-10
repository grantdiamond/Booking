import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import  GuestItem from './guestItem.jsx';
import  InfItem from './infItem.jsx';

class GuestsBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
	
		}
	}

	render () {
		return (
			<div className={`${this.props.visible}`}>
				{["Adults", "Children"].map((person)=>{
					return ( 
						<GuestItem 
							person={person} add={this.props.add} minus={this.props.minus} 
							guests={this.props.guests} max={this.props.max}
						/>
					)
				})}
				<InfItem  person={"Infants"}/>
				<Row > 
					<Col xsOffset={1}  xs={11}>
						<br/>
						{`${this.props.max} `} maximum. Infants don’t count toward the number of guests.
					</Col>
				</Row>
				<Row><br/></Row>
			</div>)
	}
}

export default GuestsBar; 
