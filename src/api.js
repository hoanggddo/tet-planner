import { useState } from 'react';

function Calendar({ session, onCreateEvent }) {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [start, setStart] = useState(new Date().toISOString().slice(0, 16));
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 16));

  async function handleCreateEvent(e) {
    e.preventDefault();

    try {
      const eventDetails = { eventName, eventDescription, start, end };
      await onCreateEvent(session, eventDetails);
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.message);
    }
  }

  return (
    <div>
      <h2>Add Event to Calendar</h2>
      <form onSubmit={handleCreateEvent}>
        <label>Event Name:</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <label>Event Description:</label>
        <input
          type="text"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          required
        />
        <label>Start Time:</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <label>End Time:</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}



export default Calendar;
