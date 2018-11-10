import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Ratings from 'react-ratings-declarative';

const PriceStars = (props)=>{

  return (
		<div>
      <Row>
        <Col xs={2}>{`$${Math.round(props.guests*props.price*0.3)+props.price}   `}</Col>
        <Col xs={8} xsOffset={2} className="Headertext">{` per night`}</Col>
      </Row>
			<Ratings rating={props.rating} widgetDimensions="11px" widgetSpacings=".4px">
			   <Ratings.Widget widgetRatedColor="#008489" />
         <Ratings.Widget widgetRatedColor="#008489" />
         <Ratings.Widget widgetRatedColor="#008489" />
         <Ratings.Widget widgetRatedColor="#008489" />
         <Ratings.Widget widgetRatedColor="#008489" />
			</Ratings>
		</div>
  )
}

export default PriceStars;

