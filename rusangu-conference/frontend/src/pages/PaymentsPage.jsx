import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';
import Skeleton from '../components/common/Skeleton';
import { useTheme } from '../contexts/ThemeContext';

const PaymentsPage = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ category_id: '', amount: '', reference: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mobile money state
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [depositId, setDepositId] = useState(null);
  const [pollStatus, setPollStatus] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [momoError, setMomoError] = useState('');
  const pollingRef = useRef(null);

  // Provider logos
  const providerLogos = {
    'AIRTEL_OAPI_ZMB': '/momo/logos/momo_airtel.png',
    'MTN_MOMO_ZMB': '/momo/logos/momo_mtn.png',
    'ZAMTEL_ZMB': '/momo/logos/momo_zamtel.jpg',
  };
  const providerNames = {
    'AIRTEL_OAPI_ZMB': 'Airtel Money',
    'MTN_MOMO_ZMB': 'MTN Mobile Money',
    'ZAMTEL_ZMB': 'Zamtel Money',
  };

  useEffect(() => {
    fetchData();
    fetchProviders();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, transRes] = await Promise.all([
        api.get('/payments/categories'),
        api.get('/payments/transactions'),
      ]);
      setCategories(catRes.data);
      setTransactions(transRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await api.get('/payments/providers');
      setProviders(res.data);
    } catch (err) {
      console.error('Failed to fetch providers', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (error) setError('');
    if (momoError) setMomoError('');
    if (success) setSuccess('');
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 10) input = input.slice(0, 10);
    if (input.length > 0 && input[0] !== '0') return;
    setPhoneNumber(input);
    if (momoError) setMomoError('');
    if (error) setError('');
  };

  const isValidPhone = /^0\d{9}$/.test(phoneNumber);

  const resetForm = () => {
    setFormData({ category_id: '', amount: '', reference: '' });
    setSelectedProvider('');
    setPhoneNumber('');
    setError('');
    setSuccess('');
    setMomoError('');
    setPollStatus(null);
    setDepositId(null);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setMomoError('');
    // If mobile money provider is selected, use that flow
    if (selectedProvider) {
      await handleMobileMoneySubmit(e);
      return;
    }
    // Otherwise, regular transaction (as before)
    if (!formData.category_id || !formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please select a category and enter a valid amount');
      return;
    }
    try {
      await api.post('/payments/transactions', formData);
      setSuccess('Payment recorded successfully');
      setFormData({ category_id: '', amount: '', reference: '' });
      fetchData();
      // Auto-clear success after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    }
  };

  const handleMobileMoneySubmit = async (e) => {
    e.preventDefault();
    setMomoError('');
    if (!selectedProvider) {
      setMomoError('Please select a mobile money provider');
      return;
    }
    if (!isValidPhone) {
      setMomoError('Please enter a valid 10-digit phone number starting with 0');
      return;
    }
    if (!formData.category_id || !formData.amount || parseFloat(formData.amount) <= 0) {
      setMomoError('Please select a category and enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        category_id: parseInt(formData.category_id),
        amount: parseFloat(formData.amount),
        provider: selectedProvider,
        phone_number: phoneNumber,
        reference: formData.reference || '',
      };
      const res = await api.post('/payments/deposit', payload);
      if (res.data.success) {
        setSuccess('Payment request sent. Check your phone to approve.');
        startPolling(res.data.deposit_id);
      } else {
        setMomoError(res.data.failure_reason || 'Payment initiation failed');
      }
    } catch (err) {
      setMomoError(err.response?.data?.failure_reason || 'Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  const startPolling = (depId) => {
    setDepositId(depId);
    setPollStatus('WAITING');
    let attempts = 0;
    pollingRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await api.get(`/payments/deposit/${depId}/check`);
        const data = res.data;
        if (data.status === 'COMPLETED') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setPollStatus('COMPLETED');
          setSuccess('Payment completed successfully!');
          fetchData();
          // Reset form after success
          setTimeout(() => {
            resetForm();
          }, 3000);
        } else if (data.status === 'FAILED') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setPollStatus('FAILED');
          setMomoError(data.failure_reason || 'Payment failed. Please try again.');
        } else if (attempts > 20) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setPollStatus('FAILED');
          setMomoError('Payment timed out. Please try again.');
        }
      } catch (err) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        setPollStatus('FAILED');
        setMomoError('Error checking payment status');
      }
    }, 5000);
  };

  const cancelPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setPollStatus(null);
    setDepositId(null);
    setMomoError('');
    setSuccess('');
    setProcessing(false);
  };

  const dismissMessage = (type) => {
    if (type === 'success') setSuccess('');
    else if (type === 'error') setError('');
    else if (type === 'momoError') setMomoError('');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <Skeleton.Form fields={3} />
        <Skeleton.Table rows={3} cols={4} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-sda-blue dark:text-sda-blue-light">Payments</h1>

      <div className="glass-card mb-6">
        <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
        
        {success && (
          <div className="bg-green-500/20 text-green-700 dark:text-green-300 p-3 rounded mb-4 flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => dismissMessage('success')} className="text-green-700 dark:text-green-300 hover:text-green-900">
              ✕
            </button>
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-700 dark:text-red-300 p-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => dismissMessage('error')} className="text-red-700 dark:text-red-300 hover:text-red-900">
              ✕
            </button>
          </div>
        )}
        {momoError && (
          <div className="bg-red-500/20 text-red-700 dark:text-red-300 p-3 rounded mb-4 flex justify-between items-center">
            <span>{momoError}</span>
            <button onClick={() => dismissMessage('momoError')} className="text-red-700 dark:text-red-300 hover:text-red-900">
              ✕
            </button>
          </div>
        )}

        {pollStatus === 'WAITING' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center mb-4 relative">
            <button
              onClick={cancelPolling}
              className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
              aria-label="Cancel payment"
            >
              ✕
            </button>
            <svg className="animate-spin h-8 w-8 text-sda-blue mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-lg font-bold text-blue-800">Waiting for Payment</h3>
            <p className="text-blue-600 mt-1">Please check your phone and enter your Mobile Money PIN to approve.</p>
            <button
              onClick={cancelPolling}
              className="mt-3 glass-button bg-red-500/80 hover:bg-red-600/80 text-sm"
            >
              Cancel Payment
            </button>
          </div>
        )}

        {pollStatus === 'COMPLETED' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-4 relative">
            <button
              onClick={() => { setPollStatus(null); setSuccess(''); resetForm(); }}
              className="absolute top-2 right-2 text-green-600 hover:text-green-800"
              aria-label="Dismiss"
            >
              ✕
            </button>
            <span className="text-4xl">✅</span>
            <h3 className="text-lg font-bold text-green-800 mt-2">Payment Complete!</h3>
            <button
              onClick={() => { setPollStatus(null); setSuccess(''); resetForm(); }}
              className="mt-3 glass-button"
            >
              Make Another Payment
            </button>
          </div>
        )}

        {pollStatus === 'FAILED' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-4 relative">
            <button
              onClick={() => { setPollStatus(null); setMomoError(''); resetForm(); }}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              aria-label="Dismiss"
            >
              ✕
            </button>
            <span className="text-4xl">❌</span>
            <h3 className="text-lg font-bold text-red-800 mt-2">Payment Failed</h3>
            <p className="text-red-600">{momoError || 'Transaction could not be completed.'}</p>
            <button
              onClick={() => { setPollStatus(null); setMomoError(''); resetForm(); }}
              className="glass-button mt-4"
            >
              Try Again
            </button>
          </div>
        )}

        {!pollStatus && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Payment Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="glass-input w-full"
                required
              >
                <option value="">Select Category</option>
                {categories
                .filter(c => c.is_active === true)
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Amount (ZMW)</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="glass-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Reference (Optional)</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="glass-input w-full"
              />
            </div>

            {/* Mobile Money Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Pay with Mobile Money</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Provider</label>
                  <div className="grid grid-cols-3 gap-3">
                    {providers.map(prov => (
                      <button
                        key={prov.provider}
                        type="button"
                        disabled={!prov.deposit_operational}
                        onClick={() => {
                          setSelectedProvider(prov.provider);
                          if (momoError) setMomoError('');
                          if (error) setError('');
                        }}
                        className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${
                          !prov.deposit_operational
                            ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                            : selectedProvider === prov.provider
                              ? 'border-sda-blue bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {providerLogos[prov.provider] ? (
                          <img
                            src={providerLogos[prov.provider]}
                            alt={providerNames[prov.provider] || prov.provider}
                            className="w-16 h-10 object-contain"
                          />
                        ) : (
                          <span className="text-4xl">📱</span>
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {providerNames[prov.provider] || prov.provider}
                        </span>
                        {!prov.deposit_operational && (
                          <span className="text-xs text-red-500">Unavailable</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Money Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="0xxxxxxxxx (10 digits)"
                    maxLength={10}
                    className="glass-input w-full"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="glass-button w-full" disabled={processing}>
              {processing ? 'Processing...' : 'Submit Payment'}
            </button>
          </form>
        )}
      </div>

      <div className="glass-card">
        <h2 className="text-xl font-semibold mb-4">My Payment History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/20 dark:bg-gray-800/20">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Reference</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-t border-gray-200/50 dark:border-gray-700/50">
                    <td className="p-2">{new Date(t.payment_date).toLocaleDateString()}</td>
                    <td className="p-2">{t.category}</td>
                    <td className="p-2">ZMW {parseFloat(t.amount).toFixed(2)}</td>
                    <td className="p-2">{t.reference || '—'}</td>
                    <td className="p-2 capitalize">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;