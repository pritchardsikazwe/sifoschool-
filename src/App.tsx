import { useState } from 'react';
import { BookOpen, Users, GraduationCap, CalendarCheck, Wallet, ClipboardList, Settings, Search, Bell, ChevronDown } from 'lucide-react';

const sections = [
  { name: 'Overview', icon: BookOpen }, { name: 'Students', icon: Users },
  { name: 'Admissions', icon: GraduationCap }, { name: 'Attendance', icon: CalendarCheck },
  { name: 'Fees & Billing', icon: Wallet }, { name: 'Assessments', icon: ClipboardList },
];

export default function App() {
  const [active, setActive] = useState('Overview');
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">S</span><span>Sifo<span className="brand-gold">School</span><small>School management</small></span></a>
      <nav className="main-nav">{sections.map(s => <button key={s.name} className={active === s.name ? 'nav-item active' : 'nav-item'} onClick={() => setActive(s.name)}>{s.name}</button>)}</nav>
      <div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18}/></button><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button><button className="profile">Admin <ChevronDown size={14}/></button></div>
    </header>
    <main className="content"><div className="page-heading"><div><p className="eyebrow">SCHOOL ADMINISTRATION</p><h1>{active}</h1><p className="muted">Your school at a glance. Connect your school workspace when setup is ready.</p></div><button className="primary-button">+ Add {active === 'Overview' ? 'student' : active.toLowerCase().replace(/s$/, '')}</button></div>
      <div className="notice"><strong>Welcome to SifoSchool</strong><span>This is the independent application foundation. Sample dashboard figures are placeholders; no live school data is connected.</span></div>
      <section className="stats-grid">{[['Total students','0','Registered learners'],['Present today','—','Attendance not configured'],['Fees collected','K0.00','Current school year'],['Outstanding fees','K0.00','Awaiting setup']].map(([label,value,sub])=><article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>)}</section>
      <section className="panel-grid"><article className="panel"><div className="panel-title"><h2>School workspace</h2><span className="status-pill">Setup pending</span></div><p className="muted">Choose a section from the top navigation to begin building your school operations.</p><div className="quick-links">{sections.slice(1).map(s=><button key={s.name} onClick={()=>setActive(s.name)}><s.icon size={18}/>{s.name}<span>→</span></button>)}</div></article><article className="panel"><h2>Getting started</h2><ol className="steps"><li>Create school profile and academic year</li><li>Set up classes, streams and subjects</li><li>Register students and guardians</li><li>Configure fees, terms and permissions</li></ol></article></section>
      <footer>© {new Date().getFullYear()} Sifonet Technologies · SifoSchool</footer>
    </main>
  </div>;
}
