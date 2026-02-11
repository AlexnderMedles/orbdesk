'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, Settings, History, Shield, Cpu, Search, ArrowRight, User, 
  Power, Zap, MoreVertical, Activity, MessageSquare, FileDown, 
  MousePointer2, Keyboard, Copy, Check, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Peer from 'peerjs';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- UI Components ---
const SidebarIcon = ({ icon: Icon, active = false }: { icon: any, active?: boolean }) => (
  <div className={cn(
    "p-3 rounded-xl cursor-pointer transition-all duration-200 group",
    active ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
  )}>
    <Icon size={22} />
  </div>
);

// --- Remote Session Overlay ---
const RemoteSession = ({ 
  deviceId, 
  deviceName, 
  onDisconnect, 
  remoteStream 
}: { 
  deviceId: string, 
  deviceName: string, 
  onDisconnect: () => void,
  remoteStream: MediaStream | null
}) => {
  const [connecting, setConnecting] = useState(!remoteStream);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteStream) {
      setConnecting(false);
      if (videoRef.current) videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#020617] flex flex-col">
      <header className="h-14 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
            <Monitor size={16} className="text-blue-500" />
            <span className="text-sm font-medium">{deviceName}</span>
            <span className="text-xs text-slate-500 font-mono">[{deviceId}]</span>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><MessageSquare size={18} /></button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"><Video size={18} /></button>
          </div>
        </div>
        <button onClick={onDisconnect} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-1.5 rounded-lg transition-all text-xs font-bold uppercase border border-red-500/20">
          <Power size={14} /> Exit Session
        </button>
      </header>

      <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
        {connecting ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <div className="text-center">
              <h2 className="text-xl font-bold">Establishing Secure P2P Link...</h2>
              <p className="text-slate-500 mt-1 text-sm tracking-wide">Connecting via OrbDesk Relay</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                <p className="text-slate-400 text-lg">Waiting for screen sharing...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Dashboard ---
export default function Dashboard() {
  const [myId, setMyId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [peer, setPeer] = useState<Peer | null>(null);
  const [session, setSession] = useState<{ id: string, name: string } | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const newPeer = new Peer();
    
    newPeer.on('open', (id) => {
      setMyId(id.slice(0, 8).toUpperCase().replace(/(.{4})/, '$1 '));
      setPeer(newPeer);
    });

    newPeer.on('call', (call) => {
      setSession({ id: call.peer, name: 'Incoming Connection' });
      call.answer(); 
      call.on('stream', (stream) => {
        setRemoteStream(stream);
      });
    });

    return () => newPeer.destroy();
  }, []);

  const handleConnect = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!remoteId || !peer) return;

    const cleanId = remoteId.replace(/\s+/g, '').toLowerCase();
    setSession({ id: remoteId, name: 'Remote Client' });
    
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const call = peer.call(cleanId, stream);
      call.on('stream', (s) => setRemoteStream(s));
    } catch (err) {
      console.error("Screen share failed", err);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 bg-[#020617]">
      <AnimatePresence>
        {session && (
          <RemoteSession 
            deviceId={session.id} 
            deviceName={session.name} 
            remoteStream={remoteStream}
            onDisconnect={() => {
              setSession(null);
              setRemoteStream(null);
            }} 
          />
        )}
      </AnimatePresence>

      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-white/[0.02] shrink-0">
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
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10"><User size={20} /></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.01]">
          <h1 className="text-xl font-bold">OrbDesk <span className="text-blue-500 text-xs align-top ml-1">P2P</span></h1>
          <div className="flex items-center gap-4">
            <div 
              onClick={copyId}
              className="group cursor-pointer flex items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 transition-all"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Your Personal ID</span>
                <span className="font-mono font-bold">{myId || 'GENERATING...'}</span>
              </div>
              {copied ? <Check size={18} /> : <Copy size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl font-bold text-white leading-tight">Access any device,<br/><span className="text-blue-500">instantly.</span></h2>
              <p className="text-slate-400 mt-4 text-lg">Enter the Remote ID of another OrbDesk user to start a session.</p>
              <form onSubmit={handleConnect} className="mt-8 bg-white/5 p-2 rounded-2xl flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all">
                <div className="p-3 text-blue-500"><Cpu size={24} /></div>
                <input 
                  type="text" 
                  value={remoteId}
                  onChange={(e) => setRemoteId(e.target.value)}
                  placeholder="0000 0000" 
                  className="bg-transparent border-none focus:outline-none flex-1 text-2xl font-mono tracking-widest placeholder:text-slate-700 placeholder:font-sans placeholder:tracking-normal"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
                  <ArrowRight size={24} />
                </button>
              </form>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.03] rounded-[2rem] p-8 aspect-square flex flex-col justify-between relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={200} className="text-blue-500" /></div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">System Live</span>
              </div>
              <div>
                <div className="text-6xl font-black text-white">100%</div>
                <p className="text-slate-500 mt-2 font-medium">Uptime globally. High-speed P2P relay active.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
