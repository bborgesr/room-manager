import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';

import ResultsTable from './results/ResultsTable';

function Confirmed(props) {
  useEffect(() => {
    const xhr = new XMLHttpRequest();
    const postUrl = `http://localhost:5000/api/reservas/${props.data.name}/sala/${props.data.room}`;
    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(
      JSON.stringify({
        data: props.data.date,
        horaEntrada: props.data.startTime,
        horaSaida: props.data.endTime
      })
    );
  }, [
    props.data.date,
    props.data.endTime,
    props.data.name,
    props.data.room,
    props.data.startTime
  ]);

  return (
    <>
      <div className='jumbotron'>
        <h1>Room Manager</h1>
      </div>
      <Alert variant='success'>
        The room was successfully reserved! See details below.
      </Alert>
      <div className='user-results'>
        <ResultsTable
          data={props.data}
          rooms={props.rooms}
          users={props.users}
        />
      </div>
      <span>
        Click <Link to='/'>here</Link> to go to the beginning.
      </span>
    </>
  );
}

export default Confirmed;
