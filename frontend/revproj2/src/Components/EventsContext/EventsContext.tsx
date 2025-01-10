import React, { createContext, useState, useContext, useEffect } from 'react';

type EventType = {
  id: number;
  day: string;
  title: string;
  description: string;
};

type EventsContextType = {
  events: EventType[];
  addEvent: (day: string, title: string, description: string) => Promise<void>;
  getEventsForDay: (day: string) => EventType[];
  fetchPersonalEvents: () => Promise<void>;
};

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isFetching, setIsFetching] = useState(false); // Prevent re-fetching in a loop

  // Fetch personal events from the backend
  async function fetchPersonalEvents() {
    try {
      const token = localStorage.getItem('token')
        ? JSON.parse(localStorage.getItem('token')!)
        : null;
      const userId = localStorage.getItem('id')
        ? JSON.parse(localStorage.getItem('id')!)
        : null;

      if (!token || !userId) {
        console.warn("Token or userId is missing, cannot fetch events.");
        return;
      }

      console.log(`Fetching events for userId: ${userId}`);

      const res = await fetch(`http://localhost:8080/personal-events/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`GET /personal-events/${userId} failed: ${res.status}`);
      }

      const personalEvents = await res.json();
      console.log('Fetched personal events:', personalEvents);

      // Only update state if the data is different
      setEvents((prevEvents) => {
        if (JSON.stringify(prevEvents) !== JSON.stringify(personalEvents)) {
          return personalEvents;
        }
        return prevEvents;
      });
    } catch (err) {
      console.error('Error fetching personal events:', err);
    }
  }

  // Add an event with a new ID
  async function addEvent(day: string, title: string, description: string) {
    try {
      const token = localStorage.getItem('token')
        ? JSON.parse(localStorage.getItem('token')!)
        : null;
      const userId = localStorage.getItem('id')
        ? JSON.parse(localStorage.getItem('id')!)
        : null;
  
      if (!token || !userId) {
        console.warn("Token or userId is missing, cannot add events.");
        return;
      }
  
      const payload = {
        day,
        title,
        description,
        userId: userId, 
    };
    
  
      console.log("Payload being sent:", payload);
  
      const res = await fetch('http://localhost:8080/personal-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        throw new Error(`POST /personal-events failed: ${res.status}`);
      }
  
      const newEvent = await res.json();
      console.log('Created personal event:', newEvent);
      setEvents((prev) => [...prev, newEvent]);
    } catch (err) {
      console.error('Error creating personal event:', err);
    }
  }
  
  

  // Simple helper to filter events by day
  function getEventsForDay(day: string) {
    return events.filter((event) => event.day === day);
  }

  // // Fetch events when the provider initializes
  // useEffect(() => {
  //   if (!isFetching) {
  //     setIsFetching(true); // Prevent multiple calls
  //     fetchPersonalEvents().finally(() => setIsFetching(false));
  //   }
  // }, [isFetching]); // Depend only on `isFetching` to avoid endless loops

  return (
    <EventsContext.Provider
      value={{ events, addEvent, getEventsForDay, fetchPersonalEvents }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
