import { useMemo, useState } from 'react';
import { LayoutDashboard, Users, UserPlus, School, CalendarCheck, ClipboardList, Wallet, BriefcaseBusiness, Clock3, ChartNoAxesCombined, Settings, Search, Bell, Plus, Pencil, Trash2, X, ChevronDown, BookOpen, ShieldCheck } from 'lucide-react';

type Row = { id: number; name: string; detail: string; status: string };
const modules = [
  { name: 'Dashboard', icon: LayoutDashboard }, { name: 'Students', icon: Users },
  { name: 'Admissions', icon: UserPlus }, { name: 'Classes & Subjects', icon: School },
  { name: 'Attendance', icon: CalendarCheck }, { name: 'Exams & Results', icon: ClipboardList },
  { name: 'Fees & Billing', icon: Wallet }, { name: 'Staff', icon: BriefcaseBusiness },
  { name: 'Timetable', icon: Clock3 }, { name: 'Reports', icon: ChartNoAxesCombined },
  { name: 'Settings', icon: Settings },
];
const descriptions: Record<string,string> = {
  Students:'Student profiles, guardians, contacts and enrolment history.',
  Admissions:'Track enquiries, applications, admission decisions and enrolment.',
  'Classes & Subjects':'Organise academic years, grades, classes, streams and subjects.',
  Attendance:'Record daily attendance and monitor absences.',
  'Exams & Results':'Manage assessment schedules, marks, grading and report cards.',
  'Fees & Billing':'Set fee structures, issue invoices and record receipts.',
  Staff:'Manage teachers, support staff, roles and assignments.',
  Timetable:'Plan lessons, rooms, teachers and school events.',
  Reports:'Review enrolment, attendance, academic and fee performance.',
  Settings:'Configure school profile, academic year, terms and access permissions.',
};
const emptyRecords: Record<string, Row[]> = Object.fromEntries(modules.map(m=>[m.name,[]]));
export default function App() {
  const [active,setActive]=useState('Dashboard');
  const [records,setRecords]=useState<Record<string,Row[]>>(emptyRecords);
  const [query,setQuery]=useState('');
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState<Row|null>(null);
  const [name,setName]=useState('');
  const [detail,setDetail]=useState('');
  const [status,setStatus]=useState('Active');
  const [notice,setNotice]=useState('Demo workspace is ready. Connect your own backend before entering real student or financial records.');
  const allRows=useMemo(()=>Object.values(records).flat(),[records]);
  const visible=(records[active]||[]).filter(r=>(r.name+' '+r.detail+' '+r.status).toLowerCase().includes(query.toLowerCase()));
  const openAdd=()=>{setEditing(null);setName('');setDetail('');setStatus('Active');setModal(true);};
  const openEdit=(r:Row)=>{setEditing(r);setName(r.name);setDetail(r.detail);setStatus(r.status);setModal(true);};
  const save=()=>{if(!name.trim())return;setRecords(prev=>({...prev,[active]:editing?(prev[active]||[]).map(r=>r.id===editing.id?{...r,name:name.trim(),detail:detail.trim(),status}:r):[...(prev[active]||[]),{id:Date.now(),name:name.trim(),detail:detail.trim(),status}]}));setModal(false);setNotice(editing?'Record updated in this demo session.':'Record added to this demo session.');};
  const remove=(id:number)=>{if(confirm('Delete this demo record?'))setRecords(prev=>({...prev,[active]:(prev[active]||[]).filter(r=>r.id!==id)}));};
  const activeModule=modules.find(m=>m.name===active)!;
  const Icon=activeModule.icon;
  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark">S</span><span>Sifo<span className="brand-gold">School</span><small>School management platform</small></span></a>
      <nav className="main-nav">{modules.map(m=>{const I=m.icon;return <button key={m.name} className={active===m.name?'nav-item active':'nav-item'} onClick={()=>{setActive(m.name);setQuery('');}}><I size={15}/>{m.name}</button>;})}</nav>
      <div className="top-actions"><span className="demo-label">DEMO</span><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button><button className="profile">Administrator <ChevronDown size={14}/></button></div>
    </header>
    <main className="content">
      <div className="page-heading"><div><p className="eyebrow">SIFONET TECHNOLOGIES · SCHOOL OPERATIONS</p><h1>{active}</h1><p className="muted">{descriptions[active]||'A clear view of your school operations and daily activity.'}</p></div>{active!=='Dashboard'&&active!=='Reports'&&active!=='Settings'&&<button className="primary-button" onClick={openAdd}><Plus size={16}/> Add {active==='Students'?'student':'record'}</button>}</div>
      <div className="notice"><ShieldCheck size={18}/><div><strong>Independent SifoSchool workspace</strong><span>{notice} Changes currently live only in this browser session.</span></div><button aria-label="Dismiss" onClick={()=>setNotice('Demo workspace. No live backend is connected.')}><X size={16}/></button></div>
      {active==='Dashboard'?<><section className="stats-grid">{[['Student records',records.Students.length,'Students'],['Admissions',records.Admissions.length,'Applications'],['Staff records',records.Staff.length,'Staff members'],['Tracked records',allRows.length,'Across all modules']].map(([label,value,sub])=><article className="stat-card" key={String(label)}><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>)}</section><section className="panel-grid"><article className="panel"><div className="panel-title"><h2>School workspace</h2><span className="status-pill">Demo mode</span></div><p className="muted">Open a module to manage its records. Start with the school profile, academic year and class structure.</p><div className="quick-links">{modules.slice(1,9).map(m=>{const I=m.icon;return <button key={m.name} onClick={()=>setActive(m.name)}><I size={18}/>{m.name}<span>→</span></button>;})}</div></article><article className="panel"><h2>Recommended setup sequence</h2><ol className="steps"><li>Set up school profile and academic year</li><li>Create terms, grades, classes and subjects</li><li>Register students and guardians</li><li>Add staff and assign permissions</li><li>Configure fees, attendance and assessments</li></ol></article></section></>:active==='Reports'?<section className="panel"><h2>School reports centre</h2><p className="muted">Report templates are prepared for the connected data phase.</p><div className="report-grid">{['Enrolment register','Daily attendance','Fee collection & arrears','Academic performance','Staff directory','Class lists'].map(x=><div className="report-tile" key={x}><BookOpen size={19}/><strong>{x}</strong><span>Available after data setup</span></div>)}</div></section>:active==='Settings'?<section className="panel"><h2>School configuration</h2><div className="settings-grid">{[['School profile','Name, address, contacts and logo'],['Academic year','Years, terms and opening dates'],['Grading system','Grade bands, marks and pass rules'],['User access','Roles, permissions and approvals'],['Notifications','SMS, email and parent communication'],['Data & backups','Supabase connection and backup policy']].map(([a,b])=><div className="setting-row" key={a}><strong>{a}</strong><span>{b}</span><em>Configure in next setup phase</em></div>)}</div></section>:<section className="panel"><div className="table-toolbar"><div><h2>{active} register</h2><p className="muted">{visible.length} records shown · {descriptions[active]}</p></div><label className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..."/></label></div>{visible.length===0?<div className="empty-state"><div className="empty-icon"><Icon size={24}/></div><strong>No {active.toLowerCase()} yet</strong><span>Add your first record to start testing this module. Data is temporary in demo mode.</span><button className="primary-button" onClick={openAdd}><Plus size={15}/> Add first record</button></div>:<div className="table-wrap"><table><thead><tr><th>Name / Reference</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map(r=><tr key={r.id}><td><strong>{r.name}</strong><small>REF-{String(r.id).slice(-6)}</small></td><td>{r.detail||'—'}</td><td><span className="record-status">{r.status}</span></td><td><div className="row-actions"><button onClick={()=>openEdit(r)} aria-label="Edit"><Pencil size={15}/></button><button onClick={()=>remove(r.id)} aria-label="Delete"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>}</section>}
      <footer>© {new Date().getFullYear()} Sifonet Technologies · SifoSchool · Independent application</footer>
    </main>
    {modal&&<div className="modal-backdrop" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">SIFOSCHOOL · {active.toUpperCase()}</p><h2>{editing?'Edit record':'Add new record'}</h2></div><button className="close-button" onClick={()=>setModal(false)}><X size={19}/></button></div><label>Full name / title<input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Enter name or title"/></label><label>Details / reference<input value={detail} onChange={e=>setDetail(e.target.value)} placeholder="Optional details"/></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option>Active</option><option>Pending</option><option>Inactive</option></select></label><div className="modal-actions"><button className="secondary-button" onClick={()=>setModal(false)}>Cancel</button><button className="primary-button" onClick={save} disabled={!name.trim()}>{editing?'Save changes':'Save record'}</button></div></div></div>}
  </div>;
}
