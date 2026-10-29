import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useTheme } from '../../contexts/ThemeContext';

const GUEST_TYPES = [
  { value: '', label: 'Select Guest Type' },
  { value: 'Delegate', label: 'Delegate' },
  { value: 'SZBU', label: 'SZBU – Southern Zambia Union Conference' },
  { value: 'Rusangu Conference', label: 'Rusangu Conference' },
  { value: 'Institution', label: 'Institution' },
  { value: 'Literature Evangelist', label: 'Literature Evangelist' },
  { value: 'Rusangu University', label: 'Rusangu University' },
  { value: 'Retirees', label: 'Retirees' },
  { value: 'Executive Committee', label: 'Executive Committee' },
  { value: 'Directors', label: 'Directors' },
  { value: 'District Pastors', label: 'District Pastors' },
  { value: 'Constitution Committee', label: 'Constitution Committee' },
  { value: 'Office Staff', label: 'Office Staff' },
  { value: 'Media', label: 'Media' },
  { value: 'Observers', label: 'Observers' },
];

const SUB_TYPES = [
  { value: '', label: 'Select Position' },
  { value: 'President', label: 'President' },
  { value: 'Executive Secretary', label: 'Executive Secretary' },
  { value: 'CFO', label: 'CFO' },
];

const DIET_OPTIONS = [
  { value: '', label: 'Select Diet Preference' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'non_vegetarian', label: 'Non‑Vegetarian' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'gluten_free', label: 'Gluten‑Free' },
  { value: 'dairy_free', label: 'Dairy‑Free' },
  { value: 'other', label: 'Other' },
];

const TSHIRT_SIZES = [
  { value: '', label: 'Select Size' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: '2XL', label: '2XL' },
  { value: '3XL', label: '3XL' },
  { value: '4XL', label: '4XL' },
  { value: '5XL', label: '5XL' },
];

const TSHIRT_COLORS = [
  { value: '', label: 'Select Color' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'gray', label: 'Gray' },
  { value: 'navy', label: 'Navy' },
  { value: 'maroon', label: 'Maroon' },
  { value: 'teal', label: 'Teal' },
];

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    phone: '',
    diet_preference: '',
    tshirt_size: '',
    tshirt_color: '',
    guest_type: 'other',
    district_id: '',
    entity_type: '',
    entity_sub_type: '',
    entity_details: '',
    department_ids: [],
    officer_id: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingOfficers, setLoadingOfficers] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users/districts')
      .then(res => { setDistricts(res.data); setLoadingDistricts(false); })
      .catch(() => { setDistricts([]); setLoadingDistricts(false); });
  }, []);

  useEffect(() => {
    api.get('/modules/departments')
      .then(res => { setDepartments(res.data); setLoadingDepartments(false); })
      .catch(() => { setDepartments([]); setLoadingDepartments(false); });
  }, []);

  useEffect(() => {
    api.get('/officials/officers')
      .then(res => { setOfficers(res.data); setLoadingOfficers(false); })
      .catch(() => { setOfficers([]); setLoadingOfficers(false); });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const deptId = parseInt(value);
      setFormData(prev => {
        const current = prev.department_ids || [];
        if (checked) return { ...prev, department_ids: [...current, deptId] };
        else return { ...prev, department_ids: current.filter(id => id !== deptId) };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validatePhone = (phone) => {
    //const phoneRegex = /^(\+?260|0)9\d{8}$/;
    //const phoneRegex = /^(?:\+260[\s-]?|0)(?:5|6|7|9)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}$/;
    const phoneRegex = /^(?:(?:\+260|0)(?:5|6|7|9)\d{8}|(?:\+260|0)(?:5|6|7|9)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{3})$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Phone number must be a valid Zambian number (e.g., 0977123456 or +260977123456)');
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      if (key === 'department_ids' && Array.isArray(formData[key])) {
        formData[key].forEach(id => payload.append('department_ids[]', id));
      } else {
        payload.append(key, formData[key]);
      }
    }
    if (profilePicture) {
      payload.append('profile_picture', profilePicture);
    }

    try {
      await api.post('/auth/register', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      //setSuccess(true);
      //setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const showSubType = ['SZBU', 'Rusangu Conference'].includes(formData.entity_type);
  const showEntityDetails = ['Institution', 'Media', 'Observers'].includes(formData.entity_type);
  const showDistrictDropdown = ['Delegate', 'District Pastors'].includes(formData.entity_type);
  const showDepartmentsChecklist = formData.entity_type === 'Directors';
  const showOfficersDropdown = formData.entity_type === 'Office Staff';
  const selectedOfficer = officers.find(o => o.id === parseInt(formData.officer_id));
  const isSecretary = selectedOfficer?.name === 'secretary';
  const showDepartmentsForSecretary = showOfficersDropdown && isSecretary;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full glass-card p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-sda-blue dark:text-sda-blue-light">Register</h2>

        {success && (
          <div className="bg-green-500/20 text-green-700 dark:text-green-300 p-2 rounded mb-4">
            Registration successful! Redirecting to login...
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-700 dark:text-red-300 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="sm:col-span-2">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="glass-input w-full" required />
          </div>

          {/* Password */}
          <div className="sm:col-span-2 relative">
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="glass-input w-full pr-10" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="sm:col-span-2 relative">
            <input type={showConfirmPassword ? 'text' : 'password'} name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} className="glass-input w-full pr-10" required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              {showConfirmPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>

          {/* Personal info */}
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="glass-input w-full" required />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="glass-input w-full" required />
          <input type="text" name="middle_name" placeholder="Middle Name (Optional)" value={formData.middle_name} onChange={handleChange} className="glass-input w-full" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="glass-input w-full" required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="tel" name="phone" placeholder="Phone (e.g., 0977123456)" value={formData.phone} onChange={handleChange} className="glass-input w-full" required />
          <select name="diet_preference" value={formData.diet_preference} onChange={handleChange} className="glass-input w-full">
            {DIET_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select name="tshirt_size" value={formData.tshirt_size} onChange={handleChange} className="glass-input w-full">
            {TSHIRT_SIZES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <select name="tshirt_color" value={formData.tshirt_color} onChange={handleChange} className="glass-input w-full">
            {TSHIRT_COLORS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>

          {/* Guest Type */}
          <div className="sm:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300">Guest Type</label>
            <select name="entity_type" value={formData.entity_type} onChange={handleChange} className="glass-input w-full" required>
              {GUEST_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* Sub-type */}
          {showSubType && (
            <div className="sm:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300">Position</label>
              <select name="entity_sub_type" value={formData.entity_sub_type} onChange={handleChange} className="glass-input w-full" required>
                {SUB_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          )}

          {/* Entity details */}
          {showEntityDetails && (
            <div className="sm:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300">
                {formData.entity_type === 'Institution' ? 'Institution Name' :
                 formData.entity_type === 'Media' ? 'Media Organization Name' :
                 'Organization Name'}
              </label>
              <input type="text" name="entity_details" placeholder={
                formData.entity_type === 'Institution' ? 'Enter institution name' :
                formData.entity_type === 'Media' ? 'Enter media organization name' :
                'Enter organization name'
              } value={formData.entity_details} onChange={handleChange} className="glass-input w-full" required />
            </div>
          )}

          {/* District dropdown */}
          {showDistrictDropdown && (
            <div className="sm:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300">District</label>
              {loadingDistricts ? (
                <div className="glass-input w-full bg-gray-100 dark:bg-gray-700 animate-pulse h-10"></div>
              ) : (
                <select name="district_id" value={formData.district_id} onChange={handleChange} className="glass-input w-full" required>
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              )}
            </div>
          )}

          {/* Departments checklist */}
          {showDepartmentsChecklist && (
            <div className="sm:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Departments (Select all that apply)</label>
              {loadingDepartments ? (
                <div className="glass-input w-full bg-gray-100 dark:bg-gray-700 animate-pulse h-20"></div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {departments.map(dept => (
                    <label key={dept.id} className="flex items-center space-x-2">
                      <input type="checkbox" value={dept.id} checked={formData.department_ids?.includes(dept.id)} onChange={handleChange} className="rounded border-gray-300" />
                      <span className="text-gray-700 dark:text-gray-300">{dept.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Officers dropdown */}
          {showOfficersDropdown && (
            <div className="sm:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300">Select Officer Role</label>
              {loadingOfficers ? (
                <div className="glass-input w-full bg-gray-100 dark:bg-gray-700 animate-pulse h-10"></div>
              ) : (
                <select name="officer_id" value={formData.officer_id} onChange={handleChange} className="glass-input w-full">
                  <option value="">Select Officer</option>
                  {officers.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              )}
            </div>
          )}

          {/* Departments for Secretary */}
          {showDepartmentsForSecretary && (
            <div className="sm:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Assign Secretary to Departments</label>
              {loadingDepartments ? (
                <div className="glass-input w-full bg-gray-100 dark:bg-gray-700 animate-pulse h-20"></div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {departments.map(dept => (
                    <label key={dept.id} className="flex items-center space-x-2">
                      <input type="checkbox" value={dept.id} checked={formData.department_ids?.includes(dept.id)} onChange={handleChange} className="rounded border-gray-300" />
                      <span className="text-gray-700 dark:text-gray-300">{dept.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Picture */}
          <div className="sm:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300">Profile Picture (Optional)</label>
            <div className="flex items-center space-x-4">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="glass-input w-full" />
              {previewUrl && (
                <div className="flex-shrink-0">
                  <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-sda-blue" />
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="glass-button w-full">Register</button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-sda-blue dark:text-sda-blue-light hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;