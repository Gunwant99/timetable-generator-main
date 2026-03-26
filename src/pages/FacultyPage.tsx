import React, { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { useTimetableStore } from '@/store/timetableStore';
import { Plus, Trash2, ShieldAlert, UserPlus, Check, Edit2 } from 'lucide-react';

// Pre-defined modern colors for the timetable blocks
const PRESET_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#0ea5e9', '#f97316'
];

export default function FacultyPage() {
  const { faculty, addFaculty, deleteFaculty, updateFaculty } = useTimetableStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // NEW: Tracks which teacher we are editing
  
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    shortCode: '',
    department: 'Computer Engineering',
    maxHoursPerDay: 4,
    color: PRESET_COLORS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // IF WE ARE EDITING: Update the existing teacher
      updateFaculty(editingId, newFaculty);
    } else {
      // IF WE ARE ADDING NEW: Create a new teacher
      addFaculty({
        ...newFaculty,
        id: Math.random().toString(36).substring(7),
      });
    }
    
    // Close modal and reset form
    setIsModalOpen(false);
    setEditingId(null);
    setNewFaculty({ 
      name: '', 
      shortCode: '', 
      department: 'Computer Engineering', 
      maxHoursPerDay: 4, 
      color: PRESET_COLORS[0] 
    });
  };

  // NEW: Function to open modal in Edit Mode
  const openEditModal = (fac: any) => {
    setNewFaculty({
      name: fac.name,
      shortCode: fac.shortCode || fac.code, // Handle potential property name mismatch
      department: fac.department,
      maxHoursPerDay: fac.maxHoursPerDay || fac.max_hours_per_day, // Handle potential property name mismatch
      color: fac.color || PRESET_COLORS[0]
    });
    setEditingId(fac.id);
    setIsModalOpen(true);
  };

  // NEW: Function to open modal in Add Mode
  const openAddModal = () => {
    setNewFaculty({ 
      name: '', 
      shortCode: '', 
      department: 'Computer Engineering', 
      maxHoursPerDay: 4, 
      color: PRESET_COLORS[0] 
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Global Faculty Registry</h2>
              <p className="text-slate-500 mt-1">Master list of all teaching staff in the department</p>
            </div>
            
            <button 
              onClick={openAddModal}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus size={20} /> Add Staff Member
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mb-6">
            <ShieldAlert className="text-amber-600 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-amber-800">Global Resource Architecture</p>
              <p className="text-xs text-amber-700 mt-1">
                Teachers added here are available globally across all sections. <strong>Do not add the same teacher twice.</strong> The AI backend will automatically track their daily hours and prevent double-booking across different semesters.
              </p>
            </div>
          </div>

          {/* FACULTY STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Faculty</p>
                <p className="text-2xl font-black text-slate-800">{faculty.length}</p>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg text-slate-500"><UserPlus size={20}/></div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-500 uppercase">Avg Daily Limit</p>
                <p className="text-2xl font-black text-emerald-800">
                  {faculty.length > 0 
                    ? Math.round(faculty.reduce((acc, f) => acc + (f.maxHoursPerDay || f.max_hours_per_day || 0), 0) / faculty.length) 
                    : 0} <span className="text-sm font-medium text-emerald-600">hrs</span>
                </p>
              </div>
            </div>
          </div>

          {/* GLOBAL FACULTY TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">Faculty Name</th>
                  <th className="px-6 py-4">Short Code</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Max Daily Load</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faculty.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No teaching staff added yet.
                    </td>
                  </tr>
                ) : (
                  faculty.map((fac) => (
                    <tr key={fac.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-md shadow-sm border border-black/10" 
                          style={{ backgroundColor: fac.color || PRESET_COLORS[0] }} 
                        />
                        {fac.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold font-mono border border-slate-200">
                          {fac.shortCode || fac.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{fac.department}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                          {fac.maxHoursPerDay || fac.max_hours_per_day} hrs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* NEW: Edit Button */}
                        <button onClick={() => openEditModal(fac)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors mr-2">
                          <Edit2 size={18} />
                        </button>
                        {/* Delete Button */}
                        <button onClick={() => deleteFaculty(fac.id)} className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors">
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

      {/* ADD/EDIT FACULTY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserPlus className="text-emerald-500" /> {editingId ? "Edit Staff Member" : "Add Staff Member"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Dr. John Smith" 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
                  value={newFaculty.name} 
                  onChange={e => setNewFaculty({...newFaculty, name: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Short Code</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. JS" 
                    maxLength={4}
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 uppercase font-bold font-mono"
                    value={newFaculty.shortCode} 
                    onChange={e => setNewFaculty({...newFaculty, shortCode: e.target.value.toUpperCase()})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Max Daily Hours</label>
                  <input 
                    required 
                    type="number" 
                    min="1" 
                    max="8" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
                    value={newFaculty.maxHoursPerDay} 
                    onChange={e => setNewFaculty({...newFaculty, maxHoursPerDay: parseInt(e.target.value)})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                <input 
                  type="text" 
                  disabled
                  value={newFaculty.department} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              {/* TIMETABLE VISUAL IDENTITY (Color Picker) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Timetable Color Identity</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFaculty({...newFaculty, color})}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-black/10"
                      style={{ backgroundColor: color }}
                    >
                      {newFaculty.color === color && <Check size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
                  {editingId ? "Save Changes" : "Save Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}