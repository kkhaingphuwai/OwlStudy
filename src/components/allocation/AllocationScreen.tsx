import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { observer } from "mobx-react-lite";
import LoaderIcon from "../common/LoaderIcon";
import type { TutorAllocation } from "../store/staff/state";

const AllocationScreen = observer(() => {

    const { tutorStore, studentStore, staffStore } = useStore();

    // --- STUDENT PAGINATION STATE ---
    const ITEMS_PER_PAGE = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const students = studentStore.state.filterStudents ?? [];
    const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
    const paginatedStudents = students.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // --- TUTOR PAGINATION & SEARCH STATE ---
    const TUTORS_PER_PAGE = 4;
    const [tutorCurrentPage, setTutorCurrentPage] = useState(1);
    const [tutorSearchText, setTutorSearchText] = useState("");

    const filteredTutors = (tutorStore.state.tutors ?? []).filter(tutor =>
        tutor.fullName.toLowerCase().includes(tutorSearchText.toLowerCase()) ||
        tutor.expertise.toLowerCase().includes(tutorSearchText.toLowerCase())
    );

    const tutorTotalPages = Math.ceil(filteredTutors.length / TUTORS_PER_PAGE);
    const paginatedTutors = filteredTutors.slice(
        (tutorCurrentPage - 1) * TUTORS_PER_PAGE,
        tutorCurrentPage * TUTORS_PER_PAGE
    );

    useEffect(() => {
        clearData();
        tutorStore.getAllTutors();
        studentStore.getAllUnassignedStudents();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [studentStore.state.searchText]);

    useEffect(() => {
        setTutorCurrentPage(1);
    }, [tutorSearchText]);

    useEffect(() => {
        staffStore.getAllAllocation();
    }, [])

    const clearData = () => {
        tutorStore.state.clearSelectedTutor();
        studentStore.state.clearSelectedStudents();
    };

    const toggleStudent = (id: number) => {
        studentStore.state.toggleStudent(id);
    };

    const [selectedAllocation, setSelectedAllocation] = useState<TutorAllocation | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openRelocateDrawer = (allocate: TutorAllocation) => {
        setSelectedAllocation(allocate);
        setIsDrawerOpen(true);
    };

    const closeRelocateDrawer = () => {
        setSelectedAllocation(null);
        setIsDrawerOpen(false);
    };

    const handleBulkAllocate = async () => {
        const tutorId = tutorStore.state.selectedTutor?.id;
        const studentsId = studentStore.state.selectedStudent;

        if (!tutorId || studentsId.length === 0) return;

        await staffStore.bulkAllocateStudents(studentsId, tutorId);

        studentStore.state.removeStudentsByIds(studentsId);

        await staffStore.getAllAllocation();
    };

    const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);

    const handleReallocate = async () => {
        if (!selectedTutorId || !selectedAllocation) return;
        await staffStore.bulkAllocateStudents([selectedAllocation.studentId], selectedTutorId);
        await staffStore.getAllAllocation();
        closeRelocateDrawer();
    };

    const handleOnChagne = (value: string) => {
        studentStore.state.searchStudent(value);
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8">
            {/* Header Section */}
            <header className="max-w-[1600px] mx-auto mb-10 flex justify-between items-end">
                <div>
                    <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
                        Management System
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Allocation
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Active Session
                    </p>
                </div>
            </header>

            {/* 1. Added 'relative' here to contain the absolute loader */}
            <div className="max-w-[1600px] mx-auto relative">
                {(tutorStore.state.loading || staffStore.state.loading || studentStore.state.loading) && (
                    <LoaderIcon />
                )}

                <div className="grid grid-cols-12 gap-8">
                    {/* --- COLUMN 1: STUDENT SELECTION --- */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col h-[750px]">
                        <div className="flex flex-col gap-4 mb-4 px-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">
                                        01
                                    </div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                                        Unassigned Students
                                    </h2>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                    Total: {studentStore.state.students.length}
                                </span>
                            </div>

                            <div className="relative group">
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search student name..."
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
                                    onChange={(e) => handleOnChagne(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {paginatedStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        onClick={() => toggleStudent(student.id)}
                                        className={`group p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${studentStore.state.selectedStudent?.includes(student.id)
                                            ? "border-orange-500 bg-white shadow-md"
                                            : "border-transparent bg-white hover:border-slate-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${studentStore.state.selectedStudent?.includes(
                                                    student.id,
                                                )
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-slate-100 text-slate-400"
                                                    }`}
                                            >
                                                {student.fullName.charAt(0)}
                                            </div>
                                            <div className="flex-1 truncate">
                                                <h4 className="font-bold text-slate-800 text-sm truncate">
                                                    {student.fullName}
                                                </h4>
                                            </div>
                                            {studentStore.state.selectedStudent?.includes(
                                                student.id,
                                            ) && (
                                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl text-rose-400 transition-colors">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`cursor-pointer w-8 h-8 text-[10px] font-black rounded-lg transition-all ${page === currentPage
                                                ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-rose-200"
                                                : "text-slate-400 hover:bg-slate-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- COLUMN 2: TUTOR SELECTION --- */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col h-[750px]">
                        <div className="flex flex-col gap-4 mb-4 px-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">
                                        02
                                    </div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                                        Expert Tutors
                                    </h2>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                    Total: {filteredTutors.length}
                                </span>
                            </div>

                            <div className="relative group">
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search tutor name or expertise..."
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
                                    onChange={(e) => setTutorSearchText(e.target.value)}
                                    value={tutorSearchText}
                                />
                            </div>
                        </div>

                        <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                {paginatedTutors.map((tutor) => (
                                    <div
                                        key={tutor.id}
                                        onClick={() => tutorStore.state.selectTutor(tutor)}
                                        className={`group p-6 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden relative ${tutorStore.state.selectedTutor?.id === tutor.id
                                            ? "border-orange-500 bg-white shadow-2xl -translate-y-1"
                                            : "border-white bg-white/40 hover:bg-white hover:border-orange-500"
                                            }`}
                                    >
                                        {tutorStore.state.selectedTutor?.id === tutor.id && (
                                            <div className="absolute top-0 right-0 h-full w-2 bg-orange-500" />
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-orange-500 transition-colors">
                                                    {tutor.fullName}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                    {tutor.expertise}
                                                </p>
                                                <p className="text-xs text-orange-400 mt-1 tracking-widest">
                                                    {tutor.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    onClick={() => setTutorCurrentPage((p) => Math.max(1, p - 1))}
                                    className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl text-rose-400 transition-colors">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: tutorTotalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setTutorCurrentPage(page)}
                                            className={`cursor-pointer w-8 h-8 text-[10px] font-black rounded-lg transition-all ${page === tutorCurrentPage
                                                ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-rose-200"
                                                : "text-slate-400 hover:bg-slate-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setTutorCurrentPage((p) => Math.min(tutorTotalPages, p + 1))}
                                    disabled={tutorCurrentPage === tutorTotalPages || tutorTotalPages === 0}
                                    className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- COLUMN 3: SUMMARY --- */}
                    <div className="col-span-12 lg:col-span-4 h-full">
                        <div className="sticky top-8 flex flex-col h-[750px]">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">
                                    03
                                </div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                                    Allocation Summary
                                </h2>
                            </div>

                            <div className="flex-1 bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 flex flex-col relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60" />
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-8">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
                                            Assigned Professional
                                        </p>
                                        {tutorStore.state.selectedTutor ? (
                                            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-[2rem] transition-all">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
                                                    {tutorStore.state.selectedTutor.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-800">
                                                        {tutorStore.state.selectedTutor.fullName}
                                                    </h4>
                                                    <span className="italic text-[10px] text-slate-800 uppercase tracking-tight">
                                                        {tutorStore.state.selectedTutor.expertise}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                    No Tutor Selected
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col min-h-0 mb-8">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
                                            Allocation List (
                                            {studentStore.state.selectedStudent?.length})
                                        </p>
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                            {studentStore.state.selectedStudent?.length > 0 ? (
                                                studentStore.state.selectedStudent?.map((id) => {
                                                    const s = studentStore.state.students.find(
                                                        (st) => st.id === id,
                                                    );
                                                    return (
                                                        <div
                                                            key={id}
                                                            className="bg-white border border-slate-50 px-4 py-3 rounded-2xl shadow-sm text-[12px] font-bold text-slate-700 flex items-center justify-between group hover:border-orange-100 transition-all"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                                                {s?.fullName}
                                                            </div>
                                                            <button
                                                                onClick={() => toggleStudent(id)}
                                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2.5"
                                                                        d="M6 18L18 6M6 6l12 12"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                                                    <svg
                                                        className="w-12 h-12 mb-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1"
                                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                        />
                                                    </svg>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                        Select Students
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleBulkAllocate()}
                                        disabled={
                                            staffStore.state.loading ||
                                            !tutorStore.state.selectedTutor ||
                                            studentStore.state.selectedStudent.length === 0
                                        }
                                        className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 shadow-xl ${tutorStore.state.selectedTutor &&
                                            studentStore.state.selectedStudent.length > 0
                                            ? "cursor-pointer bg-gradient-to-br from-orange-500 to-rose-500 text-white hover:-translate-y-1 active:scale-95"
                                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                            }`}
                                    >
                                        Confirm Allocation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Added overflow-x-auto to the wrapper for horizontal scrolling on mobile */}
            <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                Student Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                Student Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                Tutor Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                Tutor Email
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                Relocate
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                        {staffStore.state.allocatedList.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-sm italic text-gray-400">
                                    No allocations found at this time.
                                </td>
                            </tr>
                        ) : (
                            staffStore.state.allocatedList.map((allocate) => (
                                <tr
                                    key={allocate.studentId}
                                    className="transition-colors duration-200 hover:bg-blue-50/30"
                                >
                                    {/* Student */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {allocate.studentName}
                                            </span>
                                            <span className="text-xs text-orange-600 font-mono">
                                                ID: {allocate.studentId}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Student Email */}
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {allocate.studentEmail}
                                    </td>

                                    {/* Tutor */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {allocate.tutorName}
                                            </span>
                                            <span className="text-xs text-orange-600 font-mono">
                                                ID: {allocate.tutorId}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Tutor Email */}
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {allocate.tutorEmail}
                                    </td>

                                    {/* Relocate Button */}
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button
                                            onClick={() => openRelocateDrawer(allocate)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                                text-amber-700 bg-amber-50 border border-amber-200
                                hover:bg-amber-100 hover:text-amber-800 hover:shadow-sm
                                transition-all duration-200 active:scale-95"
                                        >
                                            Relocate
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {isDrawerOpen && selectedAllocation && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Animated Backdrop with Blur */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={closeRelocateDrawer}
                    />

                    <div className="relative w-full max-w-md bg-white h-full shadow-[-20px_0_50px_-15px_rgba(0,0,0,0.1)] flex flex-col animate-slide-in-right">

                        {/* Header: Clean & Sophisticated */}
                        <div className="px-8 pt-8 pb-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Reallocate Student
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Assign a new mentor to this profile</p>
                            </div>

                            <button
                                onClick={closeRelocateDrawer}
                                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-2 space-y-8">

                            {/* Visual Flow: From Student -> To Tutor */}
                            <div className="relative space-y-4">
                                {/* Student Card */}
                                <div className="group relative rounded-2xl bg-slate-50 p-5 border border-slate-100">
                                    <span className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-bold uppercase tracking-wider text-amber-600 border border-blue-100 rounded">
                                        Student Details
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                                            {selectedAllocation.studentName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 leading-none">
                                                {selectedAllocation.studentName}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {selectedAllocation.studentEmail}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Connector Line */}
                                <div className="absolute left-10 top-1/2 h-full w-0.5 bg-dashed bg-slate-200 -z-10" />

                                {/* Current Tutor Card */}
                                <div className="rounded-2xl bg-amber-50/50 p-5 border border-amber-100">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-orange-600/70 tracking-widest">Current Tutor</p>
                                            <p className="font-semibold text-slate-800">
                                                {selectedAllocation.tutorName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Input Section */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                                        New Assignment
                                    </label>
                                    <div className="relative">
                                        <select
                                            onChange={(e) =>
                                                setSelectedTutorId(Number(e.target.value))
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                        >
                                            <option>Select a new tutor...</option>
                                            {filteredTutors.map((tutor) => (
                                                <option key={tutor.id} value={tutor.id}>
                                                    {tutor.fullName}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer with Glass Effect */}
                        <div className="p-8 border-t border-slate-100 bg-white/80 backdrop-blur-md flex gap-4">
                            <button
                                onClick={closeRelocateDrawer}
                                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleReallocate}
                                disabled={!selectedTutorId}
                                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r from-orange-500 to-rose-500
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:shadow-lg transition-all"
                            >
                                Confirm Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default AllocationScreen;