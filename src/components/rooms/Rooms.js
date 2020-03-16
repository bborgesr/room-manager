import React from 'react';
import { Button } from 'react-bootstrap';

import { getRooms } from '../utils';

function Rooms(props) {
  const rooms = getRooms(props.rooms);

  const onEditButtonClick = () => {};
  const onDeleteButtonClick = () => {};

  return (
    <>
      <div className='jumbotron'>
        <h1>Room Manager</h1>
      </div>
      <table class='table'>
        <thead>
          <tr>
            <th>Room</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((val, index) => (
            <tr>
              <td>{val.label}</td>
              <td>
                <Button onClick={onDeleteButtonClick} variant='secondary'>
                  <i className='fas fa-edit'></i>
                </Button>
              </td>
              <td>
                <Button onClick={onDeleteButtonClick} variant='danger'>
                  <i className='fas fa-trash'></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Rooms;
