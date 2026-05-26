import React, { useState, useEffect } from 'react';
import { 
  Building2, User, Phone, MapPin, Check, 
  RotateCcw, ShieldCheck, HelpCircle 
} from 'lucide-react';
import api from '../service/api';
import Sidebar from './Sidebar';
import MobileFooter from './MobileFooter';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    phone: '',
    state: '',
    city: ''
  });

  // Backup state to support "Cancel/Reset" functionality
  const [initialData, setInitialData] = useState({});

  // 1. Fetch current profile/account data on mount
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await api.get('/user/profile');
        const data = response.data;
        const profile = {
          companyName: data.companyName || '',
          name: data.name || '',
          phone: data.phone || '',
          state: data.state || '',
          city: data.city || ''
        };
        setFormData(profile);
        setInitialData(profile);
      } catch (err) {
        // console.error("Failed to fetch profile settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditable(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/user/profile/update', formData);
      setInitialData(formData); // Update backup reference
      setIsEditable(false);
    } catch (err) {
      alert("Settings save nahi ho payi. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Loading App Settings...</div>;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <Sidebar activeTab="Profile" />

      <div className="flex-1 flex flex-col pb-24 md:pb-0">
        {/* Dark Top Banner */}
        <header className="bg-[#0f172a] text-white p-6 md:p-10 pb-24">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
              <p className="text-gray-400 text-sm mt-1">Apni company ki details aur business profile manage karein.</p>
            </div>
            
            {!isEditable && (
              <button 
                onClick={() => setIsEditable(true)}
                className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:bg-gray-100 transition-all active:scale-95"
              >
                Edit Profile
              </button>
            )}
          </div>
        </header>

        {/* Settings Body Form */}
        <main className="max-w-4xl w-full mx-auto px-4 md:px-8 -mt-8 z-10 flex-1">
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Core Fields Card */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 md:p-8 space-y-6">
              <div className="border-b border-gray-50 pb-4">
                <h3 className="font-black text-gray-900 text-lg">Business Identity</h3>
                <p className="text-gray-400 text-xs mt-0.5">This information will reflect on your generated reports & ledger bills.</p>
              </div>

              {/* Company & Owner Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingsInput 
                  label="Company Name" icon={<Building2 size={16}/>} disabled={!isEditable} placeholder="e.g. Shri Ram Movers"
                  value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
                <SettingsInput 
                  label="Owner Name" icon={<User size={16}/>} disabled={!isEditable} placeholder="Yashit Jain"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Phone Number */}
              <SettingsInput 
                label="Registered Phone Number" icon={<Phone size={16}/>} disabled={!isEditable} placeholder="989012345" type="tel"
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />

              {/* Geography / Location Group */}
              <div className="pt-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Operating Location</label>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <SettingsInput 
                    label="City" icon={<MapPin size={16}/>} disabled={!isEditable} placeholder="e.g. New Delhi" bgWhite
                    value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                  <SettingsInput 
                    label="State" icon={<MapPin size={16}/>} disabled={!isEditable} placeholder="e.g. Delhi" bgWhite
                    value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                </div>
              </div>

              {/* Form Action Buttons (Visible only during edit mode) */}
              {isEditable && (
                <div className="flex gap-3 pt-4 border-t border-gray-50 animate-in fade-in duration-200">
                  <button 
                    type="button" onClick={handleCancel}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                  >
                    <RotateCcw size={16}/> Cancel
                  </button>
                  <button 
                    type="submit" disabled={saving}
                    className="flex-2 px-8 py-4 bg-[#0f172a] text-white font-black rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                  >
                    {saving ? "Saving..." : <><Check size={18}/> Save Info</>}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Informational/Subscription Cards */}
            <div className="space-y-4">
              {/* Account Status Meta Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SaaS Subscription</p>
                    <p className="text-sm font-black text-gray-800">FleetOS Pro Active</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-medium bg-slate-50 p-3 rounded-xl">
                  Aapki company details completely safe and cloud-synced hain.
                </div>
              </div>

              {/* Need Help Placeholder Card */}
              {/* <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-orange-400">
                  <HelpCircle size={18}/>
                  <h4 className="font-bold text-sm">Need Support?</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">GST Configuration ya multi-user settings add karne ke liye support team se baat karein.</p>
                <button type="button" className="text-xs font-black text-white bg-white/10 w-full py-2.5 rounded-xl hover:bg-white/20 transition-all">
                  Contact FleetOS Helpline
                </button>
              </div> */}
            </div>

          </form>
        </main>

        {/* Global Nav for Mobile */}
        <MobileFooter activeTab="Profile" />
      </div>
    </div>
  );
};

// Reusable, Custom-Styled Input Sub-component 
const SettingsInput = ({ label, icon, bgWhite, ...props }) => (
  <div className="w-full">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors">{icon}</span>
      <input 
        {...props}
        className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl font-bold text-sm transition-all outline-none text-gray-800 disabled:opacity-60 disabled:cursor-not-allowed ${
          bgWhite ? 'bg-white focus:bg-white' : 'bg-gray-50 focus:bg-white'
        } ${props.disabled ? 'border-gray-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
      />
    </div>
  </div>
);

export default Settings;