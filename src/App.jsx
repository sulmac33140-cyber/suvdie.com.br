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
  FileText, Globe2, Ship, RefreshCw, User, Lock,
  FileSearch, Calculator, PieChart, Info,
  Store, ShoppingBag, Truck, Mail, Copy, Check,
  Cpu, Zap, Radio, Target, Play, Bot, Users, CreditCard, TrendingDown
} from 'lucide-react';

/**
 * --- SUDVIE NEXUS: COMMAND CENTER v32.0 ---
 * AMBIENTE: Vercel Production Subdomain
 * INFRAESTRUTURA: sudvie-fd355 (Europe-West1)
 * STATUS: CULMINAÇÃO TECNOLÓGICA CONSOLIDADA
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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "sudvie-production-v1";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState({ cloud: 'initializing', sync: 'initializing', sheets: 'active', omni: 'active', vise: 'online', hq: 'ready' });
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);

  // VISE States (Simulation for visualization)
  const [investmentProgress, setInvestmentProgress] = useState(49.2);
  const [aiEfficiency, setAiEfficiency] = useState(88.4);

  useEffect(() => {
    const timer = setInterval(() => {
      setInvestmentProgress(prev => (prev < 65 ? prev + 0.05 : prev));
      setAiEfficiency(prev => (prev < 98 ? prev + 0.1 : prev));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
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

  useEffect(() => {
    if (!user) return;
    const dataPath = (coll) => collection(db, 'artifacts', appId, 'public', 'data', coll);

    const unsubInv = onSnapshot(dataPath('inventory'), (snap) => {
      setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setStatus(s => ({ ...s, sync: 'active' }));
      setLoading(false);
    }, (err) => {
      setStatus(s => ({ ...s, sync: 'failed' }));
    });

    const unsubOrders = onSnapshot(dataPath('orders'), (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    });

    return () => { unsubInv(); unsubOrders(); };
  }, [user]);

  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 4000);
  };

  const lowStockItems = useMemo(() => inventory.filter(i => (i.stockBr || 0) <= 5), [inventory]);
  const ruptureItems = useMemo(() => inventory.filter(i => (i.stockBr || 0) === 0), [inventory]);

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <div className="relative">
        <div className="size-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Wine size={32} className="text-blue-500" />
        </div>
      </div>
      <p className="mt-8 text-[10px] font-black tracking-[1em] uppercase opacity-30">Consolidating HQ v32</p>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#fafafa] flex flex-col md:flex-row font-sans text-[#0f172a] overflow-hidden selection:bg-blue-100 italic-none">
      <SEOManager metaTag="google-site-verification-placeholder-v26" />

      {/* SIDEBAR */}
      <aside className="w-full md:w-80 bg-[#020617] text-white flex flex-col z-50 shadow-2xl relative shrink-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

        <div className="p-10 md:p-12">
          <div className="flex items-center gap-6 mb-16">
            <div className="size-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-serif text-3xl font-black italic shadow-2xl shadow-blue-500/20">S</div>
            <div>
              <h1 className="font-serif font-black text-2xl leading-none italic uppercase tracking-tighter">Sudvie</h1>
              <p className="text-[8px] font-black text-blue-400/50 uppercase tracking-[0.4em] mt-2">Command Center v32</p>
            </div>
          </div>

          <nav className="space-y-4">
            <SideLink active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={LayoutDashboard} label="Command Center" />
            <SideLink active={view === 'hq'} onClick={() => setView('hq')} icon={BarChart3} label="Global Audit" />
            <SideLink active={view === 'vise'} onClick={() => setView('vise')} icon={Cpu} label="AI Vision Hub" />
            <SideLink active={view === 'omnichannel'} onClick={() => setView('omnichannel')} icon={ShoppingBag} label="Marketplaces" />
            <SideLink active={view === 'production'} onClick={() => setView('production')} icon={Globe2} label="Production Hub" />
            <SideLink active={view === 'retail'} onClick={() => setView('retail')} icon={Smartphone} label="Terminal CRM" />
          </nav>
        </div>

        <div className="mt-auto p-12 bg-white/5 border-t border-white/5 font-mono">
          <div className="space-y-4">
            <HealthIndicator label="HQ Engine" active={status.hq === 'ready'} />
            <HealthIndicator label="Global Sync" active={status.sync === 'active'} />
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto bg-white relative">
        <header className="h-24 bg-white/80 border-b px-12 flex items-center justify-between sticky top-0 z-40 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="size-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Sudvie International HQ</span>
          </div>

          <div className="flex items-center gap-8">
            {ruptureItems.length > 0 && (
              <div className="bg-rose-600 text-white text-[9px] font-black px-6 py-3 rounded-full animate-pulse flex items-center gap-2 uppercase italic shadow-lg shadow-rose-500/20">
                <AlertTriangle size={14} /> {ruptureItems.length} Ruptures de Stock
              </div>
            )}
            {notif && (
              <div className="bg-[#0f172a] text-white text-[9px] font-black px-6 py-3 rounded-full shadow-2xl animate-fadeIn flex items-center gap-2 uppercase italic border border-white/10">
                <CheckCircle2 size={14} className="text-emerald-400" /> {notif}
              </div>
            )}
          </div>
        </header>

        <div className="p-12 md:p-24 max-w-[1600px] mx-auto w-full">

          {/* VIEW: MAIN DASHBOARD */}
          {view === 'dashboard' && (
            <div className="space-y-24 animate-fadeIn">
              <header className="space-y-8">
                <h2 className="text-8xl font-serif font-black tracking-tighter text-[#020617] uppercase italic leading-[0.85]">Multinational <br /> <span className="text-blue-600">Command</span></h2>
                <p className="text-slate-400 text-2xl font-serif italic max-w-2xl">Monitoramento absoluto de vendas, comissões de campo e inventário transatlântico.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <HQStatsCard label="Gross Revenue" val={`R$ ${orders.reduce((a, b) => a + (b.total || 0), 0).toLocaleString('pt-BR')}`} icon={TrendingUp} trend="+12.4%" />
                <HQStatsCard label="Sales Force" val="12 Agents" icon={Users} trend="Elite v4.0" />
                <HQStatsCard label="Total Commission" val={`R$ ${(orders.reduce((a, b) => a + (b.total || 0), 0) * 0.1).toLocaleString('pt-BR')}`} icon={CreditCard} trend="10% Flat" />
                <HQStatsCard label="Global Stock" val={`${inventory.reduce((a, b) => a + (b.stockBr || 0) + (b.stockFr || 0), 0)} Un`} icon={Database} trend="Unified" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* SALES FORCE LEADERBOARD */}
                <div className="lg:col-span-2 bg-[#020617] rounded-[4rem] text-white p-16 relative overflow-hidden group shadow-3xl">
                  <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 transition-transform duration-[4s]"><Globe size={300} /></div>
                  <div className="relative z-10 flex justify-between items-center mb-16 border-b border-white/10 pb-10">
                    <h3 className="text-3xl font-serif font-black italic uppercase tracking-tighter">Sales Force Monitor</h3>
                    <div className="size-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/20"><Users size={24} /></div>
                  </div>
                  <div className="space-y-10 relative z-10">
                    <SellerRow name="Representante Natal (Elite)" revenue={orders.filter(o => o.source?.includes('Elite')).reduce((a, b) => a + (b.total || 0), 0)} sales={orders.filter(o => o.source?.includes('Elite')).length} />
                    <SellerRow name="Marketplace: Amazon" revenue={orders.filter(o => o.source?.includes('Amazon')).reduce((a, b) => a + (b.total || 0), 0)} sales={orders.filter(o => o.source?.includes('Amazon')).length} />
                    <SellerRow name="Marketplace: Mercado Livre" revenue={orders.filter(o => o.source?.includes('ML')).reduce((a, b) => a + (b.total || 0), 0)} sales={orders.filter(o => o.source?.includes('ML')).length} />
                  </div>
                </div>

                {/* STOCK ALERT CENTER */}
                <div className="bg-slate-50 rounded-[4rem] border border-slate-100 p-16 flex flex-col shadow-sm">
                  <div className="mb-12">
                    <h3 className="text-3xl font-serif font-black italic uppercase tracking-tighter text-[#020617]">Stock Rupture</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2 italic">Natal Logistics Node</p>
                  </div>
                  <div className="space-y-6 flex-1 max-h-[400px] overflow-y-auto pr-4">
                    {inventory.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                        <div>
                          <p className="text-sm font-black italic uppercase text-[#020617]">{item.name}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase mt-1 font-mono">Stock: {item.stockBr} UN</p>
                        </div>
                        <div className={`size-3 rounded-full ${item.stockBr === 0 ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : item.stockBr <= 5 ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setView('omnichannel')} className="mt-12 w-full bg-[#020617] text-white py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl">
                    Acionar Hub Bordeaux <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: GLOBAL AUDIT (v32 Detail) */}
          {view === 'hq' && (
            <div className="space-y-24 animate-fadeIn">
              <header className="flex justify-between items-end border-b border-slate-100 pb-16">
                <div className="space-y-6">
                  <h2 className="text-7xl font-serif font-black tracking-tighter text-[#020617] uppercase italic leading-none">Ledger <br /> <span className="text-blue-600">Audit</span></h2>
                  <p className="text-slate-400 text-xl font-serif italic max-w-md text-slate-400">Rastreamento imutável de transações globais.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-8">
                {orders.length === 0 ? (
                  <div className="p-32 bg-slate-50 rounded-[4rem] text-center space-y-6 border border-slate-100 border-dashed">
                    <FileSearch size={64} className="mx-auto text-slate-200" />
                    <p className="text-2xl font-serif italic text-slate-400">Nenhuma transação registrada no período.</p>
                  </div>
                ) : (
                  orders.map(o => (
                    <div key={o.id} className="flex flex-col md:flex-row justify-between items-center p-12 bg-white rounded-[4rem] border border-slate-100 hover:border-blue-500/50 transition-all duration-700 shadow-sm group">
                      <div className="flex items-center gap-10">
                        <div className="size-20 bg-slate-50 text-[#020617] rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner"><DollarSign size={32} /></div>
                        <div>
                          <h4 className="text-4xl font-serif font-black italic uppercase text-[#020617] leading-none mb-3">{o.wineName}</h4>
                          <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-400 italic font-mono">
                            <span className="flex items-center gap-1 text-blue-600"><Radio size={12} /> {o.source}</span>
                            <div className="size-1 bg-slate-200 rounded-full"></div>
                            <span>{o.timestamp ? new Date(o.timestamp.seconds * 1000).toLocaleString() : 'PENDENTE'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right mt-8 md:mt-0">
                        <p className="text-5xl font-serif font-black italic tracking-tighter text-[#020617]">R$ {o.total?.toFixed(2)}</p>
                        <div className="flex items-center justify-end gap-3 mt-4">
                          <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest italic outline outline-1 outline-emerald-200">Pago</span>
                          <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-widest italic outline outline-1 outline-blue-200">Sync OK</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* REUSED VIEWS FROM v30 (VISE, OMNI, PRODUCTION, RETAIL) */}
          {view === 'vise' && <VISEView progress={investmentProgress} efficiency={aiEfficiency} />}
          {view === 'omnichannel' && <OmnichannelView inventory={inventory} lowStockItems={lowStockItems} notify={notify} />}
          {view === 'production' && <div className="max-w-2xl mx-auto"><ProductEntryModule db={db} appId={appId} notify={notify} /></div>}
          {view === 'retail' && <RetailTerminal inventory={inventory} db={db} appId={appId} notify={notify} />}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&family=Inter:wght@400;700;900&display=swap');
        .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}

// --- SUB-COMPONENTS v32 ---

function HQStatsCard({ label, val, icon: Icon, trend }) {
  return (
    <div className="p-12 bg-white rounded-[4rem] border border-slate-100 shadow-lg shadow-slate-200/20 group hover:-translate-y-2 transition-all duration-700">
      <div className="flex justify-between items-start mb-10">
        <div className="size-14 bg-slate-50 text-[#020617] rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner"><Icon size={24} /></div>
        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full italic tracking-widest">{trend}</span>
      </div>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-3 italic font-mono">{label}</p>
      <h3 className="text-4xl font-serif font-black italic text-[#020617] tracking-tighter leading-none">{val}</h3>
    </div>
  );
}

function SellerRow({ name, revenue, sales }) {
  const commission = revenue * 0.1;
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-all group gap-8">
      <div className="flex items-center gap-8">
        <div className="size-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center font-bold italic">Elite</div>
        <div>
          <h4 className="text-2xl font-serif font-black italic uppercase text-white leading-none">{name}</h4>
          <p className="text-[9px] font-black uppercase text-stone-500 mt-2 italic tracking-widest">{sales} Vendas Realizadas</p>
        </div>
      </div>
      <div className="flex gap-12 text-right">
        <div className="space-y-1">
          <p className="text-[8px] font-black uppercase text-stone-600 tracking-widest">Revenue</p>
          <p className="text-2xl font-black italic text-white tracking-tighter">R$ {revenue.toLocaleString('pt-BR')}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Comissão 10%</p>
          <p className="text-2xl font-black italic text-blue-400 tracking-tighter">R$ {commission.toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}

function VISEView({ progress, efficiency }) {
  return (
    <div className="space-y-16 animate-fadeIn">
      <div className="max-w-3xl space-y-6">
        <h2 className="text-7xl font-serif font-black italic uppercase text-[#020617] leading-none">AI Vision <span className="text-blue-600">Hub</span></h2>
        <p className="text-slate-400 text-2xl font-serif italic">Mapeamento autônomo de Terroir e Robotização de Vinhedos v32.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-16 bg-[#020617] text-white rounded-[5rem] relative overflow-hidden group">
          <Radio className="absolute -top-10 -right-10 size-64 opacity-5 group-hover:scale-125 transition-transform duration-[5s]" />
          <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-12 flex items-center gap-4"><Zap size={24} className="text-blue-500" /> Ecosystem Efficiency</h4>
          <div className="space-y-12">
            <SensorProgress label="Capital Reinvestment" val={progress} />
            <SensorProgress label="Robot Accuracy" val={efficiency} />
          </div>
        </div>
        <div className="p-16 bg-white border border-slate-100 rounded-[5rem] flex flex-col justify-center space-y-8 shadow-sm">
          <div className="size-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner"><Bot size={40} /></div>
          <p className="text-slate-400 font-serif italic text-2xl leading-relaxed">
            "O módulo VISE projeta autonomia total do Hub Bordeaux até a safra 2030, reduzindo custos de OE em 40%."
          </p>
        </div>
      </div>
    </div>
  );
}

function SensorProgress({ label, val }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase text-stone-500 tracking-widest">{label}</span>
        <span className="text-2xl font-black italic">{val.toFixed(1)}%</span>
      </div>
      <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div className="h-full bg-blue-600 shadow-[0_0_20px_#2563eb]" style={{ width: `${val}%` }}></div>
      </div>
    </div>
  );
}

// Shells for other views (Omni, Production, Retail)
function OmnichannelView({ inventory, lowStockItems, notify }) {
  return (
    <div className="space-y-16">
      <h2 className="text-6xl font-serif font-black italic uppercase text-[#020617]">Marketplace <span className="text-blue-600">Sync</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MarketplaceChannel name="Amazon BR" status="Ativo" sales={24} icon={Store} color="blue" />
        <MarketplaceChannel name="Mercado Livre" status="Ativo" sales={38} icon={ShoppingBag} color="amber" />
        <MarketplaceChannel name="Nuvemshop" status="Sincronizando" sales={12} icon={Globe} color="blue" />
        <MarketplaceChannel name="Elite Salesforce" status="Elite" sales={45} icon={Zap} color="emerald" />
      </div>
    </div>
  );
}

function MarketplaceChannel({ name, status, sales, icon: Icon, color }) {
  return (
    <div className="p-10 bg-white border border-slate-100 rounded-[4rem] flex items-center justify-between group hover:border-blue-500 transition-all shadow-sm">
      <div className="flex items-center gap-8">
        <div className={`size-16 bg-${color}-50 text-${color}-600 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner`}><Icon size={28} /></div>
        <div>
          <h4 className="text-3xl font-serif font-black italic uppercase text-[#020617]">{name}</h4>
          <p className={`text-[10px] font-black uppercase text-${color}-600 mt-2 italic tracking-widest`}>{status}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-4xl font-black italic text-[#020617]">{sales}</p>
        <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Vendas Mês</p>
      </div>
    </div>
  );
}

function RetailTerminal({ inventory, db, appId, notify }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {inventory.map(item => (
        <div key={item.id} className="bg-white p-12 rounded-[5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col h-full relative">
          <div className="aspect-square rounded-[3.5rem] bg-slate-50 mb-10 overflow-hidden relative">
            {item.img && <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />}
            <div className={`absolute top-8 right-8 text-white text-[9px] font-black px-6 py-2 rounded-full italic shadow-2xl ${item.stockBr === 0 ? 'bg-rose-600' : 'bg-[#020617]'}`}>Stock: {item.stockBr}</div>
          </div>
          <h4 className="text-3xl font-serif font-black italic uppercase mb-10 leading-none opacity-80 group-hover:text-blue-600 transition-colors">{item.name}</h4>
          <div className="flex justify-between items-center mt-auto border-t border-slate-50 pt-10">
            <span className="text-4xl font-black italic">R$ {item.price?.toFixed(2)}</span>
            <button onClick={async () => {
              if (item.stockBr <= 0) return notification.error("Sem Estoque");
              const wineRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory', item.id);
              await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), { wineName: item.name, total: item.price, timestamp: serverTimestamp(), source: 'Elite Salesforce (Field)' });
              await updateDoc(wineRef, { stockBr: increment(-1) });
              notify("Venda Sincronizada com o HQ!");
            }} disabled={item.stockBr <= 0} className="size-16 bg-[#020617] text-white rounded-2.5rem flex items-center justify-center hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-10 shadow-3xl">
              <ShoppingCart size={28} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductEntryModule({ db, appId, notify }) {
  const [form, setForm] = useState({ name: '', price: '', img: null });
  const [busy, setBusy] = useState(false);

  const executeUpload = async () => {
    if (!form.name || !form.price) return;
    setBusy(true);
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'inventory'), { ...form, price: parseFloat(form.price), stockBr: 10, stockFr: 500, timestamp: serverTimestamp() });
    setForm({ name: '', price: '', img: null });
    notify("Digital Asset Activated in Bordeaux!");
    setBusy(false);
  };

  return (
    <div className="space-y-16 p-16 bg-white rounded-[6rem] shadow-[0_80px_160px_rgba(0,0,0,0.08)] border border-slate-50">
      <div className="aspect-[4/5] bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 cursor-pointer overflow-hidden transition-all hover:bg-slate-100/50" onClick={() => document.getElementById('cam').click()}>
        {form.img ? <img src={form.img} className="w-full h-full object-cover" alt="Wine preview" /> : <div className="text-center space-y-6"><Camera size={64} className="mx-auto text-slate-200" /><p className="text-[10px] font-black text-slate-300 uppercase italic tracking-[0.5em]">Capture Origin Asset</p></div>}
      </div>
      <input type="file" id="cam" className="hidden" onChange={e => {
        const r = new FileReader(); r.onload = ev => setForm({ ...form, img: ev.target.result }); r.readAsDataURL(e.target.files[0]);
      }} />
      <div className="space-y-12">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full text-5xl font-serif font-black italic uppercase outline-none border-b-2 border-slate-50 focus:border-blue-500 py-6 placeholder:opacity-20" placeholder="CHATEAU GRAND..." />
        <div className="flex items-center gap-6">
          <span className="text-3xl font-serif font-black text-slate-200 italic">R$</span>
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full text-6xl font-serif font-black italic outline-none border-b-2 border-slate-50 focus:border-blue-500 py-6 placeholder:opacity-20" placeholder="0.00" />
        </div>
        <button onClick={executeUpload} disabled={busy || !form.name || !form.price} className="w-full bg-[#020617] text-white py-14 rounded-[4rem] font-black uppercase text-xs tracking-[0.8em] hover:bg-blue-600 transition-all flex items-center justify-center gap-6 shadow-3xl active:scale-95 disabled:grayscale disabled:opacity-20">
          {busy ? <Loader2 className="animate-spin" size={32} /> : <Plus size={32} />} ACTIVATE ASSET
        </button>
      </div>
    </div>
  );
}

// Global UI Shells
function SideLink({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-6 p-6 rounded-2xl transition-all duration-500 group ${active ? 'bg-blue-600 text-white shadow-xl translate-x-1 font-black' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <Icon size={20} className={active ? 'text-white' : 'group-hover:text-blue-400 transition-colors'} />
      <span className="text-[11px] uppercase tracking-widest italic">{label}</span>
    </button>
  );
}

function HealthIndicator({ label, active }) {
  return (
    <div className="flex items-center justify-between p-2">
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">{label}</span>
      <div className={`size-2.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`} />
    </div>
  );
}

function SEOManager({ metaTag }) {
  useEffect(() => {
    let meta = document.querySelector('meta[name="google-site-verification"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      document.head.appendChild(meta);
    }
    meta.content = metaTag;
  }, [metaTag]);
  return null;
}
