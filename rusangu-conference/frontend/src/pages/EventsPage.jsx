import React, { useState, useEffect } from 'react';
import { getEvents } from '../api/publicService';
import Skeleton from '../components/common/Skeleton';

const EventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEvents('upcoming'),
      getEvents('past'),
      getEvents('archived')
    ])
      .then(([upcomingRes, pastRes, archivedRes]) => {
        setUpcomingEvents(upcomingRes.data);
        setPastEvents(pastRes.data);
        setArchivedEvents(archivedRes.data);
      })
      .catch(() => {
        setUpcomingEvents([]);
        setPastEvents([]);
        setArchivedEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-sda-blue dark:text-sda-blue-light">Events</h1>
        <Skeleton.Form fields={4} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-sda-blue dark:text-sda-blue-light">Events</h1>

      {upcomingEvents.length > 0 && (
        <div className="glass-card">
          <h2 className="text-2xl font-semibold text-sda-blue dark:text-sda-blue-light mb-4">Upcoming Events</h2>
          <ul className="space-y-2">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="border-b border-gray-200 dark:border-gray-700 py-2">
                <strong>{event.title}</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>{event.title}</strong> – 
    {new Date(event.start_date).toLocaleDateString()}
    {event.end_date && ` – ${new Date(event.end_date).toLocaleDateString()}`}
                </p>
                {event.description && (
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">
                    {event.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="glass-card">
          <h2 className="text-2xl font-semibold text-sda-blue dark:text-sda-blue-light mb-4">Past Events</h2>
          <ul className="space-y-2">
            {pastEvents.map((event) => (
              <li key={event.id} className="border-b border-gray-200 dark:border-gray-700 py-2">
                <strong>{event.title}</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>{event.title}</strong> – 
    {new Date(event.start_date).toLocaleDateString()}
    {event.end_date && ` – ${new Date(event.end_date).toLocaleDateString()}`}
                </p>
                {event.description && (
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">
                    {event.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {archivedEvents.length > 0 && (
        <div className="glass-card">
          <h2 className="text-2xl font-semibold text-sda-blue dark:text-sda-blue-light mb-4">Archived Events</h2>
          <ul className="space-y-2">
            {archivedEvents.map((event) => (
              <li key={event.id} className="border-b border-gray-200 dark:border-gray-700 py-2">
                <strong>{event.title}</strong>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>{event.title}</strong> – 
    {new Date(event.start_date).toLocaleDateString()}
    {event.end_date && ` – ${new Date(event.end_date).toLocaleDateString()}`}
                </p>
                {event.description && (
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">
                    {event.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {upcomingEvents.length === 0 && pastEvents.length === 0 && archivedEvents.length === 0 && (
        <div className="glass-card text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;