import React, { createContext, useState, useContext } from 'react';

type EventType = {
  id: number;
  day: string;
  title: string;
  description: string;
};

type EventsContextType = {
  events: EventType[];
  addEvent: (day: string, title: string, description: string) => void;
  getEventsForDay: (day: string) => EventType[];
};

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventType[]>([]);

  // Add an event with a new ID
  function addEvent(day: string, title: string, description: string) {
    const newId = events.length > 0 ? events[events.length - 1].id + 1 : 1;
    const newEvent: EventType = { id: newId, day, title, description };
    setEvents((prev) => [...prev, newEvent]);
  }

  // Simple helper to filter events by day
  function getEventsForDay(day: string) {
    return events.filter((event) => event.day === day);
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, getEventsForDay }}>
      {children}
    </EventsContext.Provider>
  );
}

// A helper hook, so we don’t have to do `useContext(EventsContext)` repeatedly
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
