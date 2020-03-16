import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import './App.css';
import Reservation from './Reservation';
import ConfirmationPage from './ConfirmationPage';
import Confirmed from './Confirmed';
import Cancelled from './Cancelled';
import Login from './Login';
import Rooms from './rooms/Rooms';

import { getReservations, getRooms, getUsers } from '../api/fetchData';

function App(props) {
  const [data, setData] = useState('');
  let history = useHistory();

  const onReserve = data => {
    setData(data);
    history.push('/reservation-confirm');
  };

  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getReservations().then(setReservations);
    getRooms().then(setRooms);
    getUsers().then(setUsers);
  }, []);

  return (
    <div className='container-fluid'>
      <Switch>
        <Route
          path='/'
          exact
          render={props => <Login {...props} rooms={rooms} />}
        />
        <Route
          path='/reservation'
          exact
          render={props => (
            <Reservation
              {...props}
              onReserve={onReserve}
              reservations={reservations}
              rooms={rooms}
              users={users}
            />
          )}
        />
        <Route
          path='/reservation-confirm'
          render={props => (
            <ConfirmationPage
              {...props}
              data={data}
              rooms={rooms}
              users={users}
            />
          )}
        />
        <Route
          path='/reservation-confirmed'
          render={props => (
            <Confirmed {...props} data={data} rooms={rooms} users={users} />
          )}
        />
        <Route path='/reservation-cancelled' component={Cancelled} />
        <Route
          path='/rooms'
          render={props => <Rooms {...props} rooms={rooms} />}
        />
        {/* <Redirect to='/' /> */}
      </Switch>
    </div>
  );
}

export default App;
