import React, { useEffect, useState } from 'react';

const Calendar = ({ session }) => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [start, setStart] = useState(new Date().toISOString().slice(0, 16)); // Set initial start time
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 16)); // Set initial end time

  useEffect(() => {
    if (session) {
      fetchEvents();  // Fetch events on session change
    }
  }, [session]);

  // Fetch events from Google Calendar
  async function fetchEvents() {
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events', 
        {
          headers: {
            Authorization: `Bearer ${session.provider_token}`, // Use OAuth token
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setEvents(data.items); // Set events from the API response
      } else {
        console.error('Failed to fetch events:', data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  // Create an event in Google Calendar
  async function createEvent() {
    if (!eventName || !eventDescription || !start || !end) {
      alert('Please fill out all event details.');
      return;
    }

    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.provider_token}`, // Use OAuth token
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert('Event added to your Google Calendar!');
        fetchEvents(); // Refresh events after creation
      } else {
        alert('Failed to create event: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert('An error occurred while adding the event.');
    }
  }

  // Delete an event from Google Calendar
  async function removeEvent(eventId) {
    const confirmed = window.confirm('Are you sure you want to remove this event?');
    if (!confirmed) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.provider_token}`, // Use OAuth token
          },
        }
      );

      if (response.ok) {
        alert('Event removed from your Google Calendar.');
        fetchEvents(); // Refresh events after removal
      } else {
        const data = await response.json();
        alert('Failed to remove event: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error removing event:', error);
      alert('An error occurred while removing the event.');
    }
  }

  return (
    <div>
      <h3>Your Google Calendar Events</h3>
      <ul>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <li key={event.id}>
              <strong>{event.summary}</strong>
              <br />
              {event.start.dateTime ? new Date(event.start.dateTime).toLocaleString() : 'All Day'}
              <br />
              <button
                onClick={() => removeEvent(event.id)}
                style={{
                  backgroundColor: '#D84A00',
                  color: '#fff',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '5px',
                }}
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>

      <h4>Create a New Event</h4>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Event Description"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
      />
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <button onClick={createEvent}>Create Event</button>
    </div>
  );
};

export default Calendar;
