import React from 'react';

const ReportReview = ({ reports, onReview }) => {
  const pending = reports.filter(r => r.status === 'submitted' || r.status === 'reviewed');
  if (!pending.length) return <p className="text-gray-500 dark:text-gray-400">No pending reports for review.</p>;

  return (
    <div className="space-y-2">
      {pending.map(r => (
        <div key={r.id} className="glass p-3 rounded-lg flex flex-wrap justify-between items-center">
          <div>
            <span className="font-medium text-gray-800 dark:text-gray-200">{r.report_type} - {r.district}</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Q{r.quarter} {r.year}</span>
          </div>
          <div className="space-x-2 mt-2 sm:mt-0">
            <button onClick={() => onReview(r.id, 'approved')} className="glass-button bg-green-600/80 hover:bg-green-700/80 text-sm">Approve</button>
            <button onClick={() => onReview(r.id, 'rejected')} className="glass-button bg-red-600/80 hover:bg-red-700/80 text-sm">Reject</button>
            <button onClick={() => onReview(r.id, 'reviewed')} className="glass-button bg-blue-600/80 hover:bg-blue-700/80 text-sm">Review</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportReview;