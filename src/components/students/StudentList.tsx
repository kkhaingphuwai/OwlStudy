// import { useEffect } from "react";
// import { useStore } from "../store/useStore";
// import { observer } from "mobx-react-lite";
// import LoaderIcon from "../common/LoaderIcon";

// const StudentList = observer(() => {

//     const { studentStore } = useStore();

//     useEffect(() => {
//         studentStore.getAllAssignedStudents(1);
//     }, []);

//     return (
//         <div className="min-h-screen bg-[#F8FAFC] px-6 py-12 font-sans text-slate-900">
//             {/* ── Header ── */}
//             <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
//                 <div className="text-center md:text-left">
//                     <h1 className="font-extrabold text-5xl tracking-tighter text-black mb-2">
//                         Directory
//                     </h1>
//                     <p className="text-slate-400 font-medium tracking-wide uppercase text-[10px]">
//                         Management Portal <span className="mx-2">•</span>
//                         <span className="text-indigo-600">{studentStore.state.assignedStudents.length} Students</span>
//                     </p>
//                 </div>

//                 <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
//                     <div className="bg-gradient-to-br from-orange-500 to-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
//                         {new Date().toLocaleDateString("en-US", { month: "long" })}
//                     </div>
//                     <div className="pr-4 text-slate-400 font-bold text-xs">{new Date().getFullYear()}</div>
//                 </div>
//             </header>

//             {/* ── Grid ── */}
//             <div className="max-w-6xl mx-auto">
//                 {studentStore.state.loading ? (
//                     <LoaderIcon />
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {studentStore.state.assignedStudents.map((student, i) => (
//                             <div
//                                 key={student.id}
//                                 className="group relative bg-white border border-slate-200/60 rounded-[2.5rem] p-8 hover:border-orange-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
//                             >
//                                 {/* Top Row: Avatar & Status */}
//                                 <div className="flex justify-between items-start mb-8">
//                                     <div className="relative">
//                                         <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-700 transition-transform group-hover:scale-105">
//                                             {student.fullName.charAt(0)}
//                                         </div>
//                                     </div>

//                                     <button className="cursor-pointer text-slate-500 hover:text-orange-600 transition-colors p-2 bg-slate-50 rounded-full group-hover:bg-indigo-50">
//                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
//                                         </svg>
//                                     </button>
//                                 </div>

//                                 {/* Identity Section */}
//                                 <div className="space-y-1 mb-6">
//                                     <h3 className="font-bold text-2xl tracking-tight text-slate-900">
//                                         {student.fullName}
//                                     </h3>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// });

// export default StudentList;