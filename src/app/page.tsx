'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, Settings, History, Shield, Cpu, Search, ArrowRight, User, 
  Power, Zap, MoreVertical, Activity, MessageSquare, Video, Copy, Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Утилита для классов
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

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
    if (remoteStream && videoRef.current) {
      setConnecting(false);
      videoRef.current.srcObject = remoteStream;
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
              <h2 className="text-xl font-bold text-white">Establishing P2P Link...</h2>
              <p className="text-slate-500 mt-1 text-sm">Waiting for remote stream</p>
            </div>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
        )}
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [myId, setMyId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [peer, setPeer] = useState<any>(null);
  const [session, setSession] = useState<{ id: string, name: string } | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [copied, setCopied] = useState(false);

  // Инициализируем PeerJS только на клиенте
  useEffect(() => {
    const initPeer = async () => {
      const { default: Peer } = await import('peerjs');
      const newPeer = new Peer();
      
      newPeer.on('open', (id) => {
        setMyId(id.slice(0, 8).toUpperCase().replace(/(.{4})/, '$1 '));
        setPeer(newPeer);
      });

      newPeer.on('call', (call) => {
        setSession({ id: call.peer, name: 'Incoming Call' });
        call.answer(); 
        call.on('stream', (stream) => setRemoteStream(stream));
      });
    };

    initPeer();
  }, []);

  const handleConnect = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!remoteId || !peer) return;

    const cleanId = remoteId.replace(/\s+/g, '').toLowerCase();
    setSession({ id: remoteId, name: 'Remote Terminal' });
    
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const call = peer.call(cleanId, stream);
      call.on('stream', (s: MediaStream) => setRemoteStream(s));
    } catch (err) {
      console.error("Failed to share screen", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-200 bg-[#020617]">
      <AnimatePresence>
        {session && (
          <RemoteSession 
            deviceId={session.id} 
            deviceName={session.name} 
            remoteStream={remoteStream}
            onDisconnect={() => { setSession(null); setRemoteStream(null); }} 
          />
        )}
      </AnimatePresence>

      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-white/[0.02]">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-600/30">
          <Zap className="text-white" fill="currentColor" size={20} />
        </div>
        <div className="flex flex-col gap-6 flex-1 mt-8">
          <Monitor size={22} className="text-blue-500" />
          <History size={22} className="text-slate-500" />
          <Shield size={22} className="text-slate-500" />
        </div>
        <Settings size={22} className="text-slate-500 mb-4" />
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold">OrbDesk <span className="text-blue-500 text-xs align-top">P2P</span></h1>
          <div 
            onClick={() => { navigator.clipboard.writeText(myId); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="cursor-pointer flex items-center gap-3 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20"
          >
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold opacity-60">Your ID</div>
              <div className="font-mono font-bold">{myId || 'LOADING...'}</div>
            </div>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </div>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-12 pt-20">
          <div className="text-center">
            <h2 className="text-5xl font-extrabold text-white">Connect to anyone.</h2>
            <p className="text-slate-500 mt-4 text-xl">Fast, secure, and purely peer-to-peer.</p>
          </div>

          <form onSubmit={handleConnect} className="bg-white/5 p-3 rounded-3xl flex items-center gap-4 border border-white/10 focus-within:border-blue-500/50 transition-all max-w-2xl mx-auto w-full">
            <Cpu className="ml-4 text-blue-500" size={28} />
            <input 
              type="text" 
              value={remoteId}
              onChange={(e) => setRemoteId(e.target.value)}
              placeholder="Enter Partner ID" 
              className="bg-transparent border-none focus:outline-none flex-1 text-2xl font-mono py-2 text-white"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl shadow-xl transition-all">
              <ArrowRight size={28} />
            </button>
          </form>

          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Status</div>
              <div className="text-emerald-500 font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> ONLINE
              </div>
            </div>
            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Security</div>
              <div className="text-blue-400 font-bold">P2P ENCRYPTED</div>
            </div>
            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Relay</div>
              <div className="text-slate-300 font-bold">IAD-1 REGION</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}