import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

function Login() {
  const [action_choices, setActionChoices] = useState();
  const [button, setButton] = useState();

  const getActions = id => {
    if (id === 'collaborator') {
      return (
        <>
          <h5>Select an action:</h5>
          <Select
            options={[{ value: 'Reservation', label: 'Reserve a room' }]}
            onChange={handleOnActionChange}
          />
        </>
      );
    } else if (id === 'administrator') {
      const options = [
        { value: 'Reservation', label: 'Reserve a room' },
        { value: 'Rooms', label: 'Access rooms' },
        { value: 'Users', label: 'Access users' }
      ];
      return (
        <>
          <h5>Select an action:</h5>
          <Select options={options} onChange={handleOnActionChange} />
        </>
      );
    }
  };

  const handleOnRoleChange = event => {
    setActionChoices(getActions(event.target.id));
  };

  const handleOnActionChange = event => {
    setButton(
      <Link to={{ pathname: `/${event.value}` }}>
        <Button variant='primary'>Submit</Button>
      </Link>
    );
  };

  return (
    <>
      <div className='jumbotron'>
        <h1>Room Manager</h1>
      </div>
      <Form className='login-form'>
        <h5>Select a role:</h5>
        <div key='role-selector' onChange={handleOnRoleChange}>
          <Form.Check
            key='0'
            type='radio'
            name='role-selector'
            id='collaborator'
            label='Collaborator'
          />
          <Form.Check
            key='1'
            type='radio'
            name='role-selector'
            id='administrator'
            label='Administrator'
          />
        </div>
        <br />
        <div key='action-selector'>{action_choices}</div>
        <br />
        {button}
      </Form>
    </>
  );
}

export default Login;
