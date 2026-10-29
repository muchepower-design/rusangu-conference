import React, { useState, useMemo, useEffect } from 'react';
import api from '../../api/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Skeleton from '../common/Skeleton';

// ----- Reusable form field (defined OUTSIDE to prevent remount/focus loss) -----
const Field = ({ label, name, type = 'text', options, disabled, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">
      {label}
    </label>
    {options ? (
      <select
        name={name}
        value={value ?? ''}
        onChange={onChange}
        className="glass-input w-full text-sm"
        disabled={disabled}
      >
        <option value="">-- Select --</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        className="glass-input w-full text-sm"
        disabled={disabled}
      />
    )}
  </div>
);

const BadgeGenerator = ({ delegates: propDelegates, onUpdate }) => {
  const [delegates, setDelegates] = useState(propDelegates || []);
  const [loading, setLoading] = useState(!propDelegates);
  const [selectedIds, setSelectedIds] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState('list');
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ----- Edit modal state -----
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ----- Lookup data (districts, departments, officers) -----
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  // Fetch approved delegates on mount
  useEffect(() => {
    const fetchApproved = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users/');
        setDelegates(res.data);
      } catch (error) {
        console.error('Failed to fetch approved delegates:', error);
        if (propDelegates) setDelegates(propDelegates);
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, [propDelegates]);

  // Fetch districts (for the edit modal dropdown)
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await api.get('/users/districts');
        setDistricts(res.data || []);
      } catch (err) {
        console.error('Failed to fetch districts:', err);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch departments (for the edit modal checklist)
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/modules/departments');
        setDepartments(res.data || []);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch officers (for the edit modal dropdown)
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await api.get('/officials/officers');
        setOfficers(res.data || []);
      } catch (err) {
        console.error('Failed to fetch officers:', err);
      }
    };
    fetchOfficers();
  }, []);

  // Only show delegates who have been approved (have the module)
  const approvedDelegates = useMemo(() => {
    return delegates.filter(
      d => d.modules && d.modules.includes('session_meetings_delegate')
    );
  }, [delegates]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return approvedDelegates;
    const term = searchTerm.toLowerCase();
    return approvedDelegates.filter(
      d =>
        d.name.toLowerCase().includes(term) ||
        (d.district && d.district.toLowerCase().includes(term))
    );
  }, [approvedDelegates, searchTerm]);

  const paginate = data => {
    const start = currentPage * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  };
  const totalPages = data => Math.ceil(data.length / rowsPerPage);
  const handlePageChange = newPage => setCurrentPage(newPage);
  const handleRowsPerPageChange = e => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };

  const toggleSelect = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    const allIds = filteredData.map(d => d.id);
    if (selectedIds.length === allIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  // ----- Edit modal handlers -----
  const openEditModal = async userId => {
    setEditingUserId(userId);
    setModalLoading(true);
    try {
      const res = await api.get(`/users/${userId}`);
      const u = res.data;
      setFormData({
        first_name: u.first_name || '',
        middle_name: u.middle_name || '',
        last_name: u.last_name || '',
        email: u.email || '',
        phone: u.phone || '',
        gender: u.gender || '',
        district_id: u.district_id ?? '',
        diet_preference: u.diet_preference || '',
        tshirt_size: u.tshirt_size || '',
        tshirt_color: u.tshirt_color || '',
        // ----- newly added fields (mirrors Register page) -----
        department_ids: u.department_ids || [],
        officer_id: u.officer_id ?? '',
        // ----- entity fields (intentionally left out for now) -----
        entity_type: u.entity_type || '',
        entity_sub_type: u.entity_sub_type || '',
        entity_details: u.entity_details || '',
      });
    } catch (err) {
      console.error('Failed to load user:', err);
      alert('Failed to load user details.');
      setEditingUserId(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeEditModal = () => {
    setEditingUserId(null);
    setFormData(null);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Department checkbox handler (mirrors Register's handleChange for checkboxes)
  const handleDepartmentToggle = deptId => {
    setFormData(prev => {
      const current = prev.department_ids || [];
      const idNum = Number(deptId);
      if (current.map(Number).includes(idNum)) {
        return {
          ...prev,
          department_ids: current.filter(id => Number(id) !== idNum),
        };
      }
      return { ...prev, department_ids: [...current, idNum] };
    });
  };

  const saveUser = async () => {
    if (!editingUserId || !formData) return;
    setSaving(true);
    try {
      const payload = {
        ...formData,
        district_id:
          formData.district_id === '' ? null : Number(formData.district_id),
        officer_id:
          formData.officer_id === '' ? null : Number(formData.officer_id),
      };
      await api.put(`/users/${editingUserId}`, payload);

      // Update local delegates list so UI reflects change without refetch
      setDelegates(prev =>
        prev.map(d => {
          if (d.id !== editingUserId) return d;
          const fullName = [
            formData.first_name,
            formData.middle_name,
            formData.last_name,
          ]
            .filter(Boolean)
            .join(' ')
            .trim();
          const dist = districts.find(
            x => String(x.id) === String(formData.district_id)
          );
          return {
            ...d,
            name: fullName || d.name,
            district: dist ? dist.name : d.district,
          };
        })
      );
      closeEditModal();
    } catch (err) {
      console.error('Failed to update user:', err);
      alert(err.response?.data?.error || 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  // ----- Badge generation / download -----
  const generate = async (all = false) => {
    setGenerating(true);
    try {
      await api.post('/delegates/badges/generate', {
        user_ids: all ? [] : selectedIds,
      });
      onUpdate?.();
      setSelectedIds([]);
      const res = await api.get('/users/');
      setDelegates(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadBadge = async userId => {
    try {
      const response = await api.get(
        `/delegates/badges/${userId}/download`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `badge_${userId}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download, The badge is not available.');
    }
  };

  // ----- Export helpers (unchanged) -----
  const exportToCSV = () => {
    const data = filteredData;
    if (!data.length) return;
    const headers = ['SN', 'Name', 'District', 'Approved'];
    const rows = data.map((d, idx) => [
      idx + 1 + currentPage * rowsPerPage,
      d.name,
      d.district || 'N/A',
      'Yes',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'delegates_badges.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

    let html = `<h2 style="text-align:center;margin-bottom:20px;">Delegates for Badges</h2>`;
    const data = paginate(filteredData);
    html += `<table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">`;
    html += `<thead><tr><th>SN</th><th>Name</th><th>District</th><th>Approved</th></tr></thead><tbody>`;
    data.forEach((d, idx) => {
      html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${
        d.name
      }</td><td>${d.district || 'N/A'}</td><td>Yes</td></tr>`;
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
      pdf.save('delegates_badges.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      document.body.removeChild(container);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow popups to print.');
      return;
    }
    let html = `<html><head><title>Delegates for Badges</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #999; padding: 8px; text-align: left; }
        th { background-color: #e9ecef; }
        h2 { text-align: center; }
      </style>
    </head><body>`;
    html += `<h2>Delegates for Badges</h2>`;
    const data = paginate(filteredData);
    html += `<table><thead><tr><th>SN</th><th>Name</th><th>District</th><th>Approved</th></tr></thead><tbody>`;
    data.forEach((d, idx) => {
      html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${
        d.name
      }</td><td>${d.district || 'N/A'}</td><td>Yes</td></tr>`;
    });
    html += `</tbody></table></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // ----- Skeleton helpers -----
  const renderSkeletonRows = (count = 5) => {
    return Array.from({ length: count }).map((_, idx) => (
      <tr key={idx} className="border-t border-gray-200/50 dark:border-gray-700/50">
        <td className="p-2">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </td>
        <td className="p-2"><Skeleton.Text width="w-6" /></td>
        <td className="p-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        </td>
        <td className="p-2"><Skeleton.Text width="w-32" /></td>
        <td className="p-2"><Skeleton.Text width="w-24" /></td>
        <td className="p-2"><Skeleton.Text width="w-20" /></td>
        <td className="p-2"><Skeleton.Text width="w-16" /></td>
      </tr>
    ));
  };

  const renderList = () => {
    if (loading) {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/20 dark:bg-gray-800/20">
                <th className="text-left p-2"><input type="checkbox" disabled /></th>
                <th className="text-left p-2">SN</th>
                <th className="text-left p-2">Photo</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">District</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>{renderSkeletonRows(rowsPerPage)}</tbody>
          </table>
        </div>
      );
    }
    const data = paginate(filteredData);
    const start = currentPage * rowsPerPage;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/20 dark:bg-gray-800/20">
              <th className="text-left p-2">
                <input
                  type="checkbox"
                  checked={
                    filteredData.length > 0 &&
                    selectedIds.length === filteredData.length
                  }
                  onChange={toggleAll}
                />
              </th>
              <th className="text-left p-2">SN</th>
              <th className="text-left p-2">Photo</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">District</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => {
              const imageUrl = d.profile_picture
                ? `${baseUrl}/users/${d.profile_picture}`
                : null;
              return (
                <tr
                  key={d.id}
                  className="border-t border-gray-200/50 dark:border-gray-700/50"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(d.id)}
                      onChange={() => toggleSelect(d.id)}
                    />
                  </td>
                  <td className="p-2">{start + idx + 1}</td>
                  <td className="p-2">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={d.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs">
                        {d.name?.[0] || '👤'}
                      </div>
                    )}
                  </td>
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.district || 'N/A'}</td>
                  <td className="p-2">
                    <span className="text-green-600">✓ Approved</span>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(d.id)}
                      className="text-amber-600 dark:text-amber-400 underline text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => downloadBadge(d.id)}
                      className="text-blue-600 dark:text-blue-400 underline text-sm"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="glass-card p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                <div>
                  <Skeleton.Text width="w-24" />
                  <Skeleton.Text width="w-20" />
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <Skeleton.Text width="w-20" />
                <Skeleton.Text width="w-16" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    const data = paginate(filteredData);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(d => {
          const imageUrl = d.profile_picture
            ? `${baseUrl}/users/${d.profile_picture}`
            : null;
          return (
            <div key={d.id} className="glass-card p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(d.id)}
                  onChange={() => toggleSelect(d.id)}
                />
                <div className="flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={d.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm">
                      {d.name?.[0] || '👤'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{d.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {d.district || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm">
                  <span className="text-green-600">✓ Approved</span>
                </span>
                <div className="space-x-3">
                  <button
                    onClick={() => openEditModal(d.id)}
                    className="text-amber-600 dark:text-amber-400 underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => downloadBadge(d.id)}
                    className="text-blue-600 dark:text-blue-400 underline text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPagination = data => {
    const total = totalPages(data);
    return (
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Rows per page:
          </span>
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
            onClick={() =>
              handlePageChange(Math.min(total - 1, currentPage + 1))
            }
            disabled={currentPage >= total - 1}
            className="glass-button text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading && !propDelegates) {
    return (
      <div className="glass-card p-4">
        <Skeleton.Text width="w-full" height="h-10" className="mb-4" />
        <Skeleton.Text width="w-full" height="h-10" className="mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton.Text key={i} width="w-full" height="h-8" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => generate(false)}
          disabled={selectedIds.length === 0 || generating}
          className="glass-button disabled:opacity-50"
        >
          Generate Selected ({selectedIds.length})
        </button>
        <button
          onClick={() => generate(true)}
          disabled={generating}
          className="glass-button bg-green-600/80 hover:bg-green-700/80 disabled:opacity-50"
        >
          Generate All
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="glass-input flex-1 min-w-[150px]"
        />
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={exportToCSV} className="glass-button text-sm">
            Export CSV
          </button>
          <button onClick={exportToPDF} className="glass-button text-sm">
            Export PDF
          </button>
          <button onClick={handlePrint} className="glass-button text-sm">
            Print
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="glass-button text-sm"
          >
            {viewMode === 'list' ? 'Grid View' : 'List View'}
          </button>
        </div>
      </div>

      <div className="glass-card p-4 max-h-96 overflow-y-auto">
        {viewMode === 'list' ? renderList() : renderGrid()}
        {!loading && renderPagination(filteredData)}
      </div>

      {/* ---------------- Edit Modal ---------------- */}
      {editingUserId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Edit User Details</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-xl leading-none"
                disabled={saving}
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {modalLoading || !formData ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton.Text key={i} width="w-full" height="h-8" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleFormChange}
                  />
                  <Field
                    label="Middle Name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleFormChange}
                  />
                  <Field
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleFormChange}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                  <Field
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                    ]}
                  />
                  <Field
                    label="District"
                    name="district_id"
                    value={formData.district_id}
                    onChange={handleFormChange}
                    options={districts.map(d => ({
                      value: d.id,
                      label: d.name,
                    }))}
                  />
                  <Field
                    label="Diet Preference"
                    name="diet_preference"
                    value={formData.diet_preference}
                    onChange={handleFormChange}
                  />
                  <Field
                    label="T-Shirt Size"
                    name="tshirt_size"
                    value={formData.tshirt_size}
                    onChange={handleFormChange}
                  />
                  <Field
                    label="T-Shirt Color"
                    name="tshirt_color"
                    value={formData.tshirt_color}
                    onChange={handleFormChange}
                  />

                  {/* ----- Officer Role (mirrors Register) ----- */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">
                      Officer Role
                    </label>
                    <select
                      name="officer_id"
                      value={formData.officer_id ?? ''}
                      onChange={handleFormChange}
                      className="glass-input w-full text-sm"
                    >
                      <option value="">-- Select Officer --</option>
                      {officers.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ----- Departments (mirrors Register) ----- */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-2 text-gray-600 dark:text-gray-300">
                      Departments
                    </label>
                    {departments.length === 0 ? (
                      <div className="glass-input w-full bg-gray-100 dark:bg-gray-700 animate-pulse h-20"></div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {departments.map(dept => {
                          const checked = (formData.department_ids || [])
                            .map(Number)
                            .includes(Number(dept.id));
                          return (
                            <label
                              key={dept.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                value={dept.id}
                                checked={checked}
                                onChange={() => handleDepartmentToggle(dept.id)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-gray-700 dark:text-gray-300 text-sm">
                                {dept.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="glass-button text-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="glass-button text-sm bg-blue-600/80 hover:bg-blue-700/80 disabled:opacity-50"
                disabled={saving || modalLoading || !formData}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeGenerator;