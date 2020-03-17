import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';

import { getRooms, getRoom } from '../utils';

function Rooms(props) {
  const [rooms, setRooms] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState();
  const [roomTypology, setRoomTypology] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setRooms(getRooms(props.rooms));
  }, [props.rooms]);

  const onAddButtonClick = () => {
    setRoomName('');
    setCreating(true);
    setModalShow(true);
  };

  const onEditButtonClick = event => {
    setRoomName(getRoom(rooms, event));
    setRoomId(event);
    setModalShow(true);
  };

  const handleRoomNameChange = event => {
    setRoomName(event.target.value);
  };

  const handleRoomTypologyChange = event => {
    setRoomTypology(event.value.charAt(0).toUpperCase() + event.value.slice(1));
  };

  const onSaveChanges = () => {
    if (creating) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:5000/api/salas/', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
        const jsonRooms = () =>
          fetch('http://localhost:5000/api/salas/').then(response =>
            response.json()
          );
        jsonRooms()
          .then(getRooms)
          .then(setRooms);
      };
      xhr.send(JSON.stringify({ nome: roomName }));
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `http://localhost:5000/api/salas/${roomId}`, true);
      xhr.onload = function() {
        const jsonRooms = () =>
          fetch('http://localhost:5000/api/salas/').then(response =>
            response.json()
          );
        jsonRooms()
          .then(getRooms)
          .then(setRooms);
      };
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify({ nome: roomName }));

      // const newRooms = rooms.filter(el => el.id !== roomId);
      // setRooms([...newRooms, { id: roomId, label: roomName }]);
    }


    setCreating(false);
    setModalShow(false);

    // window.location.href = window.location.href;
  };

  const onCancel = () => {
    setCreating(false);
    setModalShow(false);
  };

  const onDeleteButtonClick = id => {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:5000/api/salas/${id}`, true);
    xhr.onload = function() {
      const jsonRooms = () =>
        fetch('http://localhost:5000/api/salas/').then(response =>
          response.json()
        );
      jsonRooms()
        .then(getRooms)
        .then(setRooms);
    };
    xhr.send(null);
  };

  if (modalShow) {
    return (
      <>
        <div className='jumbotron'>
          <h1>Room Manager</h1>
        </div>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>{creating ? 'Create' : 'Edit'} Room</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <label htmlFor='roomName'>Room name</label>
            <Form.Control
              type='text'
              id='roomName'
              value={roomName}
              onChange={handleRoomNameChange}
            />
            <br />
            <label htmlFor='roomTypology'>Room typology</label>
            <Select
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
              id='roomTypology'
              // value={roomTypology}
              onChange={handleRoomTypologyChange}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant='secondary' onClick={onCancel}>
              Cancel
            </Button>
            <Button variant='primary' onClick={onSaveChanges}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </>
    );
  } else {
    return (
      <>
        <div className='jumbotron'>
          <h1>Room Manager</h1>
        </div>
        <span>
          Click <Link to='/'>here</Link> to go back.
        </span>
        <Button
          variant='primary'
          onClick={onAddButtonClick}
          style={{ float: 'right', marginBottom: '20px' }}
        >
          Add new room
        </Button>
        <table className='table'>
          <thead>
            <tr>
              <th>Room</th>
              <th>Edit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((val, index) => (
              <tr key={index}>
                <td>{val.label}</td>
                <td>
                  <Button
                    onClick={function() {
                      onEditButtonClick(val.id);
                    }}
                    variant='secondary'
                  >
                    <i className='fas fa-edit'></i>
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={function() {
                      onDeleteButtonClick(val.id);
                    }}
                    variant='danger'
                  >
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
}

export default Rooms;
