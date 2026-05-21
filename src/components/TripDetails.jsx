import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Truck, User, Fuel, Wrench, Plus, 
  CheckCircle2, Receipt, ChevronRight 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/api'; 
import Sidebar from './Sidebar';
import MobileFooter from './MobileFooter';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchTripDetails = useCallback(async () => {
    if (!tripId || tripId === 'undefined') return;
    try {
      setLoading(true);
      const response = await api.get(`/trip/${tripId}`);
      setTrip(response.data);
      setExpenses(response.data.expenseList || []);
    } catch (err) {
      console.error("Failed to fetch trip details:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  const handleAddExpense = (id) => navigate(`/trip/${id}/add-expense`);
  const handleEditExpense = (expenseId, id) => navigate(`/trip/${id}/expense/edit/${expenseId}`); 

  const handleCompleteTrip = async (id) => {
    try {
      await api.patch(`/trip/status/${id}/close`);
      fetchTripDetails(); 
    } catch (err) {
      alert("Status update failed");
    }
  };

  const handleStartTrip = async (id) => {
    try {
      await api.patch(`/trip/status/${id}/start`);
      fetchTripDetails(); 
    } catch (err) {
      alert("Status update failed");
    }
  };

  const kharche = expenses.map(exp => {
    let config = { label: 'Other', icon: <Receipt className="text-gray-400" /> };
    if (exp.expenseType === 'DIESEL') config = { label: 'Fuel', icon: <Fuel className="text-red-500" /> };
    else if (exp.expenseType === 'DRIVER') config = { label: 'Driver', icon: <User className="text-purple-500" /> };
    else if (exp.expenseType === 'OTHER' || exp.expenseType === 'REPAIR') config = { label: 'Repair', icon: <Wrench className="text-pink-400" /> };

    return {
      id: exp.id,
      type: config.label,
      note: exp.note,
      date: new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      amount: exp.amount,
      icon: config.icon
    };
  });

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 italic">Loading Trip...</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
        {/* Responsive Header */}
        <header className="bg-white md:bg-transparent p-4 md:p-8">
          <div className="flex justify-between items-start md:items-center">
            <div>
              <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 text-sm mb-1 hover:text-gray-800 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Wapas / #{trip.id}
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900">{trip.source} → {trip.destination}</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${trip.status === 'ACTIVE' || trip.status === 'CREATED' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {trip.status}
                </span>
              </div>
              {/* Mobile Info Badges */}
              <div className="flex flex-col gap-2 mt-2 text-gray-500 text-sm md:hidden">
                <span className="flex items-center gap-1 font-medium"><Truck size={14}/> {trip.vehicleNumber}</span>
                <span className="flex items-center gap-1 font-medium"><User size={14}/> {trip.driverName}</span>
                <span className="flex items-center gap-1 font-medium">Start: {trip.startDate || 'N/A'}</span>
                {(trip.status === 'Closed' || trip.status === 'CLOSED') && (
                  <span className="flex items-center gap-1 font-medium">End: {trip.endDate || 'N/A'}</span>
                )}
              </div>
            </div>

            {/* DESKTOP ACTIONS */}
            {trip.status === 'ACTIVE' && (
              <div className="hidden md:flex gap-3">
                <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm" onClick={() => handleAddExpense(tripId)}>
                  + Kharcha Add Karo
                </button> 
                <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all" onClick={() => handleCompleteTrip(tripId)}>
                  <CheckCircle2 size={18} /> Trip Khatam Karo 
                </button>
              </div>
            )}
            {trip.status === 'CREATED' && (
              <div className="hidden md:flex gap-1">
                <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all" onClick={() => handleStartTrip(tripId)}>
                  <CheckCircle2 size={18} /> Trip Shuru Karo 
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* HISAAB KITAAB CARD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#1e293b] text-white p-4 text-[10px] font-black uppercase tracking-[0.2em]">Hisaab Kitaab</div>
              <div className="p-6 space-y-4">
                <HisaabRow label="Maal ka Kiraya" amount={trip.freightPrice} />
                <HisaabRow label="Truck Bhada" amount={-trip.ownerRate} isNegative />
                <HisaabRow label="Kul Kharcha" amount={-trip.totalExpense} isNegative />
                <hr className="border-dashed border-gray-100" />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-800">Net Faida</span>
                  <span className="text-3xl font-black text-green-600">₹{trip.profit?.toLocaleString('en-IN') || 0}</span>
                </div>
              </div>
            </div>

            {/* TRIP INFO (Desktop Only) */}
            <div className="hidden md:block bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Trip Details</h3>
              <div className="space-y-3">
                <InfoRow label="Truck" value={trip.vehicleNumber} />
                <InfoRow label="Driver" value={trip.driverName} />
                <InfoRow label="Start Date" value={trip.startDate} />
                {(trip.status === 'Closed' || trip.status === 'CLOSED') && <InfoRow label="End Date" value={trip.endDate} />}
              </div>
            </div>
          </div>

          {/* KHARCHE LIST CARD */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[400px] overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Kharche ki List</h3>
                {trip.status === 'ACTIVE' && (
                  <button className="bg-[#0f172a] text-white text-[10px] font-black uppercase px-3 py-2 rounded-lg" onClick={() => handleAddExpense(tripId)}>
                    + Add
                  </button>
                )}
              </div>
              
              <div className="w-full">
                <table className="w-full text-left table-fixed">
                  <thead className="bg-gray-50 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-4 md:px-6 py-4 w-[45%]">Type / Note</th>
                      <th className="px-4 md:px-6 py-4 text-right w-[30%]">Amount</th>
                      <th className="px-4 md:px-6 py-4 text-right w-[25%]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {kharche.map((item) => {
                      const isExpanded = expandedId === item.id;
                      return (
                        <React.Fragment key={item.id}>
                          {/* Parent Entry Row */}
                          <tr 
                            className={`hover:bg-gray-50/80 transition-colors cursor-pointer group ${isExpanded ? 'bg-slate-50' : ''}`}
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          >
                            <td className="px-4 md:px-6 py-4">
                              <div className="flex items-center gap-2 md:gap-3">
                                <div className="bg-gray-50 min-w-[32px] h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                                  {item.icon}
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-gray-800 text-sm truncate">{item.note}</p>
                                  <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-wider">{item.type}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 md:px-6 py-4 text-right">
                              <p className="font-black text-gray-900 text-sm md:text-base">₹{item.amount.toLocaleString('en-IN')}</p>
                            </td>

                            <td className="px-4 md:px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1 text-gray-500 font-bold text-xs md:text-sm">
                                <span>{item.date}</span>
                                <ChevronRight size={14} className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-90 text-slate-800' : ''}`} />
                              </div>
                            </td>
                          </tr>

                          {/* Inline Dynamic Description Accordion */}
                          {isExpanded && (
                            <tr className="bg-slate-50/50 border-l-4 border-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
                              <td colSpan={3} className="px-4 md:px-6 py-4 text-left">
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Note / Details</h4>
                                    <p className="text-xs md:text-sm font-bold text-slate-800 bg-white p-3.5 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed shadow-sm">
                                      {item.note || 'No custom description provided for this expense.'}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-1">
                                    <div className="flex gap-3 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                                      <span>Category: <strong className="text-slate-700">{item.type}</strong></span>
                                      <span>Date: <strong className="text-slate-700">{item.date}</strong></span>
                                    </div>

                                    {trip.status === 'ACTIVE' && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation(); // Stops accordion row closure toggles
                                          handleEditExpense(item.id, tripId);
                                        }}
                                        className="px-3.5 py-1.5 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 transition-colors shadow-sm active:scale-95"
                                      >
                                        Edit Kharcha
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                    
                    {kharche.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-20 text-gray-400 font-bold italic">
                          No expenses added.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                <span className="font-black text-gray-400 uppercase text-xs tracking-widest">Kul Kharcha</span>
                <span className="text-2xl font-black text-red-500">₹{trip.totalExpense?.toLocaleString('en-IN') || 0}</span>
              </div>
            </div>
          </div>

          {/* MOBILE ACTION BUTTONS */}
          {trip.status === 'CREATED' && (
            <div className="flex flex-row gap-2 w-full mt-6 md:hidden">
              <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95" onClick={() => handleStartTrip(tripId)}>
                Trip Shuru Karo
              </button> 
            </div>
          )}

          {trip.status === 'ACTIVE' && (
            <div className="flex flex-row gap-2 w-full mt-6 md:hidden">
              <button className="w-1/2 bg-white border border-gray-200 py-4 rounded-2xl font-black text-gray-600 flex items-center justify-center gap-2 shadow-sm" onClick={() => handleAddExpense(tripId)}>
                + Kharcha Add Karo
              </button> 
              <button className="w-1/2 bg-green-600 text-white px-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95" onClick={() => handleCompleteTrip(tripId)}>
                <CheckCircle2 size={20} /> Trip Khatam Karo
              </button>
            </div>
          )}
        </div>
      </main>

      <MobileFooter activeTab="Trips" tripId={tripId} status={trip.status} />
    </div>
  );
};

const HisaabRow = ({ label, amount, isNegative }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-gray-800'}`}>
      {isNegative ? '-' : ''}₹{Math.abs(amount || 0).toLocaleString('en-IN')}
    </span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1">
    <span className="text-gray-400 font-bold">{label}</span>
    <span className="font-bold text-gray-700">{value || 'N/A'}</span>
  </div>
);

export default TripDetails;