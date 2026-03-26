import React, { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { useTimetableStore } from '@/store/timetableStore';
import { Plus, GraduationCap, Trash2, Info } from 'lucide-react';

export default function ClassesPage() {
  const { classes, addClass, deleteClass } = useTimetableStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newClass, setNewClass] = useState({
    semester: 4,
    sectionName: 'A',
    department: 'Computer Engineering'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClass({
      ...newClass,
      id: Math.random().toString(36).substring(7),
    });
    setIsModalOpen(false);
    setNewClass({ semester: 4, sectionName: 'A', department: 'Computer Engineering' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Class Sections</h2>
              <p className="text-slate-500 mt-1">Manage all active semesters and their sub-sections</p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus size={20} /> Add Section
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3 mb-6">
            <Info className="text-blue-600 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-bold text-blue-800">Section Management</p>
              <p className="text-xs text-blue-700 mt-1">
                Each section added here will get its own unique, conflict-free timetable during generation. Ensure you add all sections (e.g., 4A, 4B) before adding subjects.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">Semester</th>
                  <th className="px-6 py-4">Section</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No sections configured yet.
                    </td>
                  </tr>
                ) : (
                  classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        Semester {cls.semester}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                          Section {cls.sectionName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{cls.department}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteClass(cls.id)} className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors">
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

      {/* ADD CLASS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <GraduationCap className="text-emerald-500" /> Add New Section
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Semester</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
                    value={newClass.semester} 
                    onChange={e => setNewClass({...newClass, semester: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>Semester {num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Section</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 font-medium"
                    value={newClass.sectionName} 
                    onChange={e => setNewClass({...newClass, sectionName: e.target.value})}
                  >
                    {['A', 'B', 'C', 'D'].map(char => (
                      <option key={char} value={char}>Section {char}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                <input 
                  type="text" 
                  disabled
                  value={newClass.department} 
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors">Save Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}