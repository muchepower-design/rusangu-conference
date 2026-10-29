import React, { useState, useEffect } from 'react';
import { getFeatures, getAbout } from '../api/publicService';
import Skeleton from '../components/common/Skeleton';

const AboutPage = () => {
  const [features, setFeatures] = useState([]);
  const [aboutContent, setAboutContent] = useState('');
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const [loadingAbout, setLoadingAbout] = useState(true);

  useEffect(() => {
    getFeatures('about')
      .then(res => setFeatures(res.data))
      .catch(() => setFeatures([]))
      .finally(() => setLoadingFeatures(false));

    getAbout()
      .then(res => setAboutContent(res.data.content))
      .catch(() => setAboutContent(''))
      .finally(() => setLoadingAbout(false));
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card">
        <h1 className="text-3xl font-bold text-sda-blue dark:text-sda-blue-light mb-4">About Rusangu Conference</h1>
        {loadingAbout ? (
          <div className="space-y-2">
            <Skeleton.Text width="w-full" height="h-4" />
            <Skeleton.Text width="w-5/6" height="h-4" />
            <Skeleton.Text width="w-4/6" height="h-4" />
          </div>
        ) : (
          // Preserve line breaks and formatting
          <div className="text-gray-700 dark:text-gray-300 space-y-4 whitespace-pre-wrap">
            {aboutContent}
          </div>
        )}
      </div>

      {!loadingFeatures && features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className={`glass-card border-t-4 ${colorMap[feature.color] || 'border-sda-blue'}`}>
              {feature.icon && <div className="text-3xl mb-2">{feature.icon}</div>}
              <h3 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light">{feature.title}</h3>
              {/* Preserve line breaks in feature description */}
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{feature.description}</p>
            </div>
          ))}
        </div>
      )}
      {loadingFeatures && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton.Card />
          <Skeleton.Card />
          <Skeleton.Card />
        </div>
      )}
    </div>
  );
};

export default AboutPage;