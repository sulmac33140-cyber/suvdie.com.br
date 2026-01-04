import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Wine, Globe, Smartphone, LayoutDashboard, 
  CheckCircle2, AlertTriangle, Loader2, Send, 
  Plus, X, History, TrendingUp, 
  Database, Wifi, BarChart3, Settings, 
  Package, MapPin, Briefcase, Camera, 
  UploadCloud, DollarSign, Activity,
  ChevronRight, ShieldCheck, ShoppingCart, 
  FileText, Globe2, Ship, RefreshCw, User, Lock
} from 'lucide-react';

/**
 * --- SUDVIE NEXUS: PRODUCTION RELEASE v24.0 ---
 * AMBIENTE: Vercel Production Subdomain
 * INFRAESTRUTURA: sudvie-fd355 (Europe-West1)
 * STATUS: Homologação de Conectividade Ativa
 */

const firebaseConfig = {
  apiKey: "AIzaSyBUrQNnsGxo8LvXfwpkak7k4ePEFPX7oN0",
  authDomain: "sudvie-fd355.firebaseapp.com",
  databaseURL: "https://sudvie-fd355-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sudvie-fd355",
  storageBucket: "sudvie-fd355.firebasestorage.app",
  messagingSenderId: "1044156495108",
  appId: "1:1044156495108:web:e773cf15025819703d0c51",
  measurementId: "G-2ER7TQJ3XW"
};

// Singleton pattern for Firebase initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "sudvie-production-v1";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard'); 
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState({ cloud: 'initializing', sync: 'initializing' });
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);

  // Mandatory Authentication Cycle (Rule 3 Compliance)
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error("Critical: Identity Provider Failure", e.message);
        setStatus(s => ({ ...s, cloud: 'failed' }));
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setStatus(s => ({ ...s, cloud: 'active' }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Data Synchronization (Rules 1 & 2 Compliance)
  useEffect(() => {
    if (!user) return;
    const dataPath = (coll) => collection(db, 'artifacts', appId, 'public', 'data', coll);

    const unsubInv = onSnapshot(dataPath('inventory'), (snap) => {
      setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setStatus(s => ({ ...s, sync: 'active' }));
      setLoading(false);
    }, (err) => {
      console.error("Sync Error:", err.message);
      setStatus(s => ({ ...s, sync: 'failed' }));
    });

    const unsubOrders = onSnapshot(dataPath('orders'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    });

    return () => { unsubInv(); unsubOrders(); };
  }, [user]);

  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  if (loading) return (
    <div className="h-screen bg-[#050b14] flex flex-col items-center justify-center text-white">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-500 mb-8" size={64} />
        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
      </div>
      <div className="text-center space-y-3">
        <h2 className="text-xs font-black tracking-[0.6em] uppercase opacity-40">Sudvie Global Nexus</h2>
        <p className="text-[9px] text-blue-400 font-mono tracking-widest uppercase animate-pulse">Homologação de Subdomínio em Curso...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-[#1a1c1e] overflow-hidden">
      
      {/* SIDEBAR: NAVIGATION & STATUS */}
      <aside className="w-full md:w-80 bg-[#0a0f18] text-white flex flex-col z-50 shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
        <div className="p-10 border-b border-white/5 flex items-center gap-5">
          <div className="size-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.2rem] flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20 text-white italic">S</div>
          <div>
            <h1 className="font-serif font-black text-2xl leading-none tracking-tight italic text-white uppercase">Sudvie</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 tracking-[0.3em]">Operational V24</p>
          </div>
        </div>

        <nav className="flex-1 p-8 space-y-3 mt-6">
          <SideLink active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={Activity} label="Nexus Status" />
          <SideLink active={view === 'production'} onClick={() => setView('production')} icon={Ship} label="Hub Bordeaux" />
          <SideLink active={view === 'retail'} onClick={() => setView('retail')} icon={Smartphone} label="Terminal Natal" />
          <SideLink active={view === 'hq'} onClick={() => setView('hq')} icon={LayoutDashboard} label="Business HQ" />
        </nav>

        <div className="p-10 border-t border-white/5 bg-black/40">
          <div className="space-y-5">
            <HealthIndicator label="Google Cloud" active={status.cloud === 'active'} />
            <HealthIndicator label="Engine Sync" active={status.sync === 'active'} />
          </div>
        </div>
      </aside>

      {/* MAIN EXECUTION AREA */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="h-24 bg-white/90 border-b px-10 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
          <div className="flex items-center gap-4 text-stone-300">
            <span className="text-[11px] font-black uppercase tracking-widest text-stone-400 font-bold">Produção</span>
            <ChevronRight size={16} />
            <span className="text-[11px] font-black uppercase text-blue-600 tracking-widest">{view}</span>
          </div>
          <div className="flex items-center gap-8">
            {notif && <div className="bg-emerald-500 text-white text-[10px] font-black px-5 py-2.5 rounded-full shadow-lg animate-fadeIn">✓ {notif}</div>}
            <div className="flex items-center gap-5 p-3 px-7 bg-stone-50 border border-stone-100 rounded-[1.5rem] shadow-sm">
              <User size={16} className="text-stone-400" />
              <span className="text-[11px] font-black uppercase text-stone-600 tracking-widest">{user?.uid.substring(0, 12)}</span>
            </div>
          </div>
        </header>

        <div className="p-10 md:p-16">
          
          {/* VIEW: STATUS DASHBOARD */}
          {view === 'dashboard' && (
            <div className="max-w-5xl mx-auto space-y-16 animate-fadeIn">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                  <h2 className="text-6xl font-serif font-black tracking-tighter text-stone-900 leading-none uppercase italic">Auditoria</h2>
                  <p className="text-stone-400 text-xl font-serif italic max-w-lg">Homologação de tráfego via subdomínio técnico da Vercel.</p>
                </div>
                <div className="p-6 px-10 bg-indigo-600 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/30 border border-white/10">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Status de Segurança</p>
                  <p className="text-2xl font-bold flex items-center gap-4 italic tracking-tighter uppercase leading-none"><Lock size={24}/> Certificado Ativo</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <StatusTile 
                  title="Node Europe-West1" 
                  desc="Servidores de Bordéus operando sob protocolo de baixa latência."
                  active={status.sync === 'active'}
                  icon={Globe2}
                />
                <StatusTile 
                  title="Camada de Dados" 
                  desc="Integridade estrutural validada para o projeto sudvie-fd355."
                  active={status.sync === 'active'}
                  icon={Database}
                />
              </div>

              <div className="bg-white p-16 rounded-[4.5rem] border border-stone-100 shadow-sm flex items-center justify-between group hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000"><Wifi size={240}/></div>
                <div className="relative z-10 max-w-2xl space-y-6">
                   <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter italic text-stone-900"><Settings className="text-blue-500 animate-spin-slow"/> Validação de URL</h3>
                   <p className="text-stone-500 leading-relaxed text-lg font-medium">
                     A funcionalidade plena está garantida através deste subdomínio técnico. A vinculação definitiva ao <b>sudvie.com.br</b> permanece condicionada à retificação dos registros DNS no portal Registro.br.
                   </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: HUB BORDEAUX */}
          {view === 'production' && (
            <div className="max-w-2xl mx-auto space-y-12 animate-fadeIn">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif font-black tracking-tighter uppercase text-stone-900 leading-none italic">Bordeaux Hub</h2>
                <p className="text-stone-400 italic text-xl tracking-tight font-serif">Módulo de digitalização de inventário em França.</p>
              </div>
              <ProductEntryModule db={db} appId={appId} notify={notify} />
            </div>
          )}

          {/* VIEW: NATAL TERMINAL */}
          {view === 'retail' && (
            <div className="max-w-6xl mx-auto space-y-16 animate-fadeIn pb-32">
              <div className="flex justify-between items-end px-4 border-b border-stone-100 pb-10">
                <h2 className="text-4xl font-serif font-black tracking-tight flex items-center gap-5 text-stone-900 uppercase italic">
                  <Smartphone className="text-blue-600" size={40}/> Terminal Natal
                </h2>
                <div className="text-right">
                  <span className="text-[12px] font-black bg-stone-900 text-white px-6 py-3 rounded-full uppercase tracking-widest">{inventory.length} SKUs Disponíveis</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {inventory.map(item => (
                  <ProductDisplayTile key={item.id} item={item} onExecute={async () => {
                    const wineRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory', item.id);
                    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), {
                      wineName: item.name, total: item.price, timestamp: serverTimestamp(), source: 'Venda Terminal'
                    });
                    await updateDoc(wineRef, { stockBr: increment(-1) });
                    notify("Operação Cloud Sincronizada!");
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: BUSINESS HQ */}
          {view === 'hq' && (
            <div className="max-w-6xl mx-auto space-y-16 animate-fadeIn pb-48">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <AnalyticsCard label="Receita Bruta" value={`R$ ${orders.reduce((a,b)=>a+(b.total||0),0).toLocaleString()}`} icon={TrendingUp} color="indigo" />
                  <AnalyticsCard label="Volume de Ordens" value={orders.length} icon={FileText} color="stone" />
                  <AnalyticsCard label="Inventário Brasil" value={inventory.reduce((a,b)=>a+(b.stockBr||0),0)} icon={Package} color="emerald" />
               </div>

               <div className="bg-white rounded-[5rem] border border-stone-100 p-16 shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center mb-16 border-b pb-10 border-stone-50">
                    <h3 className="text-3xl font-black flex items-center gap-6 uppercase tracking-tighter italic text-stone-800">
                      <History className="text-stone-300" size={32}/> Auditoria Transacional
                    </h3>
                    <button className="p-4 bg-stone-50 rounded-2xl text-stone-400 hover:text-blue-600 transition-colors"><BarChart3/></button>
                  </div>
                  <div className="space-y-6">
                     {orders.map(o => (
                       <div key={o.id} className="flex justify-between items-center p-10 bg-stone-50 rounded-[3rem] border border-stone-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group shadow-sm">
                          <div className="flex items-center gap-10">
                             <div className="size-20 bg-blue-50 text-blue-600 rounded-[1.8rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500"><DollarSign size={32}/></div>
                             <div>
                                <p className="font-bold text-stone-900 text-2xl leading-none uppercase italic">{o.wineName}</p>
                                <div className="flex items-center gap-6 mt-3 text-[12px] font-bold uppercase text-stone-400 tracking-[0.2em]">
                                   <span>{o.timestamp ? new Date(o.timestamp.seconds * 1000).toLocaleString() : 'Validando...'}</span>
                                   <span className="size-1.5 bg-stone-200 rounded-full" />
                                   <span className="text-blue-500 font-black tracking-widest">{o.source}</span>
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="font-black text-emerald-600 text-4xl italic tracking-tighter leading-none">+ R$ {o.total?.toFixed(2)}</p>
                             <span className="text-[11px] font-black uppercase bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full mt-4 inline-block shadow-sm tracking-widest">Conciliado</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}

// --- INFRASTRUCTURE SUPPORT COMPONENTS ---

function ProductEntryModule({ db, appId, notify }) {
  const [form, setForm] = useState({ name: '', price: '', img: null });
  const [busy, setBusy] = useState(false);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const SCALE = 500;
        const ratio = SCALE / img.width;
        canvas.width = SCALE;
        canvas.height = img.height * ratio;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        setForm(f => ({ ...f, img: canvas.toDataURL('image/jpeg', 0.6) }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const executeUpload = async () => {
    if (!form.name || !form.price) return;
    setBusy(true);
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'inventory'), {
      ...form, price: parseFloat(form.price), stockBr: 12, stockFr: 100, timestamp: serverTimestamp()
    });
    setForm({ name: '', price: '', img: null });
    setBusy(false);
    notify("Lançamento Sincronizado!");
  };

  return (
    <div className="bg-white p-16 rounded-[5rem] border shadow-2xl space-y-12 relative overflow-hidden group">
      <div className={`aspect-[3/4] rounded-[4rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-700 shadow-inner ${form.img ? 'border-blue-500 ring-12 ring-blue-50' : 'border-stone-200 bg-stone-50'}`}>
        {form.img ? <img src={form.img} className="w-full h-full object-cover" alt="Vinho" /> : <div className="text-center p-16"><Camera className="mx-auto text-stone-200 mb-6" size={80}/><p className="text-[12px] font-black uppercase text-stone-400 tracking-[0.3em] italic">Digitalizar Rótulo Original</p></div>}
      </div>
      <input type="file" accept="image/*" onChange={handleCapture} className="hidden" id="camera" />
      <label htmlFor="camera" className="block w-full text-center py-7 border-2 border-stone-100 rounded-[2.5rem] font-black text-[12px] uppercase cursor-pointer hover:bg-stone-950 hover:text-white transition-all duration-500 tracking-[0.4em] shadow-sm">Capturar Imagem</label>
      <div className="space-y-10">
        <div className="border-b-2 border-stone-100 pb-4">
          <label className="text-[10px] font-black text-stone-400 block mb-3 tracking-[0.3em] uppercase italic">Designação do Ativo</label>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-transparent outline-none font-black text-4xl text-stone-900 uppercase italic" placeholder="Château Sudvie..." />
        </div>
        <div className="border-b-2 border-stone-100 pb-4">
          <label className="text-[10px] font-black text-stone-400 block mb-3 tracking-[0.3em] uppercase italic">Valor de Mercado (BRL)</label>
          <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-transparent outline-none font-black text-4xl text-stone-900" placeholder="0.00" />
        </div>
      </div>
      <button onClick={executeUpload} disabled={busy} className="w-full bg-stone-950 text-white py-12 rounded-[3.5rem] font-black uppercase text-[14px] tracking-[0.6em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all hover:bg-blue-600">
        {busy ? <Loader2 className="animate-spin" size={28}/> : <UploadCloud size={28}/>} {busy ? 'COMUNICANDO...' : 'ENVIAR PARA NATAL'}
      </button>
    </div>
  );
}

function ProductDisplayTile({ item, onExecute }) {
  return (
    <div className="bg-white rounded-[4.5rem] border border-stone-50 overflow-hidden shadow-sm hover:shadow-[0_60px_120px_rgba(0,0,0,0.1)] transition-all duration-1000 group flex flex-col h-full">
      <div className="aspect-[3/4] bg-[#fdfdfd] flex items-center justify-center relative overflow-hidden flex-shrink-0">
        {item.img ? <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} /> : <Wine size={120} className="text-stone-50 group-hover:scale-125 transition-transform duration-1000 opacity-20"/>}
        <div className="absolute top-12 right-12 bg-white/95 backdrop-blur-md text-stone-900 text-[12px] font-black px-8 py-3 rounded-full uppercase shadow-2xl ring-1 ring-stone-100 italic">Unidades: {item.stockBr}</div>
      </div>
      <div className="p-16 flex flex-col flex-1">
        <h4 className="text-4xl font-serif font-black mb-16 leading-tight text-stone-900 uppercase italic truncate">{item.name}</h4>
        <div className="flex justify-between items-center border-t pt-12 border-stone-50 mt-auto">
          <span className="text-5xl font-black text-stone-900 italic tracking-tighter">R$ {item.price?.toFixed(2)}</span>
          <button onClick={onExecute} className="bg-stone-950 text-white p-7 rounded-[2.5rem] shadow-2xl hover:bg-blue-600 transition-all active:scale-90"><ShoppingCart size={32}/></button>
        </div>
      </div>
    </div>
  );
}

function SideLink({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-7 px-12 py-7 rounded-[3rem] transition-all duration-700 ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/50 translate-x-3 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <Icon size={24} />
      <span className="text-[14px] font-black uppercase tracking-[0.4em]">{label}</span>
    </button>
  );
}

function HealthIndicator({ label, active }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <div className={`size-4 rounded-full ${active ? 'bg-emerald-500 animate-pulse shadow-[0_0_20px_#10b981]' : 'bg-red-500 shadow-[0_0_20px_#ef4444]'}`} />
    </div>
  );
}

function StatusTile({ title, desc, active, icon: Icon }) {
  return (
    <div className={`p-16 rounded-[5rem] border transition-all duration-1000 ${active ? 'bg-emerald-50/70 border-emerald-100' : 'bg-red-50 border-red-100 shadow-2xl shadow-red-500/10'}`}>
      <div className="flex items-center justify-between mb-12">
        <div className={`size-24 rounded-[2.5rem] flex items-center justify-center ${active ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40' : 'bg-red-500 text-white shadow-2xl shadow-red-500/40'}`}><Icon size={48}/></div>
        <span className={`text-[12px] font-black uppercase px-8 py-3 rounded-full tracking-[0.2em] shadow-sm ${active ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{active ? 'Sincronizado' : 'Offline'}</span>
      </div>
      <h4 className="text-3xl font-black mb-5 tracking-tighter text-stone-900 uppercase italic">{title}</h4>
      <p className="text-stone-500 text-lg leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function AnalyticsCard({ label, value, icon: Icon, color }) {
  const bg = { indigo: 'bg-[#0a0f18] text-white shadow-2xl shadow-blue-950/30', stone: 'bg-white border-2 border-stone-50 text-stone-900', emerald: 'bg-white border-2 border-stone-50 text-stone-900' };
  return (
    <div className={`${bg[color]} p-16 rounded-[5rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-1000 shadow-sm border border-stone-100`}>
      <Icon className="absolute top-0 right-0 opacity-[0.05] size-48 -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000" />
      <p className="text-[13px] font-black uppercase tracking-[0.5em] opacity-40 mb-10">{label}</p>
      <h3 className="text-8xl font-black tracking-tighter leading-none italic">{value}</h3>
    </div>
  );
}
