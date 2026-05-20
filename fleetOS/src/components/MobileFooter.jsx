import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Truck, Users, UserSquare2 } from 'lucide-react';

const tabs = [
  { label: 'Home', path: '/dashboard', icon: <Home size={20} /> },
  { label: 'Trips', path: '/allTrips', icon: <Truck size={20} /> },
  { label: 'Vehicles', path: '/allVehicles', icon: <Truck size={20} /> },
  { label: 'Owners', path: '/allOwners', icon: <Users size={20} /> },
  { label: 'Profile', path: '/profile', icon: <UserSquare2 size={20} /> },
];

const MobileFooter = ({ activeTab = 'Home' }) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="px-2 py-3 flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeTab === tab.label ? 'text-[#0f172a]' : 'text-gray-400'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileFooter;