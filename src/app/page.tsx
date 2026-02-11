'use client';

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Settings, 
  History, 
  Shield, 
  Cpu, 
  Search, 
  ArrowRight,
  User,
  Power,
  Zap,
  MoreVertical,
  Activity,
  MessageSquare,
  FileDown,
  MousePointer2,
  Keyboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Утилита для объединения классов без лишних зависимостей
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const SidebarIcon = ({ icon: Icon, active = false }: { icon: any, active?: boolean }) => (
  <div className={cn(
    "p-3 rounded-xl cursor-pointer transition-all duration-200 group relative",
    active ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
  )}>
    <Icon size={22} />
  </div>
);

const DeviceCard = ({ name, id, status, onConnect }: { name: string, id: string, status: 'online' | 'offline', onConnect: () => void }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass p-4 rounded-2xl flex flex-col gap-4 group"
  >
    <div className="flex justify-between items-start">
      <div className={cn(
        "p-2 rounded-lg",
        status === 'online' ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"
      )}>
        <Monitor size={20} />
      </div>
      <button className="text-slate-500 hover:text-white transition-colors">
        <MoreVertical size={18} />
      </button>
    </div>
    <div>
      <h3 className="font-semibold text-slate-100 truncate">{name}</h3>
      <p className="text-xs text-slate-500 font-mono mt-1">ID: {id}</p>
    </div>
    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", status === 'online' ? "bg-emerald-500 animate-pulse" : "bg-slate-600")} />
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{status}</span>
      </div>
      <button 
        onClick={onConnect}
        disabled={status === 'offline'}
        className={cn(
          "text-[10px] px-3 py-1.5 rounded-lg transition-all font-bold uppercase tracking-wider",
          status === 'online' ? "bg-white/5 hover:bg-blue-500 hover:text-white" : "opacity-20 cursor-not-allowed bg-white/5"
        )}
      >
        Connect
      </button>
    </div>
  </motion.div>
);

const RemoteSession = ({ deviceId, deviceName, onDisconnect }: { deviceId: string, deviceName: string, onDisconnect: () => void }) => {
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setConnecting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#020617] flex flex-col"
    >
      <header className="h-14 glass border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
            <Monitor size={16} className="text-blue-500" />
            <span className="text-sm font-medium">{deviceName}</span>
            <span className="text-xs text-slate-500 font-mono">[{deviceId}]</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><MessageSquare size={18} /></button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><FileDown size={18} /></button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><MousePointer2 size={18} /></button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Keyboard size={18} /></button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold">
            <Activity size={12} /> SECURE
          </div>
          <button 
            onClick={onDisconnect}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider border border-red-500/20"
          >
            <Power size={14} /> Exit Session
          </button>
        </div>
      </header>
      <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-4">
        {connecting ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="text-center">
              <h2 className="text-xl font-bold">Establishing Connection...</h2>
              <p className="text-slate-500 mt-1">Authenticating with OrbDesk Secure Relay</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-5xl aspect-video glass rounded-xl overflow-hidden shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900">
              <div className="p-8 grid grid-cols-1 gap-8 w-fit">
                {[1,2,3].map(i => (
                  <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer w-16">
                    <div className="w-12 h-12 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors flex items-center justify-center border border-white/5">
                      <div className="w-6 h-6 bg-blue-500 rounded-sm opacity-50" />
                    </div>
                    <span className="text-[10px] text-white/70">System {i}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <Monitor size={300} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [remoteId, setRemoteId] = useState('');
  const [session, setSession] = useState<{ id: string, name: string } | null>(null);

  return (
    <div className="flex h-screen overflow-hidden text-slate-200">
      <AnimatePresence>
        {session && (
          <RemoteSession 
            deviceId={session.id} 
            deviceName={session.name} 
            onDisconnect={() => setSession(null)} 
          />
        )}
      </AnimatePresence>

      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 glass">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-600/30 mb-4">
          <Zap className="text-white" fill="currentColor" size={20} />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <SidebarIcon icon={Monitor} active />
          <SidebarIcon icon={History} />
          <SidebarIcon icon={Shield} />
          <SidebarIcon icon={Activity} />
        </div>
        <div className="flex flex-col gap-4">
          <SidebarIcon icon={Settings} />
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.01]">
          <h1 className="text-xl font-bold tracking-tight">OrbDesk <span className="text-blue-500 text-xs align-top ml-1 tracking-normal font-medium">BETA</span></h1>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input type="text" placeholder="Search devices..." className="bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:border-blue-500/50 transition-all text-sm text-slate-200" />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Your ID: 821 930 442
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Remote Access Made Simple.</h2>
                <p className="text-slate-400 mt-2">Enter a Remote ID to start a secure, lightning-fast session.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (remoteId) setSession({ id: remoteId, name: 'Remote Terminal' }); }} className="glass p-2 rounded-2xl flex items-center gap-2 group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <div className="p-3 text-blue-500"><Cpu size={24} /></div>
                <input type="text" value={remoteId} onChange={(e) => setRemoteId(e.target.value)} placeholder="Enter Remote ID" className="bg-transparent border-none focus:outline-none flex-1 text-lg font-mono tracking-widest placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal text-slate-200" />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 group-hover:scale-105 active:scale-95">
                  <ArrowRight size={24} />
                </button>
              </form>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 aspect-video flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} className="text-blue-500" /></div>
              <div className="flex items-center gap-3 mb-2">
                <Activity size={20} className="text-blue-500" />
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">System Status</span>
              </div>
              <div className="flex-1 flex flex-col justify-center text-slate-200">
                <div className="text-4xl font-bold text-white uppercase tracking-tight">Ready</div>
                <p className="text-slate-500 mt-1">Global servers operating at peak performance</p>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold">Recent Devices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DeviceCard name="Office Workstation" id="192 443 001" status="online" onConnect={() => setSession({ id: '192 443 001', name: 'Office Workstation' })} />
              <DeviceCard name="MacBook Pro M3" id="882 110 932" status="online" onConnect={() => setSession({ id: '882 110 932', name: 'MacBook Pro M3' })} />
              <DeviceCard name="Home Media PC" id="441 002 119" status="offline" onConnect={() => {}} />
              <DeviceCard name="Linux Server Alpha" id="009 334 112" status="online" onConnect={() => setSession({ id: '009 334 112', name: 'Linux Server Alpha' })} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}