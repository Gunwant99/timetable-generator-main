import { AppSidebar } from '@/components/AppSidebar';
import { useTimetableStore } from '@/store/timetableStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { UserCheck, AlertTriangle, BookOpen, Monitor } from 'lucide-react';

export default function AnalyticsPage() {
  const { timetableEntries, faculty, subjects, rooms } = useTimetableStore();

  // 1. ADVANCED FACULTY CALCULATION: Mapping Names and Hours
  const facultyLoadData = faculty.map(f => {
    const hours = timetableEntries.filter(e => e.facultyId === f.id).length;
    const assignedSubjects = subjects
      .filter(s => s.facultyId === f.id)
      .map(s => s.code)
      .join(', ');
      
    return {
      name: f.name,
      shortCode: f.shortCode,
      hours: hours,
      max: f.maxHoursPerDay * 6, // Theoretical max for the week
      subjects: assignedSubjects || 'None',
      status: hours > 12 ? 'Overloaded' : hours < 6 ? 'Underloaded' : 'Optimal'
    };
  });

  // 2. SUBJECT DISTRIBUTION WITH FULL NAMES
  const subjectDistribution = subjects.map(s => ({
    name: s.name,
    code: s.code,
    value: timetableEntries.filter(e => e.subjectId === s.id).length
  })).filter(s => s.value > 0);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <AppSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* TOP STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><UserCheck size={24}/></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase">Total Faculty</p><p className="text-2xl font-black">{faculty.length}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><BookOpen size={24}/></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase">Active Subjects</p><p className="text-2xl font-black">{subjects.length}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Monitor size={24}/></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase">Rooms Used</p><p className="text-2xl font-black">{rooms.length}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><AlertTriangle size={24}/></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase">Weekly Slots</p><p className="text-2xl font-black">{timetableEntries.length}</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* FACULTY LOAD CHART (Shows Name on Hover) */}
            <div className="lg:col-span-2 bg-white p-7 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full"/> Faculty Workload Analysis
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={facultyLoadData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="shortCode" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                      formatter={(value, name, props) => [`${value} Hours`, `Teacher: ${props.payload.name}`]}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={4} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SUBJECT PIE CHART */}
            <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase mb-6">Subject Share</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={subjectDistribution} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* THE MASTER LOAD TABLE (The most convincing part) */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900 uppercase text-sm">Detailed Faculty Load Report</h3>
                <span className="text-xs font-medium text-slate-500">Computer Engineering</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase text-slate-400 font-bold border-b border-slate-100">
                    <th className="px-6 py-4">Faculty Member</th>
                    <th className="px-6 py-4">Assigned Subjects</th>
                    <th className="px-6 py-4 text-center">Total Hours</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {facultyLoadData.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{f.name}</p>
                        <p className="text-xs text-slate-400">{f.shortCode}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{f.subjects}</td>
                      <td className="px-6 py-4 text-center font-black text-slate-700">{f.hours} <span className="text-[10px] text-slate-300">/ 36</span></td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                          f.status === 'Overloaded' ? "bg-rose-100 text-rose-600" : 
                          f.status === 'Underloaded' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                        )}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Small helper for Tailwind classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}