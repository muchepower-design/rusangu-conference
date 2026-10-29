import React from 'react';

const ReportList = ({ reports }) => {
  if (!reports.length) return <p className="text-gray-500 dark:text-gray-400">No reports found.</p>;
  return (
    <div className="space-y-2">
      {reports.map(r => (
        <div key={r.id} className="glass p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-800 dark:text-gray-200">{r.report_type} - Q{r.quarter} {r.year}</span>
            <span className={`px-2 py-1 text-xs rounded ${
              r.status === 'submitted' ? 'bg-yellow-200/70 dark:bg-yellow-800/70 text-yellow-800 dark:text-yellow-200' :
              r.status === 'approved' ? 'bg-green-200/70 dark:bg-green-800/70 text-green-800 dark:text-green-200' :
              r.status === 'rejected' ? 'bg-red-200/70 dark:bg-red-800/70 text-red-800 dark:text-red-200' :
              'bg-gray-200/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200'
            }`}>
              {r.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">District: {r.district}</div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;