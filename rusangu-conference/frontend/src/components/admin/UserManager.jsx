import React, { useState, useEffect, useMemo, useRef } from 'react';
import api from '../../api/client';
import LoadingSpinner from '../common/LoadingSpinner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState('table');

  const tableRef = useRef();

  const fetchData = async () => {
    try {
      const [usersRes, modulesRes] = await Promise.all([
        api.get('users/'),
        api.get('modules/')
      ]);
      setUsers(usersRes.data);
      setModules(modulesRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleUserActive = async (userId, currentActive) => {
    await api.put(`/users/${userId}/active`, { active: !currentActive });
    fetchData();
  };

  const assignModule = async (userId) => {
    if (!selectedModule) return;
    await api.post(`/users/${userId}/modules`, { module_name: selectedModule, active: true });
    setSelectedModule('');
    fetchData();
  };

  const removeModule = async (userId, moduleName) => {
    await api.delete(`/users/${userId}/modules`, { data: { module_name: moduleName } });
    fetchData();
  };

 // Helper to singularize common plural words
const singularize = (word) => {
  if (!word) return word;
  const map = {
    'Observers': 'Observer',
    'Institutions': 'Institution',
    'Media': 'Media',
    'Delegates': 'Delegate',
    'Pastors': 'Pastor',
    'District Pastors': 'District Pastor',
    'Other Guests': 'Other Guest',
    'Directors': 'Director',
  };
  return map[word] || word;
};

const getGuestTypeDisplay = (user) => {
  if (user.guest_type === 'district_pastor') {
    return 'District Pastor';
  }
  if (user.guest_type === 'other') {
    return singularize(user.entity_type) || user.guest_type;
  }
  return user.guest_type;
};

  // Filter based on search
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.district && u.district.toLowerCase().includes(term)) ||
      getGuestTypeDisplay(u).toLowerCase().includes(term)  // search by displayed guest type
    );
  }, [users, searchTerm]);

  // Pagination
  const paginate = (data) => {
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  };

  const totalPages = (data) => Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };

  // Export CSV
  const exportToCSV = () => {
    const data = filteredUsers;
    if (!data.length) return;
    const headers = ['SN', 'Name', 'Email', 'Guest Type', 'District', 'Modules', 'Active'];
    const rows = data.map((u, idx) => [
      idx + 1 + currentPage * rowsPerPage,
      u.name,
      u.email,
      getGuestTypeDisplay(u),
      u.district || 'N/A',
      u.modules.join(', '),
      u.is_active ? 'Active' : 'Inactive'
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export PDF
  const exportToPDF = async () => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    let html = `<h2 style="text-align:center;margin-bottom:20px;">Users</h2>`;
    const data = paginate(filteredUsers);
    html += `<table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">`;
    html += `<thead><tr><th>SN</th><th>Name</th><th>Email</th><th>Guest Type</th><th>District</th><th>Modules</th><th>Active</th></tr></thead><tbody>`;
    data.forEach((u, idx) => {
      html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${u.name}</td><td>${u.email}</td><td>${getGuestTypeDisplay(u)}</td><td>${u.district || 'N/A'}</td><td>${u.modules.join(', ')}</td><td>${u.is_active ? 'Active' : 'Inactive'}</td></tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;

    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('users.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      document.body.removeChild(container);
    }
  };

  // Print using separate window
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow popups to print.');
      return;
    }

    let html = `<html><head><title>Print Users</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #999; padding: 8px; text-align: left; }
        th { background-color: #e9ecef; }
        h2 { text-align: center; margin-bottom: 20px; }
        @media print {
          body { margin: 0; padding: 10px; }
          .no-print { display: none; }
        }
      </style>
    </head><body>`;

    html += `<h2>Users</h2>`;
    const data = paginate(filteredUsers);
    html += `<table><thead><tr><th>SN</th><th>Name</th><th>Email</th><th>Guest Type</th><th>District</th><th>Modules</th><th>Active</th></tr></thead><tbody>`;
    data.forEach((u, idx) => {
      html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${u.name}</td><td>${u.email}</td><td>${getGuestTypeDisplay(u)}</td><td>${u.district || 'N/A'}</td><td>${u.modules.join(', ')}</td><td>${u.is_active ? 'Active' : 'Inactive'}</td></tr>`;
    });
    html += `</tbody></table>`;
    html += `</body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Render table
  const renderTable = () => {
    const data = paginate(filteredUsers);
    const start = currentPage * rowsPerPage;
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-white/20 dark:bg-gray-800/20">
              <th className="px-4 py-2 text-left">SN</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Guest Type</th>
              <th className="px-4 py-2 text-left">District</th>
              <th className="px-4 py-2 text-left">Modules</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u, idx) => (
              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-700/50">
                <td className="px-4 py-2">{start + idx + 1}</td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{getGuestTypeDisplay(u)}</td>
                <td className="px-4 py-2">{u.district || 'N/A'}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {u.modules.map(m => (
                      <span key={m} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs flex items-center">
                        {m}
                        <button onClick={() => removeModule(u.id, m)} className="ml-1 text-red-600 dark:text-red-400 hover:text-red-800">×</button>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleUserActive(u.id, u.is_active)}
                    className={`px-2 py-1 rounded text-xs ${
                      u.is_active
                        ? 'bg-green-500/70 text-white'
                        : 'bg-gray-400/70 text-white'
                    }`}
                  >
                    {u.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={selectedUser === u.id ? selectedModule : ''}
                    onChange={(e) => { setSelectedUser(u.id); setSelectedModule(e.target.value); }}
                    className="glass-input text-xs p-1 mr-2"
                  >
                    <option value="">Assign Module</option>
                    {modules.filter(m => !u.modules.includes(m.name)).map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  {selectedUser === u.id && selectedModule && (
                    <button onClick={() => assignModule(u.id)} className="glass-button text-xs">Add</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render grid
  const renderGrid = () => {
    const data = paginate(filteredUsers);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(u => (
          <div key={u.id} className="glass-card p-4">
            <h4 className="font-semibold">{u.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{u.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Guest: {getGuestTypeDisplay(u)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">District: {u.district || 'N/A'}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {u.modules.map(m => (
                <span key={m} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs flex items-center">
                  {m}
                  <button onClick={() => removeModule(u.id, m)} className="ml-1 text-red-600 dark:text-red-400 hover:text-red-800">×</button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => toggleUserActive(u.id, u.is_active)}
                className={`px-2 py-1 rounded text-xs ${
                  u.is_active
                    ? 'bg-green-500/70 text-white'
                    : 'bg-gray-400/70 text-white'
                }`}
              >
                {u.is_active ? 'Active' : 'Inactive'}
              </button>
              <select
                value={selectedUser === u.id ? selectedModule : ''}
                onChange={(e) => { setSelectedUser(u.id); setSelectedModule(e.target.value); }}
                className="glass-input text-xs p-1 flex-1"
              >
                <option value="">Assign Module</option>
                {modules.filter(m => !u.modules.includes(m.name)).map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
              {selectedUser === u.id && selectedModule && (
                <button onClick={() => assignModule(u.id)} className="glass-button text-xs">Add</button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Pagination controls
  const renderPagination = (data) => {
    const total = totalPages(data);
    return (
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="glass-input py-1 px-2 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="glass-button text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage + 1} of {total || 1}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(total - 1, currentPage + 1))}
            disabled={currentPage >= total - 1}
            className="glass-button text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">Manage Users</h2>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
          className="glass-input flex-1 min-w-[150px]"
        />
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={exportToCSV} className="glass-button text-sm">Export CSV</button>
          <button onClick={exportToPDF} className="glass-button text-sm">Export PDF</button>
          <button onClick={handlePrint} className="glass-button text-sm">Print</button>
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            className="glass-button text-sm"
          >
            {viewMode === 'table' ? 'Grid View' : 'Table View'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="glass-card p-4" ref={tableRef}>
        {viewMode === 'table' ? renderTable() : renderGrid()}
        {renderPagination(filteredUsers)}
      </div>
    </div>
  );
};

export default UserManager;