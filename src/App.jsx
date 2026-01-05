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
  Store, ShoppingBag, Truck, Mail, Copy, Check
} from 'lucide-react';

/**
 * --- SUDVIE NEXUS: OMNI NEXUS v29.0 ---
 * AMBIENTE: Vercel Production Subdomain
 * INFRAESTRUTURA: sudvie-fd355 (Europe-West1)
 * STATUS: Omnichannel & Reposição Automática
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
  const [status, setStatus] = useState({ cloud: 'initializing', sync: 'initializing', sheets: 'active', omni: 'active' });
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);

  // v26 SEO Tag
  const gscTag = "google-site-verification-placeholder-v26";

  // Mandatory Authentication Cycle
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

  // Real-time Data Synchronization
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
    setTimeout(() => setNotif(null), 4000);
  };

  // Safety Stock Analysis (v28)
  const lowStockItems = useMemo(() => inventory.filter(i => (i.stockBr || 0) <= 5), [inventory]);

  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <div className="relative mb-12">
        <Loader2 className="animate-spin text-blue-400" size={80} strokeWidth={1} />
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>
      <div className="text-center space-y-6">
        <h2 className="text-[10px] font-black tracking-[1.2em] uppercase opacity-30 text-white">Sudvie Global Nexus</h2>
        <div className="flex gap-1 justify-center">
          {[1, 2, 3].map(i => <div key={i} className="size-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#fafafa] flex flex-col md:flex-row font-sans text-[#0f172a] overflow-hidden selection:bg-blue-100 italic-none">
      <SEOManager metaTag={gscTag} />

      {/* SIDEBAR: NAVIGATION & STATUS */}
      <aside className="w-full md:w-80 bg-[#020617] text-white flex flex-col z-50 shadow-[20px_0_60px_rgba(0,0,0,0.15)] overflow-hidden relative shrink-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

        <div className="p-10 md:p-12 pb-16">
          <div className="flex items-center gap-6 mb-12">
            <div className="size-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-serif text-3xl shadow-2xl shadow-blue-500/20 text-white italic font-black">S</div>
            <div>
              <h1 className="font-serif font-black text-3xl leading-none tracking-tighter italic text-white uppercase">Sudvie</h1>
              <p className="text-[9px] font-black text-blue-400/50 uppercase mt-2 tracking-[0.4em]">Omni Nexus v29.0</p>
            </div>
          </div>

          <nav className="space-y-4">
            <SideLink active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={Activity} label="Nexus Status" />
            <SideLink active={view === 'omnichannel'} onClick={() => setView('omnichannel')} icon={ShoppingBag} label="Omnichannel" />
            <SideLink active={view === 'production'} onClick={() => setView('production')} icon={Globe2} label="Hub Bordeaux" />
            <SideLink active={view === 'retail'} onClick={() => setView('retail')} icon={Smartphone} label="Terminal Natal" />
            <SideLink active={view === 'hq'} onClick={() => setView('hq')} icon={BarChart3} label="Audit Business" />
          </nav>
        </div>

        <div className="mt-auto p-12 bg-white/5 backdrop-blur-3xl border-t border-white/5 font-mono">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-[10px] opacity-40 uppercase tracking-widest font-black mb-2 italic">Engines Control</div>
            <HealthIndicator label="Cloud Archi" active={status.cloud === 'active'} />
            <HealthIndicator label="Omni Sync" active={status.omni === 'active'} />
            <HealthIndicator label="Fiscal Sync" active={status.sheets === 'active'} />
          </div>
        </div>
      </aside>

      {/* MAIN EXECUTION AREA */}
      <main className="flex-1 overflow-y-auto relative flex flex-col bg-white">
        <header className="h-28 bg-white/80 border-b px-12 flex items-center justify-between sticky top-0 z-40 backdrop-blur-2xl">
          <div className="flex items-center gap-5 translate-y-1">
            <div className={`size-2 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6] ${status.sync === 'active' ? 'bg-blue-500' : 'bg-rose-500'}`}></div>
            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap italic">Global Operations Hub</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-[12px] font-black uppercase text-blue-600 tracking-[0.3em]">{view}</span>
          </div>

          <div className="flex items-center gap-10">
            {lowStockItems.length > 0 && (
              <div onClick={() => setView('omnichannel')} className="cursor-pointer bg-rose-500 text-white text-[10px] font-black px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(244,63,94,0.3)] animate-pulse flex items-center gap-3 border border-white/10 uppercase italic">
                <AlertTriangle size={16} /> {lowStockItems.length} Alertas de Ruptura
              </div>
            )}
            {notif && (
              <div className="bg-[#0f172a] text-white text-[10px] font-black px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] animate-fadeIn flex items-center gap-3 border border-white/10 uppercase italic">
                <CheckCircle2 size={16} className="text-emerald-400" /> {notif}
              </div>
            )}
            <div className="hidden md:flex items-center gap-6 p-4 px-8 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group">
              <div className="size-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors"><User size={16} /></div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono opacity-80 whitespace-nowrap">{user?.uid.substring(0, 16)}</span>
            </div>
          </div>
        </header>

        <div className="p-12 md:p-24 max-w-[1600px] mx-auto w-full">

          {/* VIEW: NEXUS STATUS */}
          {view === 'dashboard' && (
            <div className="space-y-24 animate-fadeIn">
              <div className="max-w-4xl space-y-10">
                <h2 className="text-8xl font-serif font-black tracking-tighter text-[#020617] leading-[0.85] uppercase italic">
                  Omni <br /> <span className="text-blue-600">Sync Master</span>
                </h2>
                <p className="text-slate-400 text-2xl font-serif italic leading-relaxed max-w-2xl">
                  Centralização tática de inventário para Marketplaces Globais.
                  Automação de ressuprimento via canal Brasil-França.
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="px-10 py-5 bg-[#020617] text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center gap-4 border border-white/5 italic">
                    <ShieldCheck size={20} className="text-blue-400" /> Inventory v29
                  </div>
                  <div className="px-10 py-5 bg-white border border-slate-200 rounded-3xl font-black text-xs uppercase tracking-[0.3em] text-slate-500 flex items-center gap-4 italic group hover:border-blue-500 transition-colors">
                    <Store size={20} className="group-hover:text-blue-500" /> Multi-Channel Ready
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <ModernTile title="Amazon SP-API" val="Latency 1s" icon={RefreshCw} active={status.omni === 'active'} />
                <ModernTile title="MELI Webhook" val="Functional" icon={Wifi} active={status.omni === 'active'} />
                <ModernTile title="Safety Stock" val={lowStockItems.length === 0 ? "Healthy" : `${lowStockItems.length} Warnings`} icon={ShieldCheck} active={lowStockItems.length === 0} />
                <ModernTile title="GMC Feed" val="Indexed" icon={Globe} active={true} />
              </div>

              <div className="bg-[#020617] p-12 md:p-24 rounded-[3rem] md:rounded-[5rem] text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute -top-24 -right-24 size-96 bg-blue-500/10 blur-[150px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                <div className="relative z-10 space-y-12">
                  <div className="flex items-center gap-8">
                    <div className="size-20 bg-blue-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 flex-shrink-0 animate-pulse"><Truck size={32} /></div>
                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Logística Proativa</h3>
                  </div>
                  <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-serif italic max-w-3xl">
                    Nosso motor v29 projeta a ruptura de estoque com base no volume omnicanal. Assim que um ativo atinge o Limiar de Segurança, o Nexus prepara automaticamente a requisição para Bordeaux, mitigando riscos de Lead Time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: OMNICHANNEL CONTROL */}
          {view === 'omnichannel' && (
            <div className="space-y-24 animate-fadeIn pb-64">
              <header className="space-y-6 px-4">
                <h2 className="text-8xl font-serif font-black tracking-tighter text-[#020617] uppercase italic leading-none">Omnichannel <br /> <span className="text-blue-600">Grid</span></h2>
                <p className="text-slate-400 text-2xl font-serif italic max-w-2xl">Gestão de canais externos e gatilhos de reposição automática.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-4">
                <div className="space-y-12">
                  <h3 className="text-3xl font-serif font-black uppercase italic tracking-tighter opacity-70 flex items-center gap-4">Canais Conectados <div className="h-px flex-1 bg-slate-100"></div></h3>
                  <div className="grid grid-cols-1 gap-6">
                    <ChannelCard name="Mercado Livre" status="Ativo" icon={ShoppingBag} sales={14} />
                    <ChannelCard name="Amazon Brasil" status="Ativo" icon={Store} sales={8} />
                    <ChannelCard name="Nuvemshop" status="Sincronizando" icon={Globe} sales={2} />
                    <ChannelCard name="Instagram Shopping" status="Stand-by" icon={Camera} sales={0} />
                  </div>
                </div>

                <div className="space-y-12">
                  <h3 className="text-3xl font-serif font-black uppercase italic tracking-tighter text-rose-600 flex items-center gap-4">Alertas de Ruptura <div className="h-px flex-1 bg-rose-100"></div></h3>
                  {lowStockItems.length === 0 ? (
                    <div className="p-20 bg-emerald-50 rounded-[4rem] text-center space-y-4 border border-emerald-100">
                      <CheckCircle2 className="mx-auto text-emerald-500" size={48} />
                      <p className="text-emerald-700 font-serif italic text-xl uppercase tracking-widest font-black">Estoque em Nível de Excelência</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {lowStockItems.map(item => (
                        <ReplenishmentCard key={item.id} item={item} notify={notify} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: HUB BORDEAUX */}
          {view === 'production' && (
            <div className="max-w-2xl mx-auto space-y-16 animate-fadeIn py-12">
              <div className="text-center space-y-6">
                <span className="text-[10px] font-black tracking-[0.5em] text-blue-500 uppercase italic">Digital Archive Center</span>
                <h2 className="text-6xl font-serif font-black tracking-tighter uppercase text-[#020617] leading-none italic">Asset Entry</h2>
                <div className="h-1 w-24 bg-slate-100 mx-auto rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/2 animate-shimmer"></div>
                </div>
              </div>
              <ProductEntryModule db={db} appId={appId} notify={notify} />
            </div>
          )}

          {/* VIEW: NATAL TERMINAL */}
          {view === 'retail' && (
            <div className="space-y-24 animate-fadeIn pb-48">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-slate-100 pb-20">
                <div className="space-y-6 px-4">
                  <h2 className="text-7xl font-serif font-black tracking-tighter text-[#020617] uppercase italic leading-none">
                    Operational <br /> <span className="text-blue-600">Terminal</span>
                  </h2>
                  <p className="text-slate-400 text-xl font-serif italic max-w-md">Controle de PDV local com sincronia omnicanal v29.</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-[#020617] p-8 px-12 rounded-[3.5rem] text-white shadow-2xl text-center border border-white/10 italic">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Omni Presence</p>
                    <p className="text-4xl font-black italic tracking-tighter">{inventory.length} SKUs Habilitados</p>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
                {inventory.map(item => (
                  <ProductDisplayTile key={item.id} item={item} onExecute={async () => {
                    const wineRef = doc(db, 'artifacts', appId, 'public', 'data', 'inventory', item.id);
                    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), {
                      wineName: item.name,
                      total: item.price,
                      timestamp: serverTimestamp(),
                      source: 'Natal Terminal'
                    });
                    await updateDoc(wineRef, { stockBr: increment(-1) });
                    notify("Stock Baixado em Todos os Canais!");
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* VIEW: AUDIT BUSINESS */}
          {view === 'hq' && (
            <div className="space-y-24 animate-fadeIn pb-64 px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <HQMetric label="Gross Omni Revenue" val={`R$ ${orders.reduce((a, b) => a + (b.total || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={TrendingUp} theme="dark" />
                <HQMetric label="Marketplace Lead" val="Amazon BR" icon={Store} theme="light" />
                <HQMetric label="Active Orders" val={orders.length} icon={Ship} theme="light" />
              </div>

              <div className="bg-white rounded-[4rem] md:rounded-[6rem] border border-slate-100 p-8 md:p-24 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-24 border-b pb-12 border-slate-50">
                  <h3 className="text-5xl font-serif font-black tracking-tighter uppercase italic text-[#020617]">Live Omni Audit</h3>
                  <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300"><History size={28} /></div>
                </div>

                <div className="space-y-8">
                  {orders.map(o => (
                    <div key={o.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 hover:bg-white transition-all duration-700 group gap-8">
                      <div className="flex items-center gap-10">
                        <div className="size-20 bg-white text-blue-600 rounded-[2rem] flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0"><DollarSign size={32} /></div>
                        <div>
                          <p className="font-serif font-black text-3xl text-[#020617] uppercase italic leading-none">{o.wineName}</p>
                          <div className="flex items-center gap-4 mt-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] font-mono">
                            <span className="flex items-center gap-2 font-bold"><Activity size={12} className="text-emerald-500" /> {o.source}</span>
                            <div className="hidden md:block size-1 bg-slate-200 rounded-full" />
                            <span className="text-blue-500">{o.timestamp ? new Date(o.timestamp.seconds * 1000).toLocaleString('pt-BR') : 'SYNC...'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="font-serif font-black text-4xl text-emerald-600 italic tracking-tighter leading-none">+ R$ {o.total?.toFixed(2)}</p>
                        <div className="inline-flex items-center gap-3 bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mt-3">Omni Verified</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&family=Inter:wght@400;700;900&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
        ::-webkit-scrollbar { display: none; }
        * { -webkit-font-smoothing: antialiased; }
        .shadow-glow { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
      `}} />
    </div>
  );
}

// --- SUB-COMPONENTS v29 ---

function ChannelCard({ name, status, icon: Icon, sales }) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-between group hover:border-blue-500 transition-all duration-700 shadow-sm hover:shadow-xl">
      <div className="flex items-center gap-8">
        <div className="size-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
          <Icon size={28} />
        </div>
        <div>
          <h4 className="font-serif font-black text-2xl uppercase italic text-[#020617]">{name}</h4>
          <p className={`text-[9px] font-black uppercase tracking-widest ${status === 'Ativo' ? 'text-emerald-500' : 'text-blue-400'}`}>{status}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-serif font-black italic tracking-tighter text-[#020617]">{sales}</p>
        <p className="text-[8px] font-black uppercase tracking-widest opacity-30 italic">Vendas Mês</p>
      </div>
    </div>
  );
}

function ReplenishmentCard({ item, notify }) {
  const [lang, setLang] = useState('PT');
  const [open, setOpen] = useState(false);

  const ptMsg = `Protocolo de Expansão e Reposição SUDVIE\n\nRef: ${item.name}\n\nO estoque em Natal atingiu nível crítico (${item.stockBr} unidades). Solicitamos o envio imediato de um lote de 24 unidades via Hub Bordeaux para manutenção do Lead Time.`;
  const frMsg = `Demande de Réapprovisionnement de Stock – SUDVIE\n\nRéf : ${item.name}\n\nLe stock à Natal a atteint le seuil critique (${item.stockBr} unités). Nous sollicitons la mise à disposition immédiate d'un nouveau lot de 24 unités pour traitement et expédition via Hub Bordeaux.`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(lang === 'PT' ? ptMsg : frMsg);
    notify("Template Copiado para Bordeaux!");
  };

  return (
    <div className="bg-white border-2 border-rose-100 rounded-[3.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="size-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center animate-pulse"><AlertTriangle size={32} /></div>
          <div>
            <h4 className="font-serif font-black text-2xl uppercase italic text-rose-600 leading-none">{item.name}</h4>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-2 font-mono">Stock Crítico: {item.stockBr} UN</p>
          </div>
        </div>
        <button onClick={() => setOpen(!open)} className="px-8 py-4 bg-[#020617] text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic hover:bg-rose-600 transition-all flex items-center gap-4">
          <Mail size={14} /> {open ? 'Fechar Draft' : 'Gerar Draft'}
        </button>
      </div>

      {open && (
        <div className="mt-8 p-10 bg-slate-50 rounded-[2.5rem] space-y-8 animate-fadeIn">
          <div className="flex gap-4">
            <button onClick={() => setLang('PT')} className={`px-6 py-2 rounded-full text-[9px] font-black italic ${lang === 'PT' ? 'bg-blue-600 text-white' : 'bg-slate-200 opacity-50'}`}>PORTUGUÊS</button>
            <button onClick={() => setLang('FR')} className={`px-6 py-2 rounded-full text-[9px] font-black italic ${lang === 'FR' ? 'bg-blue-600 text-white' : 'bg-slate-200 opacity-50'}`}>FRANÇAIS</button>
          </div>
          <div className="relative group">
            <pre className="whitespace-pre-wrap font-serif text-sm italic text-slate-600 bg-white p-10 rounded-3xl border border-slate-100 shadow-inner min-h-[150px]">
              {lang === 'PT' ? ptMsg : frMsg}
            </pre>
            <button onClick={copyTemplate} className="absolute bottom-4 right-4 size-12 bg-[#020617] text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-blue-600 transition-all active:scale-90 opacity-0 group-hover:opacity-100"><Copy size={16} /></button>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-400 italic">
            <Info size={12} /> Este draft segue as normas do Departamento de Suprimentos (v29).
          </div>
        </div>
      )}
    </div>
  );
}

// --- REFINED SHELL COMPONENTS ---

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

function SideLink({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between group transition-all duration-700 ${active ? 'bg-blue-600 text-white shadow-glow p-8 md:p-10 rounded-2xl md:rounded-3xl translate-x-1' : 'text-slate-500 hover:text-white p-6'}`}>
      <div className="flex items-center gap-6">
        <div className={`size-10 flex items-center justify-center rounded-xl transition-colors ${active ? 'bg-white/20' : 'group-hover:bg-white/5'}`}><Icon size={18} /></div>
        <span className="text-[11px] font-black uppercase tracking-[0.3em] font-mono whitespace-nowrap italic">{label}</span>
      </div>
      {active && <div className="hidden md:block size-2 bg-white rounded-full mr-2"></div>}
    </button>
  );
}

function HealthIndicator({ label, active }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <span className="text-[10px] font-black text-slate-600 group-hover:text-blue-400 transition-colors uppercase tracking-[0.2em] italic">{label}</span>
      <div className="flex items-center gap-4">
        <div className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-emerald-500' : 'text-rose-500'}`}>{active ? 'Stable' : 'Logic'}</div>
        <div className={`size-3 rounded-full transition-all duration-700 ${active ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'} ring-4 ring-black/10`} />
      </div>
    </div>
  );
}

function ModernTile({ title, val, icon: Icon, active }) {
  return (
    <div className={`p-10 rounded-[3rem] md:rounded-[4rem] border transition-all duration-1000 flex flex-col items-center text-center space-y-6 ${active ? 'bg-white border-slate-100 shadow-xl' : 'bg-slate-50 border-transparent opacity-50'}`}>
      <div className={`size-20 rounded-[1.8rem] md:rounded-[2.5rem] flex items-center justify-center ${active ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-400'} shadow-sm`}><Icon size={32} strokeWidth={1.5} /></div>
      <div>
        <p className="text-xl md:text-2xl font-black italic tracking-tighter uppercase font-serif text-[#020617] leading-none mb-3">{val}</p>
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">{title}</div>
      </div>
    </div>
  );
}

function HQMetric({ label, val, icon: Icon, theme }) {
  return (
    <div className={`p-16 rounded-[4rem] md:rounded-[5rem] relative overflow-hidden transition-all duration-1000 hover:-translate-y-2 ${theme === 'dark' ? 'bg-[#020617] text-white shadow-3xl' : 'bg-white border border-slate-100 text-[#020617] shadow-lg shadow-slate-200/30'}`}>
      <Icon className="absolute -top-12 -right-12 size-56 opacity-[0.05] transition-transform duration-1000 group-hover:scale-125" />
      <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] opacity-30 mb-8 font-mono italic">{label}</p>
      <h3 className="text-5xl md:text-6xl font-serif font-black italic tracking-tighter leading-none">{val}</h3>
    </div>
  );
}

function ProductEntryModule({ db, appId, notify }) {
  const [form, setForm] = useState({ name: '', price: '', img: null });
  const [busy, setBusy] = useState(false);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const SCALE = 800;
        const ratio = SCALE / img.width;
        canvas.width = SCALE;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setForm(f => ({ ...f, img: canvas.toDataURL('image/jpeg', 0.8) }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const executeUpload = async (e) => {
    e?.preventDefault();
    if (!form.name || !form.price) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'inventory'), {
        ...form,
        price: parseFloat(form.price),
        stockBr: 10, // Initial pilot stock
        stockFr: 500,
        timestamp: serverTimestamp()
      });
      setForm({ name: '', price: '', img: null });
      notify("Lote Digitalizado em França!");
    } catch (e) {
      console.error("Upload Error", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white p-16 rounded-[6rem] shadow-[0_80px_160px_rgba(0,0,0,0.08)] border border-slate-50 space-y-16 relative">
      <div className={`aspect-square md:aspect-[4/5] rounded-[3.5rem] md:rounded-[4rem] border-4 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ${form.img ? 'border-transparent shadow-2xl scale-[1.02]' : 'border-slate-100 bg-slate-50'}`}>
        {form.img ? (
          <div className="relative w-full h-full group">
            <img src={form.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Captured" />
            <button type="button" onClick={() => setForm({ ...form, img: null })} className="absolute top-10 right-10 size-16 bg-white/90 backdrop-blur-3xl rounded-full flex items-center justify-center shadow-2xl text-rose-500 hover:scale-110 transition-all"><X size={24} /></button>
          </div>
        ) : (
          <div className="text-center p-20 space-y-8 group cursor-pointer" onClick={() => document.getElementById('camera').click()}>
            <div className="size-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg text-slate-200 group-hover:text-blue-500 transition-all duration-500"><Camera size={48} strokeWidth={1} /></div>
            <div className="space-y-4">
              <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Bordeaux Digital Hub</p>
              <p className="text-slate-400 font-serif italic text-lg opacity-60">Digitalizar Rótulo de Origem...</p>
            </div>
          </div>
        )}
      </div>

      <input type="file" accept="image/*" onChange={handleCapture} className="hidden" id="camera" />

      <form onSubmit={executeUpload} className="space-y-12 px-4 italic">
        <div className="group border-b-2 border-slate-100 focus-within:border-blue-500 transition-all pb-4">
          <label className="text-[10px] font-black text-slate-400 block mb-4 tracking-[0.4em] uppercase font-mono">Apelação de Origem</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-transparent outline-none font-serif font-black text-5xl text-[#020617] uppercase italic placeholder:opacity-20 translate-y-2 pb-2"
            placeholder="GRAND CRU..."
          />
        </div>
        <div className="group border-b-2 border-slate-100 focus-within:border-blue-500 transition-all pb-4">
          <label className="text-[10px] font-black text-slate-400 block mb-4 tracking-[0.4em] uppercase font-mono">Preço de Tabela (BRL)</label>
          <div className="flex items-center gap-6">
            <span className="text-3xl font-serif font-black text-slate-200 italic">R$</span>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full bg-transparent outline-none font-serif font-black text-6xl text-[#020617] italic placeholder:opacity-20"
              placeholder="0.00"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={busy || !form.name || !form.price}
          className="w-full bg-[#020617] text-white py-14 rounded-[4rem] font-black uppercase text-[15px] tracking-[0.8em] shadow-3xl flex items-center justify-center gap-8 active:scale-95 transition-all hover:bg-blue-600 disabled:opacity-20 disabled:grayscale hover:-translate-y-3 duration-500"
        >
          {busy ? <Loader2 className="animate-spin" size={32} strokeWidth={3} /> : <Send size={32} strokeWidth={2} />}
          {busy ? 'SYNCHRONIZING...' : 'ACTIVATE ASSET'}
        </button>
      </form>
    </div>
  );
}

function ProductDisplayTile({ item, onExecute }) {
  const isCritical = (item.stockBr || 0) <= 5;
  return (
    <div className={`bg-white rounded-[5.5rem] border overflow-hidden shadow-sm hover:shadow-[0_80px_160px_rgba(0,0,0,0.1)] transition-all duration-1000 group flex flex-col h-full relative ${isCritical ? 'border-rose-100' : 'border-slate-100'}`}>
      <div className="aspect-[4/5] bg-slate-50 flex items-center justify-center relative overflow-hidden flex-shrink-0 p-4">
        {item.img ? (
          <img src={item.img} className="w-full h-full object-cover rounded-[4rem] group-hover:scale-110 transition-transform duration-[2s]" alt={item.name} />
        ) : (
          <div className="size-48 bg-white rounded-full flex items-center justify-center shadow-2xl text-slate-100 opacity-40"><Wine size={80} /></div>
        )}
        <div className={`absolute top-12 right-12 backdrop-blur-3xl text-[10px] font-black px-10 py-4 rounded-full uppercase shadow-2xl ring-1 ring-black/5 italic tracking-widest font-mono ${isCritical ? 'bg-rose-500 text-white' : 'bg-white/90 text-[#020617]'}`}>Stock-BR: {item.stockBr}</div>
      </div>
      <div className="p-16 flex flex-col flex-1 space-y-12">
        <h4 className="text-5xl font-serif font-black leading-[0.9] text-[#020617] uppercase italic group-hover:text-blue-600 transition-colors duration-500">{item.name}</h4>
        <div className="flex justify-between items-center border-t border-slate-50 pt-16 mt-auto">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Compliance Value</p>
            <span className="text-5xl font-serif font-black text-[#020617] italic tracking-tight">R$ {item.price?.toFixed(2)}</span>
          </div>
          <button
            onClick={onExecute}
            disabled={item.stockBr <= 0}
            className="size-24 bg-[#020617] text-white rounded-[2.5rem] shadow-3xl hover:bg-blue-600 transition-all active:scale-90 flex items-center justify-center group/btn disabled:opacity-20 disabled:grayscale hover:-translate-y-4 duration-500"
          >
            <ShoppingCart size={36} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
