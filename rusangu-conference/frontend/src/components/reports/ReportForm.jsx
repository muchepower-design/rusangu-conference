import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import reportSchemas from './reportSchemas';

const ReportForm = ({ reportType, initialData, onSubmit }) => {
  const { user } = useAuth();
  const [districts, setDistricts] = useState([]);
  const schema = reportSchemas[reportType];
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ defaultValues: initialData || {} });

  // Fetch districts for dropdown
  useEffect(() => {
    api.get('/users/districts')
      .then(res => setDistricts(res.data))
      .catch(err => console.error('Failed to fetch districts:', err));
  }, []);

  // Auto-fill prepared_by and reported_by with user's name
  useEffect(() => {
    if (user) {
      const fullName = `${user.first_name} ${user.last_name}`;
      schema.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.type === 'auto_name') {
            setValue(field.name, fullName);
          }
        });
      });
    }
  }, [user, schema, setValue]);

  const renderField = (field) => {
    // Enhanced common class with better styling
    const commonClass = 'glass-input w-full transition-all duration-200 focus:ring-2 focus:ring-sda-blue-light focus:border-transparent hover:shadow-md';
    const errorClass = errors[field.name] ? 'border-red-500 ring-2 ring-red-500/50' : '';

    switch (field.type) {
      case 'district_select':
        return (
          <select
            {...register(field.name, { required: field.required })}
            className={`${commonClass} ${errorClass}`}
            required={field.required}
          >
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            {...register(field.name, { required: field.required, valueAsNumber: true })}
            className={`${commonClass} ${errorClass}`}
            placeholder={field.placeholder || ''}
            required={field.required}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            {...register(field.name, { required: field.required })}
            className={`${commonClass} ${errorClass}`}
            placeholder={field.placeholder || ''}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...register(field.name, { required: field.required })}
            className={`${commonClass} ${errorClass} min-h-[80px]`}
            rows="3"
            placeholder={field.placeholder || ''}
            required={field.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            {...register(field.name, { required: field.required })}
            className={`${commonClass} ${errorClass}`}
            required={field.required}
          />
        );

      case 'auto_name':
        return (
          <input
            type="text"
            {...register(field.name, { required: field.required })}
            className={`${commonClass} ${errorClass} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`}
            readOnly
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  if (!schema) {
    return <div className="text-center text-red-500">Report schema not found for type: {reportType}</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {schema.sections.map((section, idx) => (
        <div key={idx} className="glass-card">
          <h3 className="text-lg font-semibold text-sda-blue dark:text-sda-blue-light mb-4 border-b border-sda-blue/20 dark:border-sda-blue-light/20 pb-2">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field, fidx) => (
              <div key={fidx} className={field.type === 'textarea' || field.type === 'auto_name' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.name] && (
                  <span className="text-red-500 text-sm">This field is required</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="submit" className="glass-button w-full md:w-auto">Submit Report</button>
    </form>
  );
};

export default ReportForm;