import React from 'react';
import Alert from 'react-bootstrap/Alert';

import dayjs from 'dayjs';

// const nameOptions = [
//   { id: "1", label: "Bárbara Ribeiro" },
//   { id: "2", label: "Catarina Curioso" },
//   { id: "3", label: "Sérgio Machado" },
//   { id: "4", label: "Marcelo Mattos" }
// ];

// const roomOptions = [
//   { id: "1", label: "Shark" },
//   { id: "2", label: "Puffer" },
//   { id: "3", label: "Carp" },
//   { id: "4", label: "Bream" }
// ];

const getName = (names, id) => {
  const selected = names.filter(el => el.id.toString() === id.toString());
  const first = selected[0];
  if (first) return `${first.primeironome} ${first.sobrenome}` || first.label;
};

const getNames = users =>
  users.map(el => ({
    value: el.id,
    label: `${el.primeironome} ${el.sobrenome}`
  }));

const getRoom = (rooms, id) => {
  const selected = rooms.filter(el => el.id.toString() === id.toString());
  const first = selected[0];
  if (first) return first.nome || first.label;
};

const getRooms = rooms =>
  rooms.map(el => ({
    id: el.id,
    label: el.nome
  }));

const databaseTimeToUserTime = databaseTime => {
  const date = new Date(databaseTime);
  let dateHours = date.getHours().toString();
  if (dateHours.length === 1) dateHours = `0${dateHours}`;
  let dateMins = date.getMinutes().toString();
  if (dateMins.length === 1) dateMins = `0${dateMins}`;
  return `${dateHours}:${dateMins}`;
};

const getErrors = (name, room, date, startTime, endTime) => {
  let errors = [];
  if (!name) {
    errors = [...errors, 'name'];
  }
  if (!room) {
    errors = [...errors, 'room'];
  }
  if (!date) {
    errors = [...errors, 'date'];
  }
  if (!startTime) {
    errors = [...errors, 'start time'];
  }
  if (!endTime) {
    errors = [...errors, 'end time'];
  }
  return errors;
};

const isRoomTaken = (reservations, room, date, startTime, endTime) => {
  // get reservations that match the date and room
  const filteredRes = reservations.filter(res => {
    const dateString = new Date(res.data).toLocaleDateString();
    const roomId = res.salaId.toString();
    return dateString === date && roomId === room;
  });

  // there are 5 overlapping possibilities
  const overlaps = filteredRes.map(res => {
    const resStartTime = getDateTime(
      new Date(res.data).toLocaleDateString(),
      databaseTimeToUserTime(res.horaEntrada)
    );
    const resEndTime = getDateTime(
      new Date(res.data).toLocaleDateString(),
      databaseTimeToUserTime(res.horaSaida)
    );
    const thisStartTime = getDateTime(date, startTime);
    const thisEndTime = getDateTime(date, endTime);

    // 1) thisTime is inside an existing reservation
    let overlap =
      thisStartTime.isAfter(resStartTime, 'minute') &&
      thisStartTime.isBefore(resEndTime, 'minute');

    // 2) an existing reservation is inside thisTime
    overlap =
      overlap ||
      (thisStartTime.isBefore(resStartTime, 'minute') &&
        thisEndTime.isAfter(resEndTime, 'minute'));

    // 3) an existing reservation starts in the middle of thisTime
    overlap =
      overlap ||
      (thisStartTime.isBefore(resStartTime, 'minute') &&
        thisEndTime.isAfter(resStartTime, 'minute'));

    // 4) thisTime starts in the middle of an existing reservation
    overlap =
      overlap ||
      (resStartTime.isBefore(thisStartTime, 'minute') &&
        resEndTime.isAfter(thisStartTime, 'minute'));

    // 5) thisStartTime or thisEndTime is equal to that of an existing reservation
    overlap =
      overlap ||
      resStartTime.isSame(thisStartTime, 'minute') ||
      resEndTime.isSame(thisEndTime, 'minute');

    return overlap;
  });
  const reducer = (acc, curr) => acc || curr;
  return overlaps.reduce(reducer, false);
};

const isTimeIntervalValid = (date, startTime, endTime) => {
  const start = getDateTime(date, startTime);
  const end = getDateTime(date, endTime);
  return start.isBefore(end);
};

const getDateTime = (date, time) => {
  const hour = parseInt(time.substring(0, 2));
  const min = parseInt(time.substring(3, 5));
  return dayjs(date)
    .set('h', hour)
    .set('m', min);
};

const getAlerts = errors => {
  if (errors.includes('roomTaken')) {
    return (
      <Alert variant='danger'>
        Selected room already reserved for the chosen time.
      </Alert>
    );
  }
  if (errors.includes('invalidTimes')) {
    return (
      <Alert variant='danger'>
        Invalid time interval: the start time must be before the end time.
      </Alert>
    );
  }
  return errors.map(err => (
    <Alert key={err} variant='danger'>
      Please enter a valid {err}.
    </Alert>
  ));
};

export {
  getName,
  getNames,
  getRoom,
  getRooms,
  databaseTimeToUserTime,
  getErrors,
  isRoomTaken,
  isTimeIntervalValid,
  getAlerts
};
