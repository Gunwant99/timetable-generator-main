import React, { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { useTimetableStore } from '@/store/timetableStore';
import { Plus, BookOpen, Trash2, Layers, Edit2 } from 'lucide-react';

export default function SubjectsPage() {
  const { subjects, classes, faculty, addSubject, deleteSubject, updateSubject } = useTimetableStore(); // NEW: Added updateSubject
  
  // 1. THIS IS THE MAGIC: It tracks which section you are currently managing
  const [activeClassId, setActiveClassId] = useState<string>(classes[0]?.id || '');
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // NEW: Tracks which subject we are editing

  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    type: 'Theory',
    credits: 4,
    facultyId: ''
  });

  // Filter the table to ONLY show subjects for the selected section
  const visibleSubjects = subjects.filter(s => s.classId === activeClassId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClassId) return alert("Please select a class first!");
    
    if (editingId) {
      // IF WE ARE EDITING: Update the existing subject
      updateSubject(editingId, newSubject);
    } else {
      // IF WE ARE ADDING NEW: Create a new subject tied to this section
      addSubject({
        ...newSubject,
        id: Math.random().toString(36).substring(7), // Generate temp ID
        classId: activeClassId 
      });
    }
    
    // Close modal and reset state
    setIsModalOpen(false);
    setEditingId(null);
    setNewSubject({ name: '', code: '', type: 'Theory', credits: 4, facultyId: '' });
  };

  // NEW: Function to open modal in Add Mode
  const openAddModal = () => {
    setNewSubject({ name: '', code: '', type: 'Theory', credits: 4, facultyId: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // NEW: Function to open modal in Edit Mode
  const openEditModal = (sub: any) => {
    setNewSubject({
      name: sub.name,
      code: sub.code || '',
      type: sub.type,
      credits: sub.credits,
      facultyId: sub.facultyId || '' // Keep the assigned teacher selected
    });
    setEditingId(sub.id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Subject Configuration</h2>
              <p className="text-slate-500 mt-1">Assign subjects and teachers to specific sections</p>
            </div>
            
            <button 
              onClick={openAddModal}
              disabled={!activeClassId}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} /> Add Subject to Section
            </button>
          </div>

          {/* 3. THE SECTION SELECTOR */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Layers size={24} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Currently Managing
              </label>
              <select 
                value={activeClassId} 
                onChange={(e) => setActiveClassId(e.target.value)}
                className="w-full max-w-md bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-bold"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    Semester {c.semester} — Section {c.sectionName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* THE FILTERED TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">Subject Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Credits/Hrs</th>
                  <th className="px-6 py-4">Assigned Teacher</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No subjects added for this section yet.
                    </td>
                  </tr>
                ) : (
                  visibleSubjects.map((subject) => {
                    const assignedFaculty = faculty.find(f => f.id === subject.facultyId);
                    return (
                      <tr key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{subject.name}</p>
                          <p className="text-xs text-slate-400">{subject.code}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            subject.type.toLowerCase() === 'lab' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {subject.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{subject.credits} hrs</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{assignedFaculty?.name || 'Unassigned'}</p>
                          <p className="text-xs text-slate-400">{assignedFaculty?.shortCode || assignedFaculty?.code}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {/* NEW: Edit Button */}
                          <button onClick={() => openEditModal(subject)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors mr-2">
                            <Edit2 size={18} />
                          </button>
                          {/* Delete Button */}
                          <button onClick={() => deleteSubject(subject.id)} className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ADD/EDIT SUBJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {editingId ? "Edit Subject" : "Add Subject to Section"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Subject Name</label>
                  <input required type="text" placeholder="e.g. Database Management" className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
                    value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} />
                </div>
                
                {/* NEW: Added the missing Subject Code field! */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Subject Code</label>
                  <input required type="text" placeholder="e.g. CS301" className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 uppercase font-mono"
                    value={newSubject.code} onChange={e => setNewSubject({...newSubject, code: e.target.value.toUpperCase()})} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
                    value={newSubject.type} onChange={e => setNewSubject({...newSubject, type: e.target.value})}>
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Credits (Hours)</label>
                  <input required type="number" min="1" max="10" className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
                    value={newSubject.credits} onChange={e => setNewSubject({...newSubject, credits: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Faculty</label>
                <select required className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500"
                  value={newSubject.facultyId} onChange={e => setNewSubject({...newSubject, facultyId: e.target.value})}>
                  <option value="">Select a Teacher...</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.shortCode || f.code})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
                  {editingId ? "Save Changes" : "Save Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}