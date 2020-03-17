import React from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

function Cancelled() {
  return (
    <>
      <div className='jumbotron'>
        <h1>Room Manager</h1>
      </div>
      <Alert variant='danger'>The room reservation was cancelled.</Alert>
      <span>
        Click <Link to='/reservation'>here</Link> to return to the reservation
        form.
      </span>
    </>
  );
}

export default Cancelled;
