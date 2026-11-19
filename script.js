const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = "collegepro_data_v1";
const AUTH_KEY = "collegepro_user";
const departmentsSeed = [
 {id:1,name:"Computer Science",head:"Dr. Anita Rao",year:2008,description:"Computing, software engineering and emerging technologies."},
 {id:2,name:"Electronics & Communication",head:"Prof. Kiran Kumar",year:2006,description:"Electronics, communication systems and embedded technology."},
 {id:3,name:"Mechanical Engineering",head:"Dr. Ramesh Babu",year:2004,description:"Design, manufacturing and mechanical systems."},
 {id:4,name:"Civil Engineering",head:"Prof. Lakshmi Devi",year:2005,description:"Infrastructure, construction and environmental engineering."},
 {id:5,name:"Business Administration",head:"Dr. Neha Sharma",year:2010,description:"Management, business strategy and entrepreneurship."},
 {id:6,name:"Arts & Humanities",head:"Prof. S. Madhavi",year:2003,description:"Languages, communication, culture and humanities."}
];
const seed = {
 departments: departmentsSeed,
 students:[
  {id:1001,name:"Aarav Mehta",email:"aarav@college.edu",phone:"+91 9876543210",department:"Computer Science",year:"3rd Year",status:"Active",enrollment_date:"2024-06-01"},
  {id:1002,name:"Diya Sharma",email:"diya@college.edu",phone:"+91 9876543211",department:"Business Administration",year:"2nd Year",status:"Active",enrollment_date:"2025-06-01"},
  {id:1003,name:"Rohan Reddy",email:"rohan@college.edu",phone:"+91 9876543212",department:"Electronics & Communication",year:"4th Year",status:"Graduated",enrollment_date:"2022-06-01"},
  {id:1004,name:"Ananya Iyer",email:"ananya@college.edu",phone:"+91 9876543213",department:"Computer Science",year:"1st Year",status:"Enrolled",enrollment_date:"2026-06-10"},
  {id:1005,name:"Kabir Singh",email:"kabir@college.edu",phone:"+91 9876543214",department:"Mechanical Engineering",year:"3rd Year",status:"On Leave",enrollment_date:"2024-06-01"},
  {id:1006,name:"Meera Nair",email:"meera@college.edu",phone:"+91 9876543215",department:"Civil Engineering",year:"2nd Year",status:"Active",enrollment_date:"2025-06-01"}
 ],
 faculty:[
  {id:201,name:"Dr. Anita Rao",email:"anita@college.edu",department:"Computer Science",qualification:"Ph.D. Computer Science",join_date:"2018-06-15"},
  {id:202,name:"Prof. Kiran Kumar",email:"kiran@college.edu",department:"Electronics & Communication",qualification:"M.Tech. ECE",join_date:"2019-07-01"},
  {id:203,name:"Dr. Neha Sharma",email:"neha@college.edu",department:"Business Administration",qualification:"Ph.D. Management",join_date:"2017-08-10"},
  {id:204,name:"Dr. Ramesh Babu",email:"ramesh@college.edu",department:"Mechanical Engineering",qualification:"Ph.D. Mechanical",join_date:"2016-01-12"}
 ],
 courses:[
  {id:301,name:"Data Structures & Algorithms",code:"CS301",department:"Computer Science",credits:4,faculty_id:201,schedule:"Mon · 09:00 AM"},
  {id:302,name:"Database Management Systems",code:"CS302",department:"Computer Science",credits:3,faculty_id:201,schedule:"Tue · 11:00 AM"},
  {id:303,name:"Web Development",code:"CS305",department:"Computer Science",credits:3,faculty_id:201,schedule:"Wed · 10:00 AM"},
  {id:304,name:"Machine Learning",code:"CS401",department:"Computer Science",credits:4,faculty_id:201,schedule:"Thu · 02:00 PM"},
  {id:305,name:"Business Analytics",code:"BA202",department:"Business Administration",credits:3,faculty_id:203,schedule:"Fri · 11:00 AM"},
  {id:306,name:"Digital Marketing",code:"BA204",department:"Business Administration",credits:3,faculty_id:203,schedule:"Mon · 01:00 PM"}
 ],
 attendance:[],
 timetable:[
  {id:401,day:"Monday",time:"09:00 AM - 10:00 AM",course_id:301,faculty_id:201,room:"CS-201",department:"Computer Science"},
  {id:402,day:"Tuesday",time:"11:00 AM - 12:00 PM",course_id:302,faculty_id:201,room:"CS-204",department:"Computer Science"},
  {id:403,day:"Wednesday",time:"10:00 AM - 11:00 AM",course_id:303,faculty_id:201,room:"Lab-02",department:"Computer Science"},
  {id:404,day:"Thursday",time:"02:00 PM - 03:00 PM",course_id:304,faculty_id:201,room:"CS-301",department:"Computer Science"},
  {id:405,day:"Friday",time:"11:00 AM - 12:00 PM",course_id:305,faculty_id:203,room:"MBA-101",department:"Business Administration"}
 ]
};
let data = loadData();
let currentUser = null;
let authMode = "login";
let modalConfig = null;
let toastTimer;

function loadData(){
 try { const saved=localStorage.getItem(STORAGE_KEY); return saved ? {...structuredClone(seed),...JSON.parse(saved)} : structuredClone(seed); }
 catch(e){ return structuredClone(seed); }
}
function saveData(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); renderAll(); }
function esc(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function initials(name=""){return name.split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase();}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
function nextId(list){return Math.max(0,...list.map(x=>Number(x.id)||0))+1;}
function dateToday(){return new Date().toISOString().slice(0,10);}
function facultyName(id){return data.faculty.find(x=>x.id==id)?.name || "Not assigned";}
function courseName(id){return data.courses.find(x=>x.id==id)?.name || "Unknown course";}
function deptOptions(selected=""){return data.departments.map(d=>`<option ${d.name===selected?"selected":""}>${esc(d.name)}</option>`).join("");}
function facultyOptions(selected=""){return data.faculty.map(f=>`<option value="${f.id}" ${f.id==selected?"selected":""}>${esc(f.name)}</option>`).join("");}
function courseOptions(selected=""){return data.courses.map(c=>`<option value="${c.id}" ${c.id==selected?"selected":""}>${esc(c.name)}</option>`).join("");}

function showApp(user){
 currentUser=user; $("#loginScreen").classList.add("hidden");$("#app").classList.remove("hidden");
 const name=user.name||"Administrator";$("#userName").textContent=name;$("#welcomeName").textContent=name.split(" ")[0];$("#userAvatar").textContent=initials(name);
 $("#todayDate").textContent=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short",year:"numeric"});
 renderAll();
}
function showLogin(){ $("#app").classList.add("hidden");$("#loginScreen").classList.remove("hidden"); }
$$(".auth-tab").forEach(btn=>btn.addEventListener("click",()=>{
 authMode=btn.dataset.auth;$$(".auth-tab").forEach(x=>x.classList.toggle("active",x===btn));
 const reg=authMode==="register";$("#authName").classList.toggle("hidden",!reg);$("#nameLabel").classList.toggle("hidden",!reg);$("#authName").required=reg;$("#authSubmit").textContent=reg?"Create account":"Sign in";$("#authError").textContent="";
}));
$("#authForm").addEventListener("submit",e=>{
 e.preventDefault();const email=$("#authEmail").value.trim().toLowerCase(),password=$("#authPassword").value;
 if(authMode==="login"){
  const stored=JSON.parse(localStorage.getItem("collegepro_accounts")||"[]");
  const user=email==="admin@collegepro.edu"&&password==="admin123"?{name:"Administrator",email}:stored.find(x=>x.email===email&&x.password===password);
  if(!user){$("#authError").textContent="Incorrect email or password. Try the demo access shown below.";return;}
  localStorage.setItem(AUTH_KEY,JSON.stringify(user));showApp(user);
 }else{
  const name=$("#authName").value.trim();if(!name){$("#authError").textContent="Please enter your name.";return;}
  const users=JSON.parse(localStorage.getItem("collegepro_accounts")||"[]");
  if(users.some(x=>x.email===email)){ $("#authError").textContent="An account with this email already exists.";return;}
  const user={name,email,password};users.push(user);localStorage.setItem("collegepro_accounts",JSON.stringify(users));localStorage.setItem(AUTH_KEY,JSON.stringify(user));showApp(user);toast("Account created successfully");
 }
});
$("#logoutBtn").addEventListener("click",()=>{localStorage.removeItem(AUTH_KEY);showLogin();});
const savedUser=localStorage.getItem(AUTH_KEY);if(savedUser){try{showApp(JSON.parse(savedUser));}catch(e){showLogin();}}else showLogin();

function navigate(page){
 $$(".page").forEach(p=>p.classList.remove("active"));$(`#${page}Page`)?.classList.add("active");
 $$(".nav-link[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 $("#pageTitle").textContent=({dashboard:"Dashboard",students:"Students",faculty:"Faculty",courses:"Courses",departments:"Departments",attendance:"Attendance",timetable:"Timetable",reports:"Reports"})[page]||"Dashboard";
 $("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-link[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("collegepro_dark",document.body.classList.contains("dark")?"1":"0");});
if(localStorage.getItem("collegepro_dark")==="1")document.body.classList.add("dark");

function renderAll(){renderDashboard();renderStudents();renderFaculty();renderCourses();renderDepartments();renderAttendance();renderTimetable();renderReports();fillFilters();}
function fillFilters(){
 const pairs=[["studentDeptFilter"],["facultyDeptFilter"],["courseDeptFilter"],["attendanceDeptFilter"],["timetableDept"]];
 pairs.forEach(([id])=>{const el=$("#"+id);if(!el)return;const val=el.value;el.innerHTML='<option value="">All departments</option>'+deptOptions();el.value=val;});
}
function renderDashboard(){
 $("#statStudents").textContent=data.students.length;$("#statFaculty").textContent=data.faculty.length;$("#statCourses").textContent=data.courses.length;$("#statDepartments").textContent=data.departments.length;
 const counts=data.departments.map(d=>({name:d.name,count:data.students.filter(s=>s.department===d.name).length}));
 const max=Math.max(1,...counts.map(x=>x.count));
 $("#departmentChart").innerHTML=counts.map(x=>`<div class="bar-row"><span>${esc(x.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${x.count/max*100}%"></div></div><b class="bar-value">${x.count}</b></div>`).join("");
 const today=dateToday(),entries=data.attendance.filter(a=>a.date===today),present=entries.filter(a=>a.status==="Present").length,absent=entries.filter(a=>a.status==="Absent").length,marked=present+absent,unmarked=Math.max(0,data.students.length-marked),pct=marked?Math.round(present/marked*100):0;
 $("#attendancePercent").textContent=pct+"%";$("#presentCount").textContent=present;$("#absentCount").textContent=absent;$("#unmarkedCount").textContent=unmarked;$("#attendanceRing").style.background=`conic-gradient(var(--green) ${pct*3.6}deg,#edf1f6 0deg)`;
 $("#recentStudents").innerHTML=[...data.students].slice(-5).reverse().map(s=>`<tr><td><div class="person-cell"><span class="mini-avatar">${initials(s.name)}</span><div><b>${esc(s.name)}</b><small>${esc(s.email)}</small></div></div></td><td>${esc(s.department)}</td><td>${esc(s.year)}</td><td>${statusBadge(s.status)}</td></tr>`).join("")||emptyRow(4);
}
function statusBadge(status){return `<span class="status ${esc(status).replace(/\s/g,".")}">${esc(status)}</span>`;}
function emptyRow(cols,msg="No records found"){return `<tr><td colspan="${cols}" class="empty">${msg}</td></tr>`;}
function person(name,email){return `<div class="person-cell"><span class="mini-avatar">${initials(name)}</span><div><b>${esc(name)}</b><small>${esc(email)}</small></div></div>`;}

function renderStudents(){
 const q=($("#studentSearch")?.value||"").toLowerCase(),st=$("#studentStatusFilter")?.value||"",dep=$("#studentDeptFilter")?.value||"";
 const rows=data.students.filter(s=>(`${s.name} ${s.email} ${s.id}`.toLowerCase().includes(q))&&(!st||s.status===st)&&(!dep||s.department===dep));
 $("#studentsTable").innerHTML=rows.map(s=>`<tr><td>${person(s.name,s.email)}</td><td>STU-${s.id}</td><td>${esc(s.department)}</td><td>${esc(s.year)}</td><td>${statusBadge(s.status)}</td><td><button class="action-btn" data-edit="students" data-id="${s.id}">Edit</button><button class="action-btn delete" data-delete="students" data-id="${s.id}">Delete</button></td></tr>`).join("")||emptyRow(6);
}
function renderFaculty(){
 const q=($("#facultySearch")?.value||"").toLowerCase(),dep=$("#facultyDeptFilter")?.value||"";
 const rows=data.faculty.filter(f=>(`${f.name} ${f.email} ${f.id}`.toLowerCase().includes(q))&&(!dep||f.department===dep));
 $("#facultyTable").innerHTML=rows.map(f=>`<tr><td>${person(f.name,f.email)}</td><td>FAC-${f.id}</td><td>${esc(f.department)}</td><td>${esc(f.qualification)}</td><td>${esc(f.join_date)}</td><td><button class="action-btn" data-edit="faculty" data-id="${f.id}">Edit</button><button class="action-btn delete" data-delete="faculty" data-id="${f.id}">Delete</button></td></tr>`).join("")||emptyRow(6);
}
function renderCourses(){
 const q=($("#courseSearch")?.value||"").toLowerCase(),dep=$("#courseDeptFilter")?.value||"";
 const rows=data.courses.filter(c=>(`${c.name} ${c.code}`.toLowerCase().includes(q))&&(!dep||c.department===dep));
 $("#courseCards").innerHTML=rows.map(c=>`<article class="course-card"><div class="course-top"><span class="course-code">${esc(c.code)}</span><span class="tag">${c.credits} credits</span></div><h3>${esc(c.name)}</h3><p>${esc(c.department)}</p><div class="course-meta"><span>Faculty: ${esc(facultyName(c.faculty_id))}</span><span>${esc(c.schedule||"Schedule pending")}</span></div><div class="card-actions"><button class="action-btn" data-edit="courses" data-id="${c.id}">Edit</button><button class="action-btn delete" data-delete="courses" data-id="${c.id}">Delete</button></div></article>`).join("")||`<div class="panel empty">No courses found.</div>`;
}
function renderDepartments(){
 $("#departmentCards").innerHTML=data.departments.map(d=>`<article class="department-card"><div class="dept-icon">▥</div><h3>${esc(d.name)}</h3><p>${esc(d.description)}</p><div class="course-meta"><span>Head: ${esc(d.head)}</span><span>Since ${d.year}</span></div><p><b>${data.students.filter(s=>s.department===d.name).length}</b> students · <b>${data.faculty.filter(f=>f.department===d.name).length}</b> faculty</p><div class="card-actions"><button class="action-btn" data-edit="departments" data-id="${d.id}">Edit</button><button class="action-btn delete" data-delete="departments" data-id="${d.id}">Delete</button></div></article>`).join("")||`<div class="panel empty">No departments created.</div>`;
}
function renderAttendance(){
 const date=$("#attendanceDate").value||dateToday();if(!$("#attendanceDate").value)$("#attendanceDate").value=date;
 const dep=$("#attendanceDeptFilter").value,q=$("#attendanceSearch").value.toLowerCase();
 const rows=data.students.filter(s=>(!dep||s.department===dep)&&(`${s.name} ${s.id}`.toLowerCase().includes(q)));
 $("#attendanceTable").innerHTML=rows.map(s=>{const entry=data.attendance.find(a=>a.student_id===s.id&&a.date===date);return `<tr><td>${person(s.name,"STU-"+s.id)}</td><td>${esc(s.department)}</td><td><select class="attendance-select" data-attendance="${s.id}"><option value="Unmarked" ${!entry||entry.status==="Unmarked"?"selected":""}>Not marked</option><option value="Present" ${entry?.status==="Present"?"selected":""}>Present</option><option value="Absent" ${entry?.status==="Absent"?"selected":""}>Absent</option></select></td></tr>`;}).join("")||emptyRow(3);
}
function renderTimetable(){
 const day=$("#timetableDay").value,dep=$("#timetableDept").value;
 const rows=data.timetable.filter(t=>(!day||t.day===day)&&(!dep||t.department===dep)).sort((a,b)=>["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(a.day)-["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(b.day));
 $("#timetableTable").innerHTML=rows.map(t=>`<tr><td><b>${esc(t.day)}</b></td><td>${esc(t.time)}</td><td>${esc(courseName(t.course_id))}</td><td>${esc(facultyName(t.faculty_id))}</td><td>${esc(t.room)}</td><td><button class="action-btn" data-edit="timetable" data-id="${t.id}">Edit</button><button class="action-btn delete" data-delete="timetable" data-id="${t.id}">Delete</button></td></tr>`).join("")||emptyRow(6);
}
function renderReports(){
 const active=data.students.filter(s=>s.status==="Active"||s.status==="Enrolled").length,grad=data.students.filter(s=>s.status==="Graduated").length;
 $("#reportActive").textContent=active;$("#reportGraduated").textContent=grad;$("#reportRatio").textContent=`1:${data.faculty.length?Math.round(data.students.length/data.faculty.length):0}`;
 const marked=data.attendance.filter(a=>a.status==="Present"||a.status==="Absent"),pct=marked.length?Math.round(marked.filter(a=>a.status==="Present").length/marked.length*100):0;$("#reportAttendance").textContent=pct+"%";
 $("#reportTable").innerHTML=data.departments.map(d=>`<tr><td>${esc(d.name)}</td><td>${data.students.filter(s=>s.department===d.name).length}</td><td>${data.faculty.filter(f=>f.department===d.name).length}</td><td>${data.courses.filter(c=>c.department===d.name).length}</td></tr>`).join("")||emptyRow(4);
}

const field=(label,name,type="text",value="",opts=null,required=true,full=false)=>({label,name,type,value,opts,required,full});
const configs={
 students:{title:"Student",fields:[field("Full name","name"),field("Email address","email","email"),field("Phone number","phone","tel"),field("Department","department","select","", "departments"),field("Academic year","year","select","1st Year",["1st Year","2nd Year","3rd Year","4th Year"]),field("Status","status","select","Active",["Active","Enrolled","Graduated","On Leave","Dropped"]),field("Enrollment date","enrollment_date","date",dateToday())]},
 faculty:{title:"Faculty member",fields:[field("Full name","name"),field("Email address","email","email"),field("Department","department","select","","departments"),field("Qualification","qualification"),field("Joining date","join_date","date",dateToday())]},
 courses:{title:"Course",fields:[field("Course name","name"),field("Course code","code"),field("Department","department","select","","departments"),field("Credits","credits","number","3"),field("Faculty","faculty_id","select","","faculty"),field("Schedule","schedule","text","",null,false)]},
 departments:{title:"Department",fields:[field("Department name","name"),field("Department head","head"),field("Established year","year","number","2020"),field("Description","description","textarea","",null,false,true)]},
 timetable:{title:"Class",fields:[field("Day","day","select","Monday",["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]),field("Time","time","text","09:00 AM - 10:00 AM"),field("Course","course_id","select","","courses"),field("Faculty","faculty_id","select","","faculty"),field("Room","room"),field("Department","department","select","","departments")]}
};
function openModal(type,id=null){
 modalConfig={type,id};const cfg=configs[type];const record=id?data[type].find(x=>x.id==id):{};
 $("#modalTitle").textContent=(id?"Edit ":"Add ")+cfg.title;$("#modalSubtitle").textContent=id?"Update the record details.":"Enter the details below.";
 $("#modalFields").innerHTML=cfg.fields.map(f=>{
  let value=record?.[f.name]??f.value??"",opts=f.opts;
  if(opts==="departments")opts=data.departments.map(d=>d.name);
  if(opts==="faculty")opts=data.faculty.map(x=>({value:x.id,label:x.name}));
  if(opts==="courses")opts=data.courses.map(x=>({value:x.id,label:x.name}));
  let control="";
  if(f.type==="select")control=`<select name="${f.name}" ${f.required?"required":""}>${(opts||[]).map(o=>{const v=typeof o==="object"?o.value:o,l=typeof o==="object"?o.label:o;return `<option value="${esc(v)}" ${String(v)===String(value)?"selected":""}>${esc(l)}</option>`;}).join("")}</select>`;
  else if(f.type==="textarea")control=`<textarea name="${f.name}" ${f.required?"required":""}>${esc(value)}</textarea>`;
  else control=`<input name="${f.name}" type="${f.type}" value="${esc(value)}" ${f.required?"required":""} ${f.type==="number"?"min='0'":""}>`;
  return `<div class="field ${f.full?"full-width":""}"><label>${f.label}</label>${control}</div>`;
 }).join("");
 $("#modalBackdrop").classList.remove("hidden");
}
function closeModal(){$("#modalBackdrop").classList.add("hidden");modalConfig=null;}
$("#closeModal").addEventListener("click",closeModal);$("#cancelModal").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal();});
$("#recordForm").addEventListener("submit",e=>{
 e.preventDefault();if(!modalConfig)return;const {type,id}=modalConfig,cfg=configs[type],fd=new FormData(e.target),record={};
 cfg.fields.forEach(f=>{let v=fd.get(f.name);if(f.type==="number")v=Number(v);if(f.name==="faculty_id"||f.name==="course_id")v=Number(v);record[f.name]=v;});
 if(id){const idx=data[type].findIndex(x=>x.id==id);data[type][idx]={...data[type][idx],...record};}
 else{record.id=nextId(data[type]);data[type].push(record);}
 saveData();closeModal();toast(`${cfg.title} ${id?"updated":"added"} successfully`);
});
$("#addStudentBtn").addEventListener("click",()=>openModal("students"));$("#addFacultyBtn").addEventListener("click",()=>openModal("faculty"));$("#addCourseBtn").addEventListener("click",()=>openModal("courses"));$("#addDepartmentBtn").addEventListener("click",()=>openModal("departments"));$("#addTimetableBtn").addEventListener("click",()=>openModal("timetable"));

document.addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
 if(edit)openModal(edit.dataset.edit,Number(edit.dataset.id));
 if(del){const type=del.dataset.delete,id=Number(del.dataset.id);if(!confirm("Delete this record?"))return;
  data[type]=data[type].filter(x=>x.id!==id);
  if(type==="students")data.attendance=data.attendance.filter(a=>a.student_id!==id);
  if(type==="faculty")data.courses.forEach(c=>{if(c.faculty_id===id)c.faculty_id="";});
  if(type==="courses")data.timetable=data.timetable.filter(t=>t.course_id!==id);
  saveData();toast("Record deleted");
 }
});
["studentSearch","studentStatusFilter","studentDeptFilter"].forEach(id=>$("#"+id).addEventListener("input",renderStudents));
["facultySearch","facultyDeptFilter"].forEach(id=>$("#"+id).addEventListener("input",renderFaculty));
["courseSearch","courseDeptFilter"].forEach(id=>$("#"+id).addEventListener("input",renderCourses));
["attendanceDate","attendanceDeptFilter","attendanceSearch"].forEach(id=>$("#"+id).addEventListener("input",renderAttendance));
["timetableDay","timetableDept"].forEach(id=>$("#"+id).addEventListener("change",renderTimetable));
$("#saveAttendanceBtn").addEventListener("click",()=>{
 const date=$("#attendanceDate").value||dateToday();
 $$("[data-attendance]").forEach(sel=>{const student_id=Number(sel.dataset.attendance),status=sel.value;data.attendance=data.attendance.filter(a=>!(a.student_id===student_id&&a.date===date));if(status!=="Unmarked")data.attendance.push({id:nextId(data.attendance),student_id,date,status});});
 saveData();toast("Attendance saved for "+date);
});

function csvEscape(v){return `"${String(v??"").replace(/"/g,'""')}"`;}
function downloadCSV(filename,rows){if(!rows.length){toast("No data to export");return;}const csv=[Object.keys(rows[0]).map(csvEscape).join(","),...rows.map(r=>Object.values(r).map(csvEscape).join(","))].join("\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);toast("CSV downloaded");}
$("#exportReportBtn").addEventListener("click",()=>downloadCSV("collegepro-students.csv",data.students));
$("#exportFacultyBtn").addEventListener("click",()=>downloadCSV("collegepro-faculty.csv",data.faculty));
$("#exportCoursesBtn").addEventListener("click",()=>downloadCSV("collegepro-courses.csv",data.courses.map(c=>({...c,faculty:facultyName(c.faculty_id)}))));
$("#backupBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="collegepro-backup.json";a.click();URL.revokeObjectURL(url);toast("Backup downloaded");});
