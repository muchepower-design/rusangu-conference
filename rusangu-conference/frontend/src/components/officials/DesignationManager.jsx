import React, { useState, useEffect, useMemo, useRef } from 'react';
import api from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DesignationManager = ({ officials, users, departments, districts, onUpdate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState('table');

  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [designation, setDesignation] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [deptIds, setDeptIds] = useState([]);
  const [pastorRole, setPastorRole] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [officerAssignmentType, setOfficerAssignmentType] = useState('');
  const [officerAssignmentTargets, setOfficerAssignmentTargets] = useState([]); // array of IDs

  const [designations, setDesignations] = useState([]);
  const [officers, setOfficers] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [desRes, offRes] = await Promise.all([
          api.get('/officials/designations'),
          api.get('/officials/officers')
        ]);
        setDesignations(desRes.data);
        setOfficers(offRes.data);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };
    fetchData();
  }, []);

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
    if (user.guest_type === 'district_pastor') return 'District Pastor';
    if (user.guest_type === 'other') return singularize(user.entity_type) || user.guest_type;
    return user.guest_type;
  };

  const getOfficialDisplay = (official) => {
    if (official.designation === 'district_pastor') return 'District Pastor';
    if (official.designation === 'executive_secretary') return 'Executive Secretary';
    if (official.designation === 'conference_official') return 'Conference Official';
    if (official.designation != 'executive_secretary' && official.designation != 'district_pastor' && official.designation != 'conference_official') return singularize(official.designation) || official.designation;
    return official.designation;
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.district && u.district.toLowerCase().includes(term))
    );
  }, [users, searchTerm]);

  const filteredOfficials = useMemo(() => {
    if (!searchTerm) return officials;
    const term = searchTerm.toLowerCase();
    return officials.filter(o =>
      o.user_name.toLowerCase().includes(term) ||
      (o.designation && o.designation.toLowerCase().includes(term)) ||
      (o.district && o.district.toLowerCase().includes(term))
    );
  }, [officials, searchTerm]);

  const paginate = (data) => {
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  };

  const totalPages = (data) => Math.ceil(data.length / rowsPerPage);
  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(0);
  };

  // -- Exports --

  const exportToCSV = (data, filename) => {
    if (!data.length) return;
    let headers, rows;
    if (activeTab === 'users') {
      headers = ['SN', 'Name', 'Email', 'Guest Type', 'District'];
      rows = data.map((u, idx) => [
        idx + 1 + currentPage * rowsPerPage,
        u.name,
        u.email,
        getGuestTypeDisplay(u),
        u.district || 'N/A'
      ]);
    } else {
      headers = ['SN', 'Name', 'Designation', 'District', 'Departments', 'Role / Assignment'];
      rows = data.map((o, idx) => {
        let roleDisplay = 'N/A';
        if (o.officer_assignments && o.officer_assignments.length > 0) {
          roleDisplay = o.officer_assignments.map(assign => {
            const role = assign.officer_role || 'Officer';
            const target = assign.assigned_to_name || 'Unknown';
            const type = assign.assigned_to_type === 'department' ? 'Dept' : 'Official';
            return `${role} → ${type}: ${target}`;
          }).join(' | ');
        } else if (o.role) {
          roleDisplay = o.role;
        } else if (o.pastor_role) {
          roleDisplay = o.pastor_role;
        }
        return [
          idx + 1 + currentPage * rowsPerPage,
          o.user_name,
          o.designation || 'N/A',
          o.district || 'N/A',
          o.departments.join(', ') || 'None',
          roleDisplay
        ];
      });
    }
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
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

    let html = `<h2 style="text-align:center;margin-bottom:20px;">${activeTab === 'users' ? 'All Users' : 'Current Officials'}</h2>`;
    if (activeTab === 'users') {
      const data = paginate(filteredUsers);
      html += `<table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">`;
      html += `<thead><tr><th>SN</th><th>Name</th><th>Email</th><th>Guest Type</th><th>District</th></tr></thead><tbody>`;
      data.forEach((u, idx) => {
        html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${u.name}</td><td>${u.email}</td><td>${getGuestTypeDisplay(u)}</td><td>${u.district || 'N/A'}</td></tr>`;
      });
      html += `</tbody></table>`;
    } else {
      const data = paginate(filteredOfficials);
      html += `<table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">`;
      html += `<thead><tr><th>SN</th><th>Name</th><th>Designation</th><th>District</th><th>Departments</th><th>Role / Assignment</th></tr></thead><tbody>`;
      data.forEach((o, idx) => {
        let roleDisplay = 'N/A';
        if (o.officer_assignments && o.officer_assignments.length > 0) {
          roleDisplay = o.officer_assignments.map(assign => {
            const role = assign.officer_role || 'Officer';
            const target = assign.assigned_to_name || 'Unknown';
            const type = assign.assigned_to_type === 'department' ? 'Dept' : 'Official';
            return `${role} → ${type}: ${target}`;
          }).join(' | ');
        } else if (o.role) {
          roleDisplay = o.role;
        } else if (o.pastor_role) {
          roleDisplay = o.pastor_role;
        }
        html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${o.user_name}</td><td>${o.designation || 'N/A'}</td><td>${o.district || 'N/A'}</td><td>${o.departments.join(', ') || 'None'}</td><td>${roleDisplay}</td></tr>`;
      });
      html += `</tbody></table>`;
    }
    container.innerHTML = html;

    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeTab === 'users' ? 'users' : 'officials'}.pdf`);
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

    let html = `<html><head><title>Print</title>
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

    html += `<h2>${activeTab === 'users' ? 'All Users' : 'Current Officials'}</h2>`;
    if (activeTab === 'users') {
      const data = paginate(filteredUsers);
      html += `<table><thead><tr><th>SN</th><th>Name</th><th>Email</th><th>Guest Type</th><th>District</th></tr></thead><tbody>`;
      data.forEach((u, idx) => {
        html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${u.name}</td><td>${u.email}</td><td>${getGuestTypeDisplay(u)}</td><td>${u.district || 'N/A'}</td></tr>`;
      });
      html += `</tbody></table>`;
    } else {
      const data = paginate(filteredOfficials);
      html += `<table><thead><tr><th>SN</th><th>Name</th><th>Designation</th><th>District</th><th>Departments</th><th>Role / Assignment</th></tr></thead><tbody>`;
      data.forEach((o, idx) => {
        let roleDisplay = 'N/A';
        if (o.officer_assignments && o.officer_assignments.length > 0) {
          roleDisplay = o.officer_assignments.map(assign => {
            const role = assign.officer_role || 'Officer';
            const target = assign.assigned_to_name || 'Unknown';
            const type = assign.assigned_to_type === 'department' ? 'Dept' : 'Official';
            return `${role} → ${type}: ${target}`;
          }).join(' | ');
        } else if (o.role) {
          roleDisplay = o.role;
        } else if (o.pastor_role) {
          roleDisplay = o.pastor_role;
        }
        html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${o.user_name}</td><td>${o.designation || 'N/A'}</td><td>${o.district || 'N/A'}</td><td>${o.departments.join(', ') || 'None'}</td><td>${roleDisplay}</td></tr>`;
      });
      html += `</tbody></table>`;
    }
    html += `</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleRemoveDesignation = async (userId) => {
    if (!window.confirm('Remove this designation?')) return;
    try {
      await api.delete(`/officials/${userId}/designation`);
      onUpdate();
    } catch (error) {
      alert('Failed to remove designation');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !designation) {
      alert('Please select a user and a designation');
      return;
    }
    try {
      const payload = {
        user_id: selectedUserId,
        designation_type: designation,
        district_id: designation === 'district_pastor' ? districtId : null,
        department_ids: deptIds,
        role: designation === 'pastor' ? pastorRole : null
      };
      await api.post('/officials/designate', payload);

      // If conference_official and secretary, create multiple assignments
      if (designation === 'conference_official' && selectedOfficerId) {
        const selectedOfficer = officers.find(o => o.id === parseInt(selectedOfficerId));
        if (selectedOfficer?.name === 'secretary' && officerAssignmentType && officerAssignmentTargets.length > 0) {
          // Send one POST per target
          for (const targetId of officerAssignmentTargets) {
            await api.post('/officials/officer-assignments', {
              user_id: parseInt(selectedUserId),
              officer_id: parseInt(selectedOfficerId),
              assigned_to_type: officerAssignmentType,
              assigned_to_id: parseInt(targetId),
              role: designation
            });
          }
        }
      }

      setShowModal(false);
      setSelectedUserId('');
      setDesignation('');
      setDistrictId('');
      setDeptIds([]);
      setPastorRole('');
      setSelectedOfficerId('');
      setOfficerAssignmentType('');
      setOfficerAssignmentTargets([]);
      onUpdate();
    } catch (error) {
      alert('Failed to assign designation');
    }
  };

  const handleDeptCheckboxChange = (deptId) => {
    setDeptIds(prev =>
      prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
    );
  };

  const handleTargetCheckboxChange = (targetId) => {
    setOfficerAssignmentTargets(prev =>
      prev.includes(targetId) ? prev.filter(id => id !== targetId) : [...prev, targetId]
    );
  };

  const handleSelectAllTargets = (targets) => {
    setOfficerAssignmentTargets(targets.map(t => t.id));
  };

  const handleDeselectAllTargets = () => {
    setOfficerAssignmentTargets([]);
  };

  const selectedOfficer = officers.find(o => o.id === parseInt(selectedOfficerId));
  const isSecretarySelected = selectedOfficer?.name === 'secretary';

  // --- Render functions ---

  const renderUsersTable = () => {
    const data = paginate(filteredUsers);
    const start = currentPage * rowsPerPage;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/20 dark:bg-gray-800/20">
              <th className="text-left p-2">SN</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Guest Type</th>
              <th className="text-left p-2">District</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u, idx) => (
              <tr key={u.id} className="border-t border-gray-200/50 dark:border-gray-700/50">
                <td className="p-2">{start + idx + 1}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{getGuestTypeDisplay(u)}</td>
                <td className="p-2">{u.district || 'N/A'}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setShowModal(true);
                    }}
                    className="glass-button text-sm"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUsersGrid = () => {
    const data = paginate(filteredUsers);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(u => (
          <div key={u.id} className="glass-card p-4">
            <h4 className="font-semibold">{u.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{u.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Guest: {getGuestTypeDisplay(u)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">District: {u.district || 'N/A'}</p>
            <button
              onClick={() => {
                setSelectedUserId(u.id);
                setShowModal(true);
              }}
              className="glass-button text-sm mt-2"
            >
              Assign
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderOfficialsTable = () => {
    const data = paginate(filteredOfficials);
    const start = currentPage * rowsPerPage;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/20 dark:bg-gray-800/20">
              <th className="text-left p-2">SN</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Designation</th>
              <th className="text-left p-2">District</th>
              <th className="text-left p-2">Departments</th>
              <th className="text-left p-2">Role / Assignment</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((o, idx) => {
              let roleDisplay = 'N/A';
              if (o.officer_assignments && o.officer_assignments.length > 0) {
                roleDisplay = o.officer_assignments.map(assign => {
                  const role = assign.officer_role || 'Officer';
                  const target = assign.assigned_to_name || 'Unknown';
                  const type = assign.assigned_to_type === 'department' ? 'Dept' : 'Official';
                  return `${role} → ${type}: ${target}`;
                }).join(' | ');
              } else if (o.role) {
                roleDisplay = o.role;
              } else if (o.pastor_role) {
                roleDisplay = o.pastor_role;
              }
              return (
                <tr key={o.user_id} className="border-t border-gray-200/50 dark:border-gray-700/50">
                  <td className="p-2">{start + idx + 1}</td>
                  <td className="p-2">{o.user_name}</td>
                  <td className="p-2">{getOfficialDisplay(o) || 'N/A'}</td>
                  <td className="p-2">{o.district || 'N/A'}</td>
                  <td className="p-2">{o.departments.join(', ') || 'None'}</td>
                  <td className="p-2">{roleDisplay}</td>
                  <td className="p-2">
                    {o.officer_assignments && o.officer_assignments.length > 0 ? (
                      o.officer_assignments.map(assign => (
                        <div key={assign.assignment_id} className="flex justify-between items-center">
                          <span>{assign.officer_role} → {assign.assigned_to_name}</span>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm('Remove this assignment?')) {
                                await api.delete(`/officials/officer-assignments/${assign.assignment_id}`);
                                onUpdate();
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-xs ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        onClick={() => handleRemoveDesignation(o.user_id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderOfficialsGrid = () => {
    const data = paginate(filteredOfficials);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(o => {
          let roleDisplay = 'N/A';
          if (o.officer_assignments && o.officer_assignments.length > 0) {
            roleDisplay = o.officer_assignments.map(assign => {
              const role = assign.officer_role || 'Officer';
              const target = assign.assigned_to_name || 'Unknown';
              const type = assign.assigned_to_type === 'department' ? 'Dept' : 'Official';
              return `${role} → ${type}: ${target}`;
            }).join(' | ');
          } else if (o.role) {
            roleDisplay = o.role;
          } else if (o.pastor_role) {
            roleDisplay = o.pastor_role;
          }
          return (
            <div key={o.user_id} className="glass-card p-4">
              <h4 className="font-semibold">{o.user_name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Designation: {getOfficialDisplay(o) || 'N/A'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">District: {o.district || 'N/A'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Departments: {o.departments.join(', ') || 'None'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Role: {roleDisplay}</p>
              <button
                onClick={() => handleRemoveDesignation(o.user_id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm mt-2"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    );
  };

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

  return (
    <div className="space-y-4">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto glass-card">
            <h2 className="text-2xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">Assign Designation</h2>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">User</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="glass-input w-full"
                  required
                >
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Designation</label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="glass-input w-full"
                  required
                >
                  <option value="">Select Designation</option>
                  {designations.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              {designation === 'district_pastor' && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">District</label>
                  <select
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="glass-input w-full"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {(designation === 'director' || designation === 'district_pastor') && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Departments</label>
                  <div className="grid grid-cols-2 gap-2">
                    {departments.map(dept => (
                      <label key={dept.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={deptIds.includes(dept.id)}
                          onChange={() => handleDeptCheckboxChange(dept.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{dept.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {designation === 'pastor' && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Role / Assignment</label>
                  <input
                    type="text"
                    value={pastorRole}
                    onChange={(e) => setPastorRole(e.target.value)}
                    className="glass-input w-full"
                    placeholder="e.g., Youth Pastor, Evangelist, etc."
                  />
                </div>
              )}

              {/* ====== Conference Official Section ====== */}
              {designation === 'conference_official' && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Select Officer</label>
                  <select
                    value={selectedOfficerId}
                    onChange={(e) => {
                      setSelectedOfficerId(e.target.value);
                      setOfficerAssignmentType('');
                      setOfficerAssignmentTargets([]);
                    }}
                    className="glass-input w-full"
                  >
                    <option value="">Select Officer</option>
                    {officers.map(o => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>

                  {/* Only show assignment fields if secretary is selected */}
                  {isSecretarySelected && (
                    <div className="mt-3 space-y-2">
                      <label className="block font-medium text-gray-700 dark:text-gray-300">Assign Secretary To</label>
                      <select
                        value={officerAssignmentType}
                        onChange={(e) => {
                          setOfficerAssignmentType(e.target.value);
                          setOfficerAssignmentTargets([]);
                        }}
                        className="glass-input w-full"
                      >
                        <option value="">Select Assignment Type</option>
                        <option value="official">To Official</option>
                        <option value="department">To Department</option>
                      </select>

                      {officerAssignmentType && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Select {officerAssignmentType === 'official' ? 'Officials' : 'Departments'}
                            </span>
                            <div className="space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const targets = officerAssignmentType === 'official' ? officials : departments;
                                  handleSelectAllTargets(targets);
                                }}
                                className="text-xs text-sda-blue hover:underline"
                              >
                                Select All
                              </button>
                              <button
                                type="button"
                                onClick={handleDeselectAllTargets}
                                className="text-xs text-red-600 hover:underline"
                              >
                                Deselect All
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                            {officerAssignmentType === 'official' &&
                              officials.map(off => (
                                <label key={off.official_id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={officerAssignmentTargets.includes(off.official_id)}
                                    onChange={() => handleTargetCheckboxChange(off.official_id)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {off.user_name} ({off.designation})
                                  </span>
                                </label>
                              ))}
                            {officerAssignmentType === 'department' &&
                              departments.map(dept => (
                                <label key={dept.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={officerAssignmentTargets.includes(dept.id)}
                                    onChange={() => handleTargetCheckboxChange(dept.id)}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {dept.name}
                                  </span>
                                </label>
                              ))}
                          </div>
                          {officerAssignmentTargets.length > 0 && (
                            <p className="text-xs text-gray-500 mt-2">
                              {officerAssignmentTargets.length} selected
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* ====== END Conference Official Section ====== */}

              <div className="flex space-x-4">
                <button type="submit" className="glass-button">Assign</button>
                <button type="button" onClick={() => setShowModal(false)} className="glass-button bg-gray-500/80 hover:bg-gray-600/80">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-sda-blue dark:text-sda-blue-light">Manage Officials</h2>
        <button
          onClick={() => { setSelectedUserId(''); setShowModal(true); }}
          className="glass-button"
        >
          + Assign New Official
        </button>
      </div>

      {/* Tabs */}
      <div className="glass p-2 rounded-xl flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveTab('users'); setCurrentPage(0); }}
          className={`py-2 px-4 rounded-lg transition ${
            activeTab === 'users'
              ? 'bg-sda-blue text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => { setActiveTab('officials'); setCurrentPage(0); }}
          className={`py-2 px-4 rounded-lg transition ${
            activeTab === 'officials'
              ? 'bg-sda-blue text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20'
          }`}
        >
          Current Officials
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
          className="glass-input flex-1 min-w-[150px]"
        />
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => {
              const data = activeTab === 'users' ? filteredUsers : filteredOfficials;
              exportToCSV(data, activeTab === 'users' ? 'users' : 'officials');
            }}
            className="glass-button text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="glass-button text-sm"
          >
            Export PDF
          </button>
          <button
            onClick={handlePrint}
            className="glass-button text-sm"
          >
            Print
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            className="glass-button text-sm"
          >
            {viewMode === 'table' ? 'Grid View' : 'Table View'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="glass-card p-4">
        <div ref={tableRef}>
          {activeTab === 'users' && (
            <>
              {viewMode === 'table' ? renderUsersTable() : renderUsersGrid()}
              {renderPagination(filteredUsers)}
            </>
          )}
          {activeTab === 'officials' && (
            <>
              {viewMode === 'table' ? renderOfficialsTable() : renderOfficialsGrid()}
              {renderPagination(filteredOfficials)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignationManager;