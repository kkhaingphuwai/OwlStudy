import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import { DataTable } from "../dataTable/DataTable";
import { columns } from "../column/columns";
import { useEffect } from "react";
import PermissionGate from "../auth/PermissionGate";
import { Bar, Line } from "react-chartjs-2";
import LoaderIcon from "../common/LoaderIcon";

const ExceptionReport = observer(() => {

    const { reportStore } = useStore();

    const handleGenerate = async () => {

        reportStore.state.unAssignedStudent = [];
        reportStore.state.averageTutorMessage = [];
        reportStore.state.messageLastDays = [];

        const reportType = reportStore.state.reportType;

        if (reportType === "NON_ALLOCATED") {
            await reportStore.getUnassignedStudent();
            return;
        }

        if (reportType === "INACTIVE") {
            const range = reportStore.state.inactiveRange;
            let days = Number(range || 7);

            await reportStore.getInActiveReport(days);
            return;
        }

        if (reportType === "AVERAGE") {
            await reportStore.getAverageReport();
            return;
        }

        if (reportType === "MESSAGE") {
            await reportStore.getTotalMessageLast7Days();
            return;
        }
    };

    useEffect(() => {
        reportStore.state.unAssignedStudent = [];
        reportStore.state.averageTutorMessage = [];
        reportStore.state.messageLastDays = [];
        reportStore.state.reportType = '';
        reportStore.state.inactiveRange = '';
    }, [])

    const data = {
        labels: reportStore.state.averageTutorMessage.map(
            item => item.tutorName
        ),
        datasets: [
            {
                label: "Average Messages Per Contact",
                data: reportStore.state.averageTutorMessage.map(
                    item => item.averageMessagesPerContact
                ),
                borderWidth: 1,
                backgroundColor: 'rgba(139, 69, 19, 0.6)',
                borderColor: 'rgba(139, 69, 19, 1)',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const
            },
            title: {
                display: true,
                text: "Messages by Tutor"
            }
        }
    };

    const messageChartData = {
        labels: reportStore.state.messageLastDays.map(item => item.day),
        datasets: [
            {
                label: "Messages",
                data: reportStore.state.messageLastDays.map(item => item.count),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.15)",
                tension: 0.35,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };

    const messageChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        }
    };
    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-6">
            {/* Header Section: Improved spacing and typography */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-orange-500 rounded-full" />
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Exception Report
                        </h1>
                    </div>
                </div>
            </header>

            {/* Filter Bar: Enhanced Interaction */}
            <section className="bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl p-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Report Type Select */}
                    <div className="md:col-span-1 group">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-2">Report Category</label>
                        <select
                            value={reportStore.state.reportType}
                            onChange={(e) => {
                                reportStore.state.setReportType(e.target.value);
                                reportStore.state.setInActiveRange("");
                            }}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-all cursor-pointer outline-none"
                        >
                            <option value="">--- Select Type ---</option>
                            <option value="NON_ALLOCATED">Non-Allocated Students</option>
                            <option value="INACTIVE">Inactive Students</option>
                            <PermissionGate permissions={["VIEW_STATISTICS_REPORT"]}>
                                <option value="AVERAGE">Average Message By Tutor</option>
                                <option value="MESSAGE">Total Message (7 Days)</option>
                            </PermissionGate>
                        </select>
                    </div>

                    {/* Date Range Select (Conditional) */}
                    <div className={`md:col-span-1 transition-all duration-500 ${reportStore.state.reportType === "INACTIVE" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-2">Timeframe</label>
                        <select
                            value={reportStore.state.inactiveRange}
                            onChange={(e) => reportStore.state.setInActiveRange(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-all cursor-pointer outline-none"
                        >
                            <option value="">--- Select Period ---</option>
                            <option value="7">Last 7 Days</option>
                            <option value="28">Last 28 Days</option>
                        </select>
                    </div>

                    {/* Spacer for alignment */}
                    <div className="hidden md:block md:col-span-1" />

                    {/* Action Button */}
                    <div className="flex items-end p-1">
                        <button
                            onClick={handleGenerate}
                            disabled={!reportStore.state.reportType || (reportStore.state.reportType === "INACTIVE" && !reportStore.state.inactiveRange)}
                            className="w-full h-[52px] rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 
                            enabled:bg-gradient-to-br from-orange-500 to-rose-500 enabled:text-white enabled:cursor-pointer
                            disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Generate Analytics
                                <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${!reportStore.state.reportType && 'opacity-30'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Data Display Area */}
            <main className="min-h-[400px]">
                {reportStore.state.loading ? (
                    <LoaderIcon />
                ) : reportStore.state.reportType === "AVERAGE" ? (

                    /* 2. Average Chart */
                    reportStore.state.averageTutorMessage.length > 0 ? (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2.5"
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-800">
                                        Tutor Engagement Analytics
                                    </h3>
                                </div>

                                <div className="h-[450px]">
                                    <Bar data={data} options={options} />
                                </div>
                            </div>
                        </section>
                    ) : (
                        <div />
                    )

                ) : reportStore.state.reportType === "MESSAGE" ? (

                    /* 3. Message Line Chart */
                    reportStore.state.messageLastDays.length > 0 ? (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2.5"
                                                d="M3 17l6-6 4 4 8-8"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">
                                            Message Activity Trend
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Last 7 days communication volume
                                        </p>
                                    </div>
                                </div>

                                <div className="h-[420px]">
                                    <Line
                                        data={messageChartData}
                                        options={messageChartOptions}
                                    />
                                </div>
                            </div>
                        </section>
                    ) : (
                        <div />
                    )

                ) : reportStore.state.unAssignedStudent.length > 0 ? (

                    /* 4. Table Report */
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden transition-all">
                        <div className="bg-slate-900 px-8 py-7 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2.5"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>

                                <h4 className="text-white font-bold text-lg">
                                    Student Status Report
                                </h4>
                            </div>
                        </div>

                        <div className="p-2">
                            <DataTable
                                data={reportStore.state.unAssignedStudent}
                                columns={columns}
                            />
                        </div>
                    </div>

                ) : (

                    /* 5. Empty State */
                    <div />

                )}
            </main>
        </div>
    );
});

export default ExceptionReport;