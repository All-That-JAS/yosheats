import React from 'react';
import { Button } from 'react-bootstrap';

import bowser from '../images/bowsersmh.gif';

export default function Popup(props) {
  return props.trigger ? (
    <div className='popup'>
      <div className='popbad-inner'>
        <Button
          variant='light'
          className='close-btn'
          onClick={() => props.setTrigger(false)}
         
        >
          x
        </Button>
        {/* {props.children} */}
        <div
          className=' fw-bolder fs-1 text-center text-lowercase mt-3'
          style={{ color: '#ffffff' }}
        >
        You have exceeded your goals!
        <br></br>
        <img src={bowser} alt='bowser' style={{ width: '25rem' }} />
      </div>
    </div>
    </div>
  ) : (
    ''
  );
}
