import React, { useEffect, useMemo, useState } from 'react'
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, Bell, Check, CheckCircle2, ChevronDown, Cloud, Cpu, Download, Droplets, FileBarChart, Gauge, History, Home, Leaf, LockKeyhole, LogOut, Menu, Play, Power, RefreshCcw, Search, Settings, ShieldCheck, SlidersHorizontal, Thermometer, Wifi, X, Zap } from 'lucide-react'

const TANKS = [
  { id: 'Tandon 01', name: 'Selada — Zona A', seed: { ph: 6.10, ec: 1.46, temp: 24.4 } },
  { id: 'Tandon 02', name: 'Pakcoy — Zona B', seed: { ph: 5.85, ec: 1.73, temp: 25.2 } },
  { id: 'Tandon 03', name: 'Kangkung — Zona C', seed: { ph: 6.25, ec: 1.52, temp: 24.9 } },
]
const LIMITS = { ph: [5.5, 6.5], ec: [1.0, 2.0], temp: [20, 28] }
const round = (n, digits=2) => Number(n.toFixed(digits))
const clock = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const randomWalk = (value, step, min, max) => round(Math.min(max, Math.max(min, value + (Math.random() - .5) * step)))
const status = (metric, value, limits=LIMITS) => value < limits[metric][0] || value > limits[metric][1] ? 'Peringatan' : 'Normal'
function initialRows(seed, tankIndex) {
  const now = Date.now()
  return Array.from({ length: 22 }, (_, i) => {
    const factor = Math.sin(i / 3 + tankIndex)
    return {
      time: clock(new Date(now - (21 - i) * 60_000)),
      stamp: now - (21 - i) * 60_000,
      ph: round(seed.ph + factor * .12),
      ec: round(seed.ec + Math.cos(i / 4 + tankIndex) * .08),
      temp: round(seed.temp + factor * .48),
    }
  })
}
const seedData = () => Object.fromEntries(TANKS.map((t, i) => [t.id, initialRows(t.seed, i)]))
const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'monitoring', label: 'Monitoring Nutrisi', icon: Activity },
  { key: 'history', label: 'Riwayat Data', icon: History },
  { key: 'alerts', label: 'Notifikasi', icon: Bell },
  { key: 'reports', label: 'Laporan', icon: FileBarChart },
  { key: 'settings', label: 'Pengaturan', icon: Settings },
]
function downloadCSV(rows, filename) {
  const content = [['Waktu','pH','EC (mS/cm)','Suhu air (°C)'],...rows.map(d=>[d.time,d.ph,d.ec,d.temp])].map(r=>r.join(',')).join('\n')
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
function Metric({ icon: Icon, label, value, unit, state, sub, accent='green' }) {
  return <div className="metric"><div className={'metric-icon '+accent}><Icon size={21}/></div><div className="metric-name">{label}</div><div className="metric-value">{value}<span>{unit}</span></div><div className={'metric-foot '+(state==='Peringatan'?'danger':'')}><span className="tiny-dot"/>{sub || state}</div></div>
}
const ChartBox = ({ title, data, field, color, unit, limits, icon: Icon }) => <div className="panel chart-panel">
  <div className="panel-head"><div className="chart-title"><span className="chart-icon" style={{color}}><Icon size={19}/></span><span>{title}</span></div><span className="pill light">Simulasi langsung</span></div>
  <div className="chart-content"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{left:-22, right:10, top:12, bottom:0}}><defs><linearGradient id={'g'+field} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={.20}/><stop offset="100%" stopColor={color} stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf1f1" strokeDasharray="4 5"/><XAxis dataKey="time" tick={{fontSize:10, fill:'#93a2a0'}} tickLine={false} axisLine={false} minTickGap={26}/><YAxis domain={['dataMin - 0.3','dataMax + 0.3']} tick={{fontSize:10, fill:'#93a2a0'}} tickLine={false} axisLine={false}/><Tooltip contentStyle={{border:'1px solid #e5efeb', borderRadius:12, fontSize:12}} formatter={v => [`${v} ${unit}`, title]}/><Area type="monotone" dataKey={field} stroke={color} strokeWidth={2.5} fill={`url(#g${field})`} dot={false} activeDot={{r:5}}/></AreaChart></ResponsiveContainer></div>
  <div className="chart-footer"><span>Rentang contoh: {limits[0]}–{limits[1]} {unit}</span><span>22 pembacaan terakhir</span></div>
</div>
function Login({ onLogin }) {
  const [username, setUsername] = useState('demo@hydrogrow.id')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const submit = e => { e.preventDefault(); if (username === 'demo@hydrogrow.id' && password === 'demo123') onLogin(); else setError('Gunakan akun demo yang tertera di bawah.') }
  return <div className="login-screen"><div className="login-ambient one"/><div className="login-ambient two"/><div className="login-wrap"><div className="login-art"><div className="glass-label"><Leaf size={17}/> Smart Hydroponic Monitoring</div><h1>Smarter Water.<br/><strong>Healthier Harvest.</strong></h1><p>Pantau pH, EC/TDS, dan suhu larutan nutrisi melalui satu dashboard yang mudah digunakan.</p><img src="./mascot.png" alt="Maskot HydroGrow"/><div className="login-art-footer">IoT Monitoring Kit • Modular • Retrofit</div></div><div className="login-card"><div className="login-brand"><img src="./logo.png" alt="HydroGrow"/></div><span className="pill demo">● DEMO SIMULASI</span><h2>Selamat datang kembali!</h2><p className="muted">Masuk untuk melihat dashboard HydroGrow.</p><form onSubmit={submit}><label>Email</label><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Masukkan email" type="email"/><label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Masukkan password" type="password"/>{error&&<div className="form-error">{error}</div>}<button className="primary login-button" type="submit"><LockKeyhole size={17}/> Masuk ke Dashboard</button></form><div className="demo-credentials"><strong>Akun demo</strong><div>Email: <code>demo@hydrogrow.id</code></div><div>Password: <code>demo123</code></div></div><div className="disclaimer"><ShieldCheck size={16}/> Tampilan dan data simulasi. Login bukan autentikasi produksi.</div></div></div></div>
}
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [nav, setNav] = useState('dashboard')
  const [tankId, setTankId] = useState(TANKS[0].id)
  const [data, setData] = useState(seedData)
  const [running, setRunning] = useState(true)
  const [tick, setTick] = useState(0)
  const [limits, setLimits] = useState(LIMITS)
  const [alerts, setAlerts] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const tank = TANKS.find(t=>t.id===tankId)
  const rows = data[tankId] || []
  const latest = rows[rows.length-1] || tank.seed
  const currentStatus = ['ph','ec','temp'].map(k=>status(k,latest[k],limits))
  const alertCount = currentStatus.filter(v=>v==='Peringatan').length
  const updateData = () => {
    const d = new Date(); setData(prev => {
      const next = {}
      TANKS.forEach(t => { const history = prev[t.id]; const old = history[history.length - 1]; const ph = randomWalk(old.ph, .13, 4.6, 7.4), ec=randomWalk(old.ec, .14, .5, 2.9), temp=randomWalk(old.temp, .28, 18, 33); next[t.id]=[...history.slice(-29),{time:clock(d),stamp:d.getTime(),ph,ec,temp}] })
      return next
    }); setTick(v=>v+1)
  }
  useEffect(()=>{ if (!loggedIn || !running) return; const id=setInterval(updateData,4000); return ()=>clearInterval(id) },[loggedIn,running])
  useEffect(()=>{ const issues=['ph','ec','temp'].filter(k=>status(k,latest[k],limits)==='Peringatan'); if (issues.length) setAlerts(prev => [{id:`${tankId}-${tick}`,tank:tankId,time:clock(new Date()),text:`Parameter ${issues.join(', ')} berada di luar rentang contoh`,kind:'warning'}, ...prev].slice(0,15)) },[tick])
  const demoAlerts = useMemo(()=>[...alerts,{id:'seed1',tank:'Tandon 02',time:'09:24',text:'Simulasi: pH di luar batas pada Tandon 02',kind:'warning'},{id:'seed2',tank:'Tandon 01',time:'08:15',text:'Simulasi: sensor berhasil terkoneksi',kind:'success'}], [alerts])
  if (!loggedIn) return <Login onLogin={()=>setLoggedIn(true)}/>
  const navItems = NAV.filter(n=>n.label.toLowerCase().includes(search.toLowerCase()))
  return <div className="dashboard-app">
    <aside className={'sidebar '+(sidebarOpen?'open':'')}><div className="side-head"><img src="./logo.png" alt="HydroGrow"/></div><div className="side-section">WORKSPACE</div><nav>{navItems.map(n=><button key={n.key} onClick={()=>{setNav(n.key);setSidebarOpen(false)}} className={'nav-item '+(nav===n.key?'active':'')}><n.icon size={19}/>{n.label}{n.key==='alerts'&&alertCount>0&&<span className="nav-dot"/>}</button>)}</nav><div className="side-bottom"><div className="sidebar-promo"><img src="./mascot.png" alt="Maskot HydroGrow"/><strong>Grow smarter, every day.</strong><span>Data yang lebih mudah dipahami, keputusan lebih terarah.</span></div><div className="side-device"><div><span className="online-dot"/> Sistem Simulasi</div><small>3 tandon • pembaruan 4 detik</small></div><button className="logout" onClick={()=>setLoggedIn(false)}><LogOut size={17}/> Keluar</button></div></aside>
    <main className="app-main"><div className="mobile-top"><button onClick={()=>setSidebarOpen(!sidebarOpen)} aria-label="Menu"><Menu/></button><strong>HydroGrow</strong><span className="pill demo">DEMO</span></div>
      <header className="header"><div><div className="eyebrow">HYDROGROW CONTROL CENTER</div><h1>{nav==='dashboard'?'Dashboard Monitoring':NAV.find(n=>n.key===nav)?.label}</h1><p>Kelola dan pantau larutan nutrisi hidroponik dengan mudah.</p></div><div className="header-right"><span className="pill demo"><span className="online-dot"/> DATA SIMULASI</span><div className="avatar">HG</div><div className="user-info"><strong>Tim HydroGrow</strong><span>Demo Administrator</span></div><button className="icon-button" onClick={()=>setNav('alerts')} aria-label="Notifikasi"><Bell size={19}/></button></div></header>
      <div className="notice"><span className="notice-icon"><ShieldCheck size={17}/></span><span><strong>Mode Demonstrasi</strong> — Semua angka dibuat secara acak untuk presentasi. Tidak terhubung ke sensor atau cloud sungguhan.</span><button onClick={()=>setRunning(v=>!v)}>{running?<><Power size={15}/> Jeda</>:<><Play size={15}/> Lanjut</>}</button></div>
      <div className="control-row"><div className="select-wrap"><Leaf size={18}/><select value={tankId} onChange={e=>setTankId(e.target.value)}>{TANKS.map(t=><option key={t.id} value={t.id}>{t.id} — {t.name}</option>)}</select><ChevronDown size={16}/></div><div className="control-actions"><span className="refresh-time"><span className="online-dot"/> {running?'Auto-update tiap 4 detik':'Simulasi dijeda'}</span><button className="outline" onClick={updateData}><RefreshCcw size={16}/> Refresh</button><button className="primary" onClick={()=>downloadCSV(rows,`HydroGrow_${tankId.replace(' ','_')}.csv`)}><Download size={16}/> Ekspor CSV</button></div></div>
      {(nav==='dashboard'||nav==='monitoring')&& <>
        <div className="metrics-grid"><Metric icon={Droplets} label="pH Larutan" value={latest.ph.toFixed(2)} state={currentStatus[0]} accent="blue"/><Metric icon={Activity} label="EC Nutrisi" value={latest.ec.toFixed(2)} unit="mS/cm" state={currentStatus[1]}/><Metric icon={Thermometer} label="Suhu Air" value={latest.temp.toFixed(1)} unit="°C" state={currentStatus[2]} accent="orange"/><Metric icon={Cpu} label="Sensor Aktif" value="3/3" sub="Simulasi aktif" accent="purple"/><Metric icon={Gauge} label="Tandon" value="3" sub="Zona terdaftar" accent="blue"/><Metric icon={Bell} label="Peringatan" value={alertCount} sub={alertCount?'Perlu perhatian':'Parameter dalam batas'} accent="orange"/></div>
        <div className="charts-grid"><ChartBox title="Tren pH Larutan" data={rows} field="ph" color="#259fd5" icon={Droplets} unit="pH" limits={limits.ph}/><ChartBox title="Tren EC Nutrisi" data={rows} field="ec" color="#36b376" icon={Activity} unit="mS/cm" limits={limits.ec}/><ChartBox title="Tren Suhu Air" data={rows} field="temp" color="#fa9955" icon={Thermometer} unit="°C" limits={limits.temp}/></div>
        <div className="bottom-grid"><section className="panel device-panel"><div className="panel-head"><h3>Status Perangkat HydroGrow</h3><span className="pill success"><CheckCircle2 size={13}/> Sensor demo aktif</span></div><div className="device-content"><div className="device-illustration"><div className="tank-illustration"><div className="tank-top"/><div className="tank-water"><div className="plant">🌱</div><div className="probe probe-a"/><div className="probe probe-b"/><div className="probe probe-c"/></div></div><div className="iot-module"><Wifi size={20}/><span>HydroGrow<br/>IoT Kit</span></div></div><div className="device-details">{[{name:'Sensor pH',value:latest.ph.toFixed(2),icon:Droplets,color:'blue',key:'ph'},{name:'Sensor EC/TDS',value:`${latest.ec.toFixed(2)} mS/cm`,icon:Activity,color:'green',key:'ec'},{name:'Sensor Suhu',value:`${latest.temp.toFixed(1)} °C`,icon:Thermometer,color:'orange',key:'temp'}].map(item=><div className="device-line" key={item.key}><item.icon size={17} className={item.color}/><span>{item.name}</span><strong>{item.value}</strong><span className={status(item.key,latest[item.key],limits)==='Normal'?'check':'warn'}>{status(item.key,latest[item.key],limits)==='Normal'?<Check size={15}/>:<Bell size={15}/>}</span></div>)}<div className="device-line"><Wifi size={17} className="green"/><span>Koneksi Wi-Fi</span><strong>Simulasi</strong><span className="check"><Check size={15}/></span></div></div></div></section><section className="panel notifications-panel"><div className="panel-head"><h3>Notifikasi Terbaru</h3><button className="text-button" onClick={()=>setNav('alerts')}>Lihat semua →</button></div><div className="alerts-list">{demoAlerts.slice(0,4).map(item=><div className="alert-row" key={item.id}><div className={'alert-icon '+item.kind}>{item.kind==='warning'?<Bell size={16}/>:<CheckCircle2 size={16}/>}</div><div><strong>{item.kind==='warning'?'Peringatan parameter':'Informasi sistem'}</strong><p>{item.text}</p><small>{item.tank} • {item.time}</small></div></div>)}</div></section></div>
      </>}
      {(nav==='history'||nav==='reports')&&<section className="panel data-table"><div className="panel-head"><div><h3>{nav==='reports'?'Laporan Monitoring':'Riwayat Data'}</h3><p>Rekaman simulasi tandon yang dipilih</p></div><button className="primary" onClick={()=>downloadCSV(rows,`HydroGrow_riwayat_${tankId.replace(' ','_')}.csv`)}><Download size={16}/> Unduh CSV</button></div><div className="table-overflow"><table><thead><tr><th>Waktu</th><th>pH</th><th>EC (mS/cm)</th><th>Suhu Air</th><th>Status</th></tr></thead><tbody>{[...rows].reverse().map((d,i)=><tr key={`${d.stamp}-${i}`}><td>{d.time}</td><td>{d.ph}</td><td>{d.ec}</td><td>{d.temp} °C</td><td><span className={'pill '+(['ph','ec','temp'].some(k=>status(k,d[k],limits)==='Peringatan')?'warning':'success')}>{['ph','ec','temp'].some(k=>status(k,d[k],limits)==='Peringatan')?'Perlu perhatian':'Normal'}</span></td></tr>)}</tbody></table></div></section>}
      {nav==='alerts'&&<section className="panel alerts-page"><div className="panel-head"><h3>Pusat Notifikasi</h3><button className="outline" onClick={()=>setAlerts([])}>Bersihkan notifikasi baru</button></div>{demoAlerts.map(a=><div className="alert-row" key={a.id}><span className={'alert-icon '+a.kind}><Bell size={17}/></span><div><strong>{a.kind==='warning'?'Peringatan parameter':'Informasi'}</strong><p>{a.text}</p><small>{a.tank} • {a.time}</small></div></div>)}</section>}
      {nav==='settings'&&<section className="panel settings-page"><div className="panel-head"><h3>Pengaturan Rentang Monitoring</h3><span className="pill demo">Untuk demonstrasi</span></div><p>Ubah batas contoh untuk menguji notifikasi. Rentang ini bukan rekomendasi universal untuk semua tanaman.</p><div className="thresholds">{[{key:'ph',name:'pH Larutan',unit:''},{key:'ec',name:'EC Nutrisi',unit:'mS/cm'},{key:'temp',name:'Suhu Air',unit:'°C'}].map(d=><div className="threshold" key={d.key}><strong>{d.name}</strong><label>Minimum<input type="number" step="0.1" value={limits[d.key][0]} onChange={e=>setLimits(s=>({...s,[d.key]:[Number(e.target.value),s[d.key][1]]}))}/></label><label>Maksimum<input type="number" step="0.1" value={limits[d.key][1]} onChange={e=>setLimits(s=>({...s,[d.key]:[s[d.key][0],Number(e.target.value)]}))}/></label><span>{d.unit}</span></div>)}</div><button className="outline" onClick={()=>setLimits(LIMITS)}>Reset rentang contoh</button></section>}
      <footer>© 2026 HydroGrow • Business Plan Competition Demo • Not for agricultural decision making • Data simulasi</footer>
    </main>
  </div>
}
