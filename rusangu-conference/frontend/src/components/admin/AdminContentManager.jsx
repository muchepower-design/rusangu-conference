import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const AdminContentManager = () => {
  const [activeSubTab, setActiveSubTab] = useState('features');

  const subTabs = [
    { id: 'features', label: 'Features' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact Info' },
  ];

  return (
    <div>
      <div className="glass p-2 rounded-xl mb-4 flex flex-wrap gap-2">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`py-2 px-4 rounded-lg transition ${
              activeSubTab === tab.id
                ? 'bg-sda-blue text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeSubTab === 'features' && <FeatureManager />}
      {activeSubTab === 'events' && <EventManager />}
      {activeSubTab === 'about' && <AboutManager />}
      {activeSubTab === 'contact' && <ContactInfoManager />}
    </div>
  );
};

// ----- FeatureManager -----
const FeatureManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    color: 'sda-blue',
    page_type: 'home',
    is_featured: false,
  });
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get('/public/features');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/public/features/${editing}`, formData);
      } else {
        await api.post('/public/features', formData);
      }
      setFormData({
        title: '',
        description: '',
        icon: '',
        color: 'sda-blue',
        page_type: 'home',
        is_featured: false,
      });
      setEditing(null);
      fetchData();
    } catch (error) {
      alert('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/public/features/${id}`);
    fetchData();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="glass-card">
      <h3 className="text-xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">Features</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="glass-input"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="glass-input"
          rows="2"
          required
        />
        <input
          type="text"
          placeholder="Icon (emoji or class)"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="glass-input"
        />
        <select
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="glass-input"
        >
          <option value="sda-blue">Blue</option>
          <option value="sda-gold">Gold</option>
          <option value="sda-blue-light">Light Blue</option>
          <option value="deep-red">Deep Red</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="orange">Orange</option>
          <option value="teal">Teal</option>
          <option value="pink">Pink</option>
          <option value="gray">Gray</option>
        </select>
        <select
          value={formData.page_type}
          onChange={(e) => setFormData({ ...formData, page_type: e.target.value })}
          className="glass-input"
        >
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="contact">Contact</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          />
          <span>Is Featured</span>
        </label>
        <button type="submit" className="glass-button col-span-2">
          {editing ? 'Update' : 'Add'}
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((f) => (
          <li key={f.id} className="flex justify-between items-center border-b py-2">
            <div>
              <span className="font-medium">{f.title}</span> - {f.description}
            </div>
            <div>
              <button
                onClick={() => {
                  setEditing(f.id);
                  setFormData(f);
                }}
                className="text-blue-600 mr-2"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(f.id)} className="text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ----- EventManager (with start_date & end_date) -----
const EventManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    is_featured: false,
    status: 'upcoming',
  });
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get('/public/events');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/public/events/${editing}`, formData);
      } else {
        await api.post('/public/events', formData);
      }
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        is_featured: false,
        status: 'upcoming',
      });
      setEditing(null);
      fetchData();
    } catch (error) {
      alert('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/public/events/${id}`);
    fetchData();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="glass-card">
      <h3 className="text-xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">Events</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="glass-input"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="glass-input"
          rows="2"
        />
        <input
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          className="glass-input"
          required
        />
        <input
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          className="glass-input"
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="glass-input"
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="archived">Archived</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          />
          <span>Is Featured</span>
        </label>
        <button type="submit" className="glass-button col-span-2">
          {editing ? 'Update' : 'Add'}
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((e) => (
          <li key={e.id} className="flex justify-between items-center border-b py-2">
            <div>
              <span className="font-medium">{e.title}</span>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(e.start_date).toLocaleDateString()}
                {e.end_date && ` – ${new Date(e.end_date).toLocaleDateString()}`}
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  setEditing(e.id);
                  setFormData({
                    title: e.title,
                    description: e.description || '',
                    start_date: e.start_date,
                    end_date: e.end_date || '',
                    is_featured: e.is_featured,
                    status: e.status,
                  });
                }}
                className="text-blue-600 mr-2"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(e.id)} className="text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ----- AboutManager -----
const AboutManager = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get('/public/about');
      setContent(res.data.content || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/public/about', { content });
      alert('About content updated');
    } catch (error) {
      alert('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="glass-card">
      <h3 className="text-xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">About Content</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="glass-input w-full min-h-[200px]"
          placeholder="Write about content here..."
        />
        <button type="submit" className="glass-button mt-4" disabled={saving}>
          {saving ? 'Saving...' : 'Update'}
        </button>
      </form>
    </div>
  );
};

// ----- ContactInfoManager -----
const ContactInfoManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: '',
    is_featured: false,
    order: 0,
  });
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get('/public/contact');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/public/contact/${editing}`, formData);
      } else {
        await api.post('/public/contact', formData);
      }
      setFormData({
        label: '',
        value: '',
        icon: '',
        is_featured: false,
        order: 0,
      });
      setEditing(null);
      fetchData();
    } catch (error) {
      alert('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/public/contact/${id}`);
    fetchData();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="glass-card">
      <h3 className="text-xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">Contact Info</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Label (e.g., Address)"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="glass-input"
          required
        />
        <input
          type="text"
          placeholder="Value"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          className="glass-input"
          required
        />
        <input
          type="text"
          placeholder="Icon (emoji or class)"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="glass-input"
        />
        <input
          type="number"
          placeholder="Order"
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
          }
          className="glass-input"
        />
        <label className="flex items-center space-x-2 col-span-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) =>
              setFormData({ ...formData, is_featured: e.target.checked })
            }
          />
          <span>Is Featured</span>
        </label>
        <button type="submit" className="glass-button col-span-2">
          {editing ? 'Update' : 'Add'}
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((c) => (
          <li key={c.id} className="flex justify-between items-center border-b py-2">
            <div>
              <span className="font-medium">{c.label}:</span> {c.value}
            </div>
            <div>
              <button
                onClick={() => {
                  setEditing(c.id);
                  setFormData(c);
                }}
                className="text-blue-600 mr-2"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(c.id)} className="text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminContentManager;