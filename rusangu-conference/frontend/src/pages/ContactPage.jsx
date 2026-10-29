import React, { useState, useEffect } from 'react';
import { getContactInfo, sendContactMessage } from '../api/publicService';
import Skeleton from '../components/common/Skeleton';

const ContactPage = () => {
  const [contactItems, setContactItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    getContactInfo(true)
      .then(res => setContactItems(res.data))
      .catch(() => setContactItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      await sendContactMessage(formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(null), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card">
        <h1 className="text-3xl font-bold text-sda-blue dark:text-sda-blue-light mb-4">Contact Us</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We would love to hear from you. Please reach out using the details below.
        </p>

        {loading ? (
          <div className="space-y-2">
            <Skeleton.Text width="w-full" height="h-4" />
            <Skeleton.Text width="w-3/4" height="h-4" />
            <Skeleton.Text width="w-1/2" height="h-4" />
          </div>
        ) : (
          <div className="space-y-2">
            {contactItems.map((item) => (
              <p key={item.id}>
                <span className="font-semibold">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
        )}

        <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
          For technical support regarding this platform, Call +260979171188/ +260977832315.
        </p>
      </div>

      <div className="glass-card">
        <h2 className="text-2xl font-bold text-sda-blue dark:text-sda-blue-light mb-4">Send us a message</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="glass-input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="glass-input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              className="glass-input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleFormChange}
              className="glass-input w-full"
              required
            />
          </div>
          <button type="submit" className="glass-button w-full md:w-auto" disabled={formStatus === 'sending'}>
            {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
          {formStatus === 'success' && <p className="text-green-600">Message sent successfully!</p>}
          {formStatus === 'error' && <p className="text-red-600">Failed to send message. Please try again.</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;