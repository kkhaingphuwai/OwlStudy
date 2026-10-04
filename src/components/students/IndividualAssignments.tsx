import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import { useEffect, useState } from "react";
import {
    FileText,
    CheckCircle2,
    Clock,
    MessageSquare,
    ChevronRight,
    SendHorizonal,
    CircleDot
} from "lucide-react";
import { useParams } from "react-router-dom";
import { formatDate } from "../store/comment/function";

const IndividualAssignments = observer(() => {

    const { documentStore, commentStore } = useStore();
    const [activeId, setActiveId] = useState<number | null>(null);
    const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
    const { studentId } = useParams();

    useEffect(() => {
        commentStore.state.description = ""
        documentStore.getDocumentsById(Number(studentId));
    }, [documentStore]);

    const activeFile = documentStore.state.individualSubmissions.find((f) => f.id === activeId);
    const isAccepted = activeId !== null && acceptedIds.includes(activeId);

    const handleAccept = (id: number) => {
        setAcceptedIds((prev) => [...prev, id]);
    };

    const handlePostComments = () => {
        const userInfo = sessionStorage.getItem("user");
        if (!userInfo) return;
        const user = JSON.parse(userInfo);
        const payload = {
            description: commentStore.state.description,
            authorId: user.id,
            blogId: null,
            submissionId: activeId
        };
        commentStore.postComments(payload);
    }

    const handleGetAllReviews = (submissionId: number) => {
        commentStore.getAllFeedBacks(submissionId);
    }

    return (
        <div className="h-screen flex bg-[#FBFBFE] text-slate-900 antialiased font-sans">

            {/* --- SIDEBAR LIST --- */}
            <aside className="w-80 border-r border-slate-200 bg-white flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-6 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full" />
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">
                            Review Queue
                        </h1>
                    </div>

                    <p className="text-xs text-slate-400 font-medium px-1">
                        {documentStore.state.individualSubmissions.length} Pending Submissions
                    </p>
                </div>

                {/* Submission List */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                    {documentStore.state.individualSubmissions.map((file) => {
                        const isSelected = activeId === file.id;
                        const isDone = acceptedIds.includes(file.id);

                        return (
                            <button
                                key={file.id}
                                onClick={() => {
                                    handleGetAllReviews(file.id);
                                    setActiveId(file.id);
                                    commentStore.state.description = "";
                                }}
                                className={`w-full group flex flex-col gap-1 p-3 rounded-2xl transition-all duration-200 text-left
          ${isSelected
                                        ? "bg-rose-50 ring-1 ring-orange-200 shadow-sm"
                                        : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText
                                            className={`w-4 h-4 shrink-0 ${isSelected ? "text-orange-600" : "text-slate-400"
                                                }`}
                                        />
                                        <p
                                            className={`text-sm font-semibold truncate ${isSelected ? "text-orange-500" : "text-slate-700"
                                                }`}
                                        >
                                            {file.fileName}
                                        </p>
                                    </div>

                                    {isDone && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                                        <Clock className="w-3 h-3" />
                                        {new Date(
                                            file.uploadTimestamp || Date.now()
                                        ).toLocaleDateString()}
                                    </span>

                                    {!isDone && !isSelected && (
                                        <ChevronRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Discussion Section */}
                <div className="border-t border-slate-200 bg-slate-50 flex flex-col">

                    {/* Title */}
                    <div className="bg-rose-50 ring-1 ring-orange-200 shadow-sm px-4 py-3 border-b border-slate-200">
                        <h2 className="text-sm font-bold text-orange-600">
                            Feedbacks
                        </h2>
                    </div>

                    {/* Feed back */}
                    <div className="max-h-80 overflow-y-auto px-3 py-3 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                        {commentStore.state.feedbacks
                            .slice()
                            .reverse()
                            .map((feedback, index) => {
                                return (
                                    <div key={index} className="flex">
                                        <div className="px-4 py-2 rounded-2xl shadow-sm bg-white border border-slate-200 w-100">
                                            <p className="text-sm leading-relaxed break-words text-slate-700">
                                                {feedback.description}
                                            </p>

                                            <div className="text-[10px] mt-1 text-slate-400">
                                                {formatDate(feedback.timeStamp)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        {commentStore.state.feedbacks.length === 0 && (
                            <div className="text-center text-sm text-slate-400 py-8 italic">
                                No discussion yet.
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* --- MAIN WORKSPACE --- */}
            <main className="flex-1 flex flex-col relative bg-slate-50/50">
                {activeFile && (
                    <>
                        {/* HEADER */}
                        <header className="h-16 px-8 bg-white border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h2 className="text-sm font-bold text-slate-800">
                                    {activeFile.fileName}
                                </h2>
                                <div className="h-4 w-px bg-slate-200" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Document Viewer
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                {!isAccepted ? (
                                    <button
                                        onClick={() => handleAccept(activeFile.id)}
                                        className="cursor-pointer flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Accept for Review
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                        <CircleDot className="w-3 h-3 animate-pulse" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Active Review</span>
                                    </div>
                                )}
                            </div>
                        </header>

                        {/* DOCUMENT CONTENT AREA */}
                        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                            {/* PREVIEW CONTAINER */}
                            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full">
                                {/* Header / Toolbar */}
                                <div className="h-12 border-b border-slate-100 bg-slate-50 flex items-center justify-between px-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm font-semibold text-slate-700">
                                            {activeFile?.fileName || "Document Preview"}
                                        </span>
                                    </div>
                                    <div className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">
                                        PDF / DOC
                                    </div>
                                </div>

                                {/* Preview Area */}
                                <div className="flex-1 bg-slate-100 relative">
                                    {activeFile ? (
                                        <iframe
                                            src={`http://localhost:8080/docs/${activeFile.fileName}`}
                                            className="w-full h-full border-none"
                                            title="Document Preview"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                            <FileText className="w-12 h-12 mb-2 opacity-20" />
                                            <p className="text-sm font-medium">Select a file to preview</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COMMENT DRAWER */}
                            <div className={`transition-all duration-500 transform ${isAccepted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'}`}>
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-rose-500" />
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Reviewer Feedback</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white">
                                        <textarea
                                            value={commentStore.state.description}
                                            onChange={(e) => {
                                                commentStore.state.setField("description", e.target.value);
                                            }}
                                            disabled={!isAccepted}
                                            placeholder={isAccepted ? "Start typing your feedback..." : "Accept the document above to begin the review process."}
                                            className="w-full h-20 resize-none outline-none text-sm text-slate-600 placeholder-slate-300 leading-relaxed"
                                        />
                                    </div>

                                    <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                                        <button
                                            onClick={() => handlePostComments()}
                                            disabled={!isAccepted || !commentStore.state.description}
                                            className="cursor-pointer group flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold rounded-xl disabled:bg-slate-200 disabled:text-white-400 transition-all hover:bg-indigo-600"
                                        >
                                            Submit Review
                                            <SendHorizonal className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
});

export default IndividualAssignments;