import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [modulesList, setModulesList] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchModules();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    const res = await api.get('/modules');
    setModulesList(res.data);
  };

  const toggleActive = async (userId) => {
    await api.post(`/admin/users/${userId}/toggle-active`);
    fetchUsers();
  };

  const updateUser = async (userId) => {
    await api.put(`/admin/users/${userId}`, editData);
    setEditing(null);
    fetchUsers();
  };

  const assignModule = async (userId, moduleName) => {
    await api.post(`/users/${userId}/modules`, { module_name: moduleName, active: true });
    fetchUsers();
  };

  const removeModule = async (userId, moduleName) => {
    await api.delete(`/users/${userId}/modules`, { data: { module_name: moduleName } });
    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      {loading && <p>Loading...</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">District</th>
              <th className="py-2 px-4 border-b text-left">Type</th>
              <th className="py-2 px-4 border-b text-left">Active</th>
              <th className="py-2 px-4 border-b text-left">Modules</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-2 px-4">
                  {editing === user.id ? (
                    <input type="text" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} className="border p-1" />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.district || 'N/A'}</td>
                <td className="py-2 px-4">{user.guest_type}</td>
                <td className="py-2 px-4">{user.is_active ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap gap-1">
                    {user.modules.map(m => (
                      <span key={m} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                        {m}
                        <button onClick={() => removeModule(user.id, m)} className="ml-1 text-red-500">×</button>
                      </span>
                    ))}
                    <select onChange={(e) => assignModule(user.id, e.target.value)} className="text-xs border rounded p-1">
                      <option value="">Add module</option>
                      {modulesList.filter(m => !user.modules.includes(m.name)).map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <button onClick={() => toggleActive(user.id)} className="text-blue-600 mr-2">
                    {user.is_active ? 'Disable' : 'Enable'}
                  </button>
                  {editing === user.id ? (
                    <button onClick={() => updateUser(user.id)} className="text-green-600">Save</button>
                  ) : (
                    <button onClick={() => { setEditing(user.id); setEditData({ name: user.name }); }} className="text-gray-600">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;