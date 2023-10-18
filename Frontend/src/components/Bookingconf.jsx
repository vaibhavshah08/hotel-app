// BookingConfirmation.js
import React from 'react';
import Modal from 'react-modal';

const BookingConfirmation = ({ isOpen, onRequestClose, onConfirmBooking, response }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Booking Confirmation"
    >
      <h2>Booking Confirmation</h2>
      <p>Review the booking details and confirm if correct:</p>
      <div>
        <strong>Email:</strong> {response.userEmail}
      </div>
      <div>
        <strong>Room No:</strong> {response.roomno}
      </div>
      <div>
        <strong>Start Date:</strong> {response.startTime}
      </div>
      <div>
        <strong>End Date:</strong> {response.endTime}
      </div>
      <div>
        <strong>Room Type:</strong> {response.type}
      </div>
      <button onClick={onConfirmBooking}>Confirm</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default BookingConfirmation;
