import React, { useState, useEffect } from 'react';
import { Search, Truck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api';
import Sidebar from './Sidebar';
import MobileFooter from './MobileFooter'; // 💡 Added missing import

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // Added missing search filter state
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/vehicle/') 
      .then(res => {
        // Guard against non-array structures from backend response arrays
        setVehicles(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        // console.error("Trucks load failed:", err)
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter vehicles dynamically based on search query text entry
  const filteredVehicles = vehicles?.filter(v => 
    v.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f172a] md:bg-[#f1f5f9] pb-24 md:pb-8 flex flex-col md:flex-row">
      <Sidebar activeTab="Vehicles" />
      
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <header className="p-6 flex justify-between items-center text-white md:text-gray-900">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-400 md:text-gray-500 text-sm hover:text-white md:hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Wapas
          </button>
          <h1 className="text-2xl font-black flex items-center gap-2">Trucks 🚛</h1>
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all active:scale-95" 
            onClick={() => navigate('/addVehicle')}
          >
            + Add
          </button>
        </header>

        {/* Inner Search & Content Card */}
        <div className="flex-1 bg-white rounded-t-[40px] md:rounded-3xl p-6 min-h-[80vh] md:mx-6 md:mb-6 shadow-sm">
          {/* Active Search Field */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Truck number se dhundo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm text-gray-800" 
            />
          </div>

          {/* Conditional Loader / Grid Layout */}
          {loading ? (
            <div className="text-center py-20 font-bold text-gray-400 animate-pulse italic">Loading Trucks...</div>
          ) : (
            <div className="space-y-3">
              {filteredVehicles?.map(v => (
                <div 
                  key={v.id} 
                  className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-gray-200 transition-all cursor-pointer">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <Truck size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base uppercase tracking-tight">{v.vehicleNumber}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                      Owner: <span className="text-gray-700 font-bold">{v.ownerName || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              ))}

              {filteredVehicles?.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-bold italic">
                  Koi truck nahi mila.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Global Bottom Sheet Navigation on mobile devices */}
      <MobileFooter activeTab="Vehicles" />
    </div>
  );
};

export default VehicleList;