import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Skeleton from '../common/Skeleton'; // adjust path if needed

const AttendanceManager = ({ delegates: propDelegates, onUpdate }) => {
  const { user } = useAuth();
  const designations = user?.designations || [];
  const isAdmin = user?.modules?.includes('admin');
  const isPresident = designations.includes('president');
  const isExecSecretary = designations.includes('executive_secretary');
  const canMark = isAdmin || isPresident || isExecSecretary;

  // Local state for delegates (fetched fresh on mount)
  const [delegates, setDelegates] = useState(propDelegates || []);
  const [delegatesLoading, setDelegatesLoading] = useState(!propDelegates);

  const [selectedUser, setSelectedUser] = useState('');
  const [status, setStatus] = useState('present');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('present');
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState('table');
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch delegates if not provided as prop (or always fetch fresh)
  useEffect(() => {
    const fetchDelegates = async () => {
      setDelegatesLoading(true);
      try {
        // Adjust endpoint to fetch all delegates (approved or pending)
        //const res = await api.get('/users?guest_type=delegate'); // example
        const res = await api.get('/users/'); // example
        setDelegates(res.data);
      } catch (error) {
        console.error('Failed to fetch delegates:', error);
        // fallback to prop if available
        if (propDelegates) setDelegates(propDelegates);
      } finally {
        setDelegatesLoading(false);
      }
    };
    // If prop is provided, we can use it, but still fetch to refresh?
    // To always fetch fresh, we call fetchDelegates even if prop exists.
    fetchDelegates();
  }, [propDelegates]); // re-fetch if prop changes

  // Only show approved delegates (with module)
  const approvedDelegates = useMemo(() => {
    return delegates.filter(d => d.modules && d.modules.includes('session_meetings_delegate'));
  }, [delegates]);

  // Fetch attendance when date changes
  useEffect(() => {
    const fetchAttendance = async () => {
      setAttendanceLoading(true);
      try {
        const res = await api.get(`/delegates/attendance/all?date=${date}`);
        setAttendanceData(res.data);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      } finally {
        setAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, [date]);

  const getAttendanceStatus = (userId) => {
    const record = attendanceData.find(d => d.id === userId);
    return record ? record.attendance : 'not_recorded';
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return approvedDelegates;
    const term = searchTerm.toLowerCase();
    return approvedDelegates.filter(d =>
      d.name.toLowerCase().includes(term) ||
      (d.district && d.district.toLowerCase().includes(term))
    );
  }, [approvedDelegates, searchTerm]);

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

  const markAttendance = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.post('/delegates/attendance', { user_id: selectedUser, session_date: date, status });
      onUpdate?.();
      const res = await api.get(`/delegates/attendance/all?date=${date}`);
      setAttendanceData(res.data);
      setSelectedUser('');
    } catch (error) {
      console.error(error);
    }
  };

  const bulkMarkAttendance = async () => {
    if (!selectedIds.length) return;
    try {
      await Promise.all(selectedIds.map(id =>
        api.post('/delegates/attendance', { user_id: id, session_date: date, status: bulkStatus })
      ));
      setSelectedIds([]);
      onUpdate?.();
      const res = await api.get(`/delegates/attendance/all?date=${date}`);
      setAttendanceData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSelect = (id) => {
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

  // Export functions unchanged (they use getAttendanceStatus)
  const exportToCSV = () => {
    const data = filteredData;
    if (!data.length) return;
    const headers = ['SN', 'Name', 'District', 'Attendance Status'];
    const rows = data.map((d, idx) => [
      idx + 1 + currentPage * rowsPerPage,
      d.name,
      d.district || 'N/A',
      getAttendanceStatus(d.id)
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
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

    let html = `<h2 style="text-align:center;margin-bottom:20px;">Attendance - ${date}</h2>`;
    const data = paginate(filteredData);
    html += `<table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">`;
    html += `<thead><tr><th>SN</th><th>Name</th><th>District</th><th>Status</th></tr></thead><tbody>`;
    data.forEach((d, idx) => {
      html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${d.name}</td><td>${d.district || 'N/A'}</td><td>${getAttendanceStatus(d.id)}</td></tr>`;
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
      pdf.save('attendance.pdf');
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

    let html = `<html><head><title>Attendance - ${date}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #999; padding: 8px; text-align: left; }
        th { background-color: #e9ecef; }
        h2 { text-align: center; }
      </style>
    </head><body>`;
    html += `<h2>Attendance - ${date}</h2>`;
    const data = paginate(filteredData);
    html += `<table><thead><tr><th>SN</th><th>Name</th><th>District</th><th>Status</th></tr></thead><tbody>`;
    data.forEach((d, idx) => {
      html += `<tr><td>${idx + 1 + currentPage * rowsPerPage}</td><td>${d.name}</td><td>${d.district || 'N/A'}</td><td>${getAttendanceStatus(d.id)}</td></tr>`;
    });
    html += `</tbody></table></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Render skeleton for table rows
  const renderSkeletonRows = (count = 5) => {
    return Array.from({ length: count }).map((_, idx) => (
      <tr key={idx} className="border-t border-gray-200/50 dark:border-gray-700/50">
        <td className="p-2"><div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div></td>
        <td className="p-2"><Skeleton.Text width="w-6" /></td>
        <td className="p-2"><div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div></td>
        <td className="p-2"><Skeleton.Text width="w-32" /></td>
        <td className="p-2"><Skeleton.Text width="w-24" /></td>
        <td className="p-2"><Skeleton.Text width="w-20" /></td>
      </tr>
    ));
  };

  const renderTable = () => {
    if (attendanceLoading || delegatesLoading) {
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
              </tr>
            </thead>
            <tbody>{renderSkeletonRows(rowsPerPage)}</tbody>
          </table>
        </div>
      );
    }
    const data = paginate(filteredData);
   // console.log("Data = ", data);
    const start = currentPage * rowsPerPage;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/20 dark:bg-gray-800/20">
              <th className="text-left p-2"><input type="checkbox" checked={selectedIds.length === filteredData.length} onChange={toggleAll} /></th>
              <th className="text-left p-2">SN</th>
              <th className="text-left p-2">Photo</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">District</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => {
              const imageUrl = d.profile_picture ? `${baseUrl}/users/${d.profile_picture}` : null;
              const status = getAttendanceStatus(d.id);
              return (
                <tr key={d.id} className="border-t border-gray-200/50 dark:border-gray-700/50">
                  <td className="p-2"><input type="checkbox" checked={selectedIds.includes(d.id)} onChange={() => toggleSelect(d.id)} /></td>
                  <td className="p-2">{start + idx + 1}</td>
                  <td className="p-2">
                    {imageUrl ? (
                      <img src={imageUrl} alt={d.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs">{d.name?.[0] || '👤'}</div>
                    )}
                  </td>
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.district || 'N/A'}</td>
                  <td className="p-2">{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGrid = () => {
    if (attendanceLoading || delegatesLoading) {
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
              <div className="mt-2"><Skeleton.Text width="w-32" /></div>
            </div>
          ))}
        </div>
      );
    }
    const data = paginate(filteredData);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(d => {
          const imageUrl = d.profile_picture ? `${baseUrl}/users/${d.profile_picture}` : null;
          const status = getAttendanceStatus(d.id);
          return (
            <div key={d.id} className="glass-card p-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" checked={selectedIds.includes(d.id)} onChange={() => toggleSelect(d.id)} />
                {imageUrl ? (
                  <img src={imageUrl} alt={d.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm">{d.name?.[0] || '👤'}</div>
                )}
                <div>
                  <h4 className="font-semibold">{d.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{d.district || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-2 text-sm">Status: {status}</div>
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
          <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="glass-input py-1 px-2 text-sm">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => handlePageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="glass-button text-sm disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-600 dark:text-gray-400">Page {currentPage + 1} of {total || 1}</span>
          <button onClick={() => handlePageChange(Math.min(total - 1, currentPage + 1))} disabled={currentPage >= total - 1} className="glass-button text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    );
  };

  // If delegates are loading, show a simpler skeleton
  if (delegatesLoading && !propDelegates) {
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
      {canMark && (
        <>
          <form onSubmit={markAttendance} className="glass-card grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="glass-input" required>
              <option value="">Select Delegate</option>
              {delegates.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" required />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="glass-input">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
            <button type="submit" className="glass-button">Mark Attendance</button>
          </form>

          {selectedIds.length > 0 && (
            <div className="flex gap-2 mb-4">
              <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className="glass-input">
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
              <button onClick={bulkMarkAttendance} className="glass-button">Mark Selected ({selectedIds.length})</button>
            </div>
          )}
        </>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }} className="glass-input flex-1 min-w-[150px]" />
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={exportToCSV} className="glass-button text-sm">Export CSV</button>
          <button onClick={exportToPDF} className="glass-button text-sm">Export PDF</button>
          <button onClick={handlePrint} className="glass-button text-sm">Print</button>
          <button onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')} className="glass-button text-sm">
            {viewMode === 'table' ? 'Grid View' : 'Table View'}
          </button>
        </div>
      </div>

      <div className="glass-card p-4">
        {viewMode === 'table' ? renderTable() : renderGrid()}
        {!attendanceLoading && !delegatesLoading && renderPagination(filteredData)}
      </div>
    </div>
  );
};

export default AttendanceManager;