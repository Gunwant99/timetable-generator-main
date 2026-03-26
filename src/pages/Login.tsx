import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // SVPCET Coordinator Credentials
    if (email === "admin@stvincentngp.edu.in" && password === "admin123") {
      toast.success("Login Successful! Welcome, Coordinator.");
      navigate('/dashboard');
    } else {
      toast.error("Invalid Credentials. Please use the authorized admin account.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[1000px] h-[600px] flex shadow-2xl rounded-2xl overflow-hidden z-10 mx-4 border border-white/10">
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-12 flex-col justify-between text-white border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <ShieldCheck className="text-emerald-500" size={32} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">SmartTT</h1>
            </div>
            <h2 className="text-4xl font-extrabold leading-tight mb-6">
              SVPCET <br /> <span className="text-emerald-500">Coordinator Portal</span>
            </h2>
            <p className="text-lg text-slate-400">Computer Engineering Department</p>
          </div>
          <div className="text-sm text-slate-500">© 2026 SVPCET</div>
        </div>

        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 md:p-16">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-slate-900">Admin Login</h3>
            <p className="text-slate-500 mt-2">Access the Timetable Generation System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="admin@stvincentngp.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}