import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';


const Total = (props)=>{

	var days = (a, b)=>{
		if(a!==0 && b!==0){
			return	 b.diff(a, 'days')
		}
	}

	var subTotal = (Math.round(props.guests*props.price*0.3)+props.price)*days(props.start, props.end);

  return (
		<div className="Total">
        <Row> 
					<Col xs={6}> 
						{Math.round(props.guests*props.price*0.3)+props.price}x {days(props.start, props.end)	} nights 
					</Col>
					<Col xs={2} xsOffset={3} className="TotalAlign">
						{`$${subTotal}`}	
					</Col>
				</Row>
				<Row> 
					<Col  xs={6}>
						Cleaning fee
					</Col>
					<Col xs={2} xsOffset={3} className="TotalAlign">
						$35
					</Col>
				</Row>
				<Row>
					<Col  xs={6}>
						Service fee
					</Col>
					<Col xs={2} xsOffset={3} className="TotalAlign">
						$55
					</Col>
				</Row>
				<Row>
					<Col  xs={6}>
						Total
					</Col>
					<Col xs={2} xsOffset={3}  className="TotalAlign"> 
						${subTotal+35+55} 
					</Col>
				</Row>
		</div>
  )
}

export default Total;