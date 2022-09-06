import React from 'react';
import { Button, Card } from 'react-bootstrap';

import luigi from '../images/miniluigi.gif';

export default function Popup(props) {
  return props.trigger ? (
    <div className='popup'>
      <div className='popgood-inner'>
        <Button
          variant='light'
          className='close-btn'
          onClick={() => props.setTrigger(false)}
        >
          x
        </Button>
        <div
          className=' fw-bolder fs-1 text-center text-lowercase'
          style={{ color: '#ffffff' }}
        >
          <Card.Text className=' text-lowercase'>
            You have met your goals!
          </Card.Text>
        </div>

        <div className='d-flex justify-content-around my-2'>
          <img src={luigi} alt='luigi' style={{ width: '25rem' }} />
        </div>
      </div>
    </div>
  ) : (
    ''
  );
}
