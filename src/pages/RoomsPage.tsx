import React, { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { useTimetableStore } from '@/store/timetableStore';
import { Plus, DoorOpen, Trash2 } from 'lucide-react';

export default function RoomsPage() {
  const { rooms, addRoom, deleteRoom } = useTimetableStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    capacity: 60,
    type: 'Classroom'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRoom({
      ...newRoom,
      id: Math.random().toString(36).substring(7),
    });
    setIsModalOpen(false);
    setNewRoom({ roomNumber: '', capacity: 60, type: 'Classroom' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Facility Management</h2>
              <p className="text-slate-500 mt-1">Global registry of all classrooms and laboratories</p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus size={20} /> Add Room
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase">Total Facilities</p>
              <p className="text-2xl font-black text-slate-800">{rooms.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-blue-400 uppercase">Classrooms</p>
              <p className="text-2xl font-black text-blue-800">
                {rooms.filter(r => r.type.toLowerCase() === 'classroom').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-amber-500 uppercase">Laboratories</p>
              <p className="text-2xl font-black text-amber-800">
                {rooms.filter(r => r.type.toLowerCase() === 'lab').length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">Room Number</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No rooms added yet.
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 text-lg uppercase">
                        {room.roomNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          room.type.toLowerCase() === 'lab' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {room.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {room.capacity} seats
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteRoom(room.id)} className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ADD ROOM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <DoorOpen className="text-emerald-500" /> Add Facility
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Room Identifier</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. CR-01 or Lab-3" 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 uppercase font-medium"
                  value={newRoom.roomNumber} 
                  onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value.toUpperCase()})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Facility Type</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
                    value={newRoom.type} 
                    onChange={e => setNewRoom({...newRoom, type: e.target.value})}
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Lab">Laboratory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Capacity</label>
                  <input 
                    required 
                    type="number" 
                    min="10" 
                    max="150" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
                    value={newRoom.capacity} 
                    onChange={e => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}