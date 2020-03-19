import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, Modal, Form } from 'react-bootstrap';

import { getNames, getFirstName, getLastName, getLogin } from '../utils';

function Users(props) {
  const [names, setNames] = useState([]);
  const [nameId, setNameId] = useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setNames(getNames(props.users));
  }, [props.users]);

  const onAddButtonClick = () => {
    setFirstName('');
    setLastName('');
    setLogin('');
    setCreating(true);
    setModalShow(true);
  };

  const onEditButtonClick = event => {
    setFirstName(getFirstName(names, event));
    setLastName(getLastName(names, event));
    setLogin(getLogin(names, event));
    setNameId(event);
    setModalShow(true);
  };

  const handleFirstNameChange = event => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = event => {
    setLastName(event.target.value);
  };

  const handleLoginChange = event => {
    setLogin(event.target.value);
  };

  const onSaveChanges = () => {
    if (creating) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:5000/api/usuarios/', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
        const jsonUsers = () =>
          fetch('http://localhost:5000/api/usuarios/').then(response =>
            response.json()
          );
        jsonUsers()
          .then(getNames)
          .then(setNames);
      };
      xhr.send(
        JSON.stringify({
          primeironome: firstName,
          sobrenome: lastName,
          login: login
        })
      );
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `http://localhost:5000/api/usuarios/${nameId}`, true);
      xhr.onload = function() {
        const jsonUsers = () =>
          fetch('http://localhost:5000/api/usuarios/').then(response =>
            response.json()
          );
        jsonUsers()
          .then(getNames)
          .then(setNames);
      };
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(
        JSON.stringify({
          primeironome: firstName,
          sobrenome: lastName,
          login: login
        })
      );
    }

    setCreating(false);
    setModalShow(false);
  };

  const onCancel = () => {
    setCreating(false);
    setModalShow(false);
  };

  const onDeleteButtonClick = id => {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:5000/api/usuarios/${id}`, true);
    xhr.onload = function() {
      const jsonUsers = () =>
        fetch('http://localhost:5000/api/usuarios/').then(response =>
          response.json()
        );
      jsonUsers()
        .then(getNames)
        .then(setNames);
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
            <Modal.Title>{creating ? 'Create' : 'Edit'} User</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <label htmlFor='firstName'>User first name</label>
            <Form.Control
              type='text'
              id='firstName'
              value={firstName}
              onChange={handleFirstNameChange}
            />
            <br />
            <label htmlFor='lastName'>User last name</label>
            <Form.Control
              type='text'
              id='lastName'
              value={lastName}
              onChange={handleLastNameChange}
            />
            <br />
            <label htmlFor='login'>User login</label>
            <Form.Control
              type='text'
              id='login'
              value={login}
              onChange={handleLoginChange}
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
          Add new user
        </Button>
        <table className='table'>
          <thead>
            <tr>
              <th>User</th>
              <th>Edit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {names.map((val, index) => (
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

export default Users;
