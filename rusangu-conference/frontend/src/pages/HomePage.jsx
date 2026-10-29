import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { getFeatures, getEvents } from '../api/publicService';
import Skeleton from '../components/common/Skeleton';

const HomePage = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [features, setFeatures] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const heroImages = [
    { url: 'https://images.unsplash.com/photo-1541972973184-1f0edf5f5e6b?w=1400&q=80', alt: 'Adventist church' },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=80', alt: 'Nature' },
    { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=80', alt: 'Wedding' },
    { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=80', alt: 'Church building' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getFeatures('home', true)
      .then(res => setFeatures(res.data))
      .catch(() => setFeatures([]))
      .finally(() => setLoadingFeatures(false));

    getEvents('upcoming', true)
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  const colorMap = {
    'sda-blue': 'border-sda-blue',
    'sda-gold': 'border-sda-gold',
    'sda-blue-light': 'border-sda-blue-light',
    'deep-red': 'border-red-700',
    'green': 'border-green-600',
    'purple': 'border-purple-600',
    'orange': 'border-orange-500',
    'teal': 'border-teal-500',
    'pink': 'border-pink-500',
    'gray': 'border-gray-500',
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center rounded-2xl overflow-hidden">
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-sm"
            style={{
              backgroundImage: `url(${heroImages[currentImageIndex].url})`,
              opacity: 0.7
            }}
          />
        </div>
        <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-sda-blue/40'}`} />
        <div className="relative z-10 max-w-4xl mx-auto text-center p-8 glass rounded-2xl backdrop-blur-md">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Rusangu Conference
          </h1>
          <p className="text-xl text-white/90 mb-6 drop-shadow">
            Seventh-day Adventist Church &bull; Southern Zambia Union Conference
          </p>
          <p className="text-lg text-white/80 mb-8">
            Serving God's people with the everlasting gospel.
          </p>
          {!user ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="glass-button">Login</Link>
              <Link to="/register" className="glass-button-gold">Register</Link>
            </div>
          ) : (
            <Link to="/dashboard" className="glass-button">Go to Dashboard</Link>
          )}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section – only show if there are featured items */}
      {!loadingFeatures && features.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className={`glass-card border-t-4 ${colorMap[feature.color] || 'border-sda-blue'}`}>
              {feature.icon && <div className="text-3xl mb-2">{feature.icon}</div>}
              <h3 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light">{feature.title}</h3>
              {/* Preserve line breaks in feature description */}
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{feature.description}</p>
            </div>
          ))}
        </section>
      )}
      {loadingFeatures && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton.Card />
          <Skeleton.Card />
          <Skeleton.Card />
        </section>
      )}

      {/* Events Section – only show if there are featured events */}
      {!loadingEvents && events.length > 0 && (
        <section className="glass-card">
          <h2 className="text-2xl font-bold text-sda-blue dark:text-sda-blue-light mb-4">Upcoming Events</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {events.map((event) => (
  <li key={event.id}>
    <strong>{event.title}</strong> – 
    {new Date(event.start_date).toLocaleDateString()}
    {event.end_date && ` – ${new Date(event.end_date).toLocaleDateString()}`}
    {event.description && (
      <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-1">
        {event.description}
      </div>
    )}
  </li>
))}
          </ul>
          <Link to="/events" className="text-sda-blue dark:text-sda-blue-light hover:underline mt-2 inline-block">View all events →</Link>
        </section>
      )}
      {loadingEvents && (
        <section className="glass-card">
          <Skeleton.Text width="w-48" height="h-6" className="mb-2" />
          <Skeleton.Text width="w-full" height="h-4" />
          <Skeleton.Text width="w-5/6" height="h-4" />
          <Skeleton.Text width="w-4/6" height="h-4" />
        </section>
      )}
    </div>
  );
};

export default HomePage;