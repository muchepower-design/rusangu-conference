import api from './client';

export const getFeatures = (pageType, featuredOnly = false) => {
  let url = '/public/features';
  const params = new URLSearchParams();
  if (pageType) params.append('page_type', pageType);
  if (featuredOnly) params.append('featured_only', 'true');
  if (params.toString()) url += `?${params.toString()}`;
  return api.get(url);
};

export const getEvents = (status, featuredOnly = false) => {
  let url = '/public/events';
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (featuredOnly) params.append('featured_only', 'true');
  if (params.toString()) url += `?${params.toString()}`;
  return api.get(url);
};

export const getAbout = () => api.get('/public/about');

export const getContactInfo = (featuredOnly = false) => {
  let url = '/public/contact';
  if (featuredOnly) url += '?featured_only=true';
  return api.get(url);
};

export const sendContactMessage = (data) => api.post('/public/contact-message', data); // we'll add this later if needed