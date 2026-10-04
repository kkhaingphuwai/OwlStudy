import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import { formatDate } from "../store/comment/function";
import { toast } from "react-toastify";

const DocumentUpload = observer(() => {

  const { assignmentStore, documentStore, commentStore } = useStore();

  useEffect(() => {
    const init = async () => {
      await assignmentStore.getAllAssignment();

      const first = assignmentStore.state.assignments[0];
      if (first) {
        assignmentStore.state.setSelectedAssignment(first);

        const userInfo = sessionStorage.getItem("user");
        if (!userInfo) return;
        const user = JSON.parse(userInfo);

        await documentStore.getDocumentsByStudentId(user.id, first.id);
      }
    };
    init();
  }, []);

  const handleGetAllReviews = (submissionId: number) => {
    commentStore.getAllFeedBacks(submissionId);
  }

  const handlePostComments = async () => {
    const userInfo = sessionStorage.getItem("user");
    if (!userInfo) return;
    const user = JSON.parse(userInfo);
    const payload = {
      description: commentStore.state.description,
      authorId: user.id,
      blogId: null,
      submissionId: documentStore.state.selectedDoc?.id
    };
    await commentStore.postComments(payload);

    await commentStore.getAllFeedBacks(documentStore.state.selectedDoc!.id);

  }

  if (assignmentStore.state.assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 m-4">
        <p className="text-slate-500 font-medium">No assignments found</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Main Content Area - Changed to flex-col for vertical stacking */}
      <div className="flex-1 flex flex-col gap-6 p-6 min-w-0">

        {/* TOP: Subject Tabs - Moved to the very top for better UX */}
        <nav className="flex flex-wrap gap-2 justify-center border-b border-slate-200 pb-6">
          {assignmentStore.state.assignments.map((assignment) => {
            const isActive =
              assignmentStore.state.selectedAssignment?.id === assignment.id;
            return (
              <button
                key={assignment.id}
                onClick={async () => {
                  assignmentStore.state.setSelectedAssignment(assignment);
                  const userInfo = sessionStorage.getItem("user");
                  if (!userInfo) return;
                  const user = JSON.parse(userInfo);
                  await documentStore.getDocumentsByStudentId(
                    user.id,
                    assignment.id,
                  );
                }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                  ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-blue-200 scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
              >
                {assignment.subject}
              </button>
            );
          })}
        </nav>

        {/* SECTION 1: Table (Now on Top) */}
        <div className="w-full">
          {assignmentStore.state.selectedAssignment ? (
            <div className="shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <tbody>
                    <tr className="border px-3 py-2">
                      <th className="border px-3 py-2">
                        ID
                      </th>
                      <td className="px-4 md:px-6 py-4 text-slate-800">
                        {assignmentStore.state.selectedAssignment.id}
                      </td>
                    </tr>
                    <tr className="border px-3 py-2">
                      <th className="border px-3 py-2">
                        Title
                      </th>
                      <td className="px-4 md:px-6 py-4 text-slate-800">
                        {assignmentStore.state.selectedAssignment.title}
                      </td>
                    </tr>
                    <tr className="border px-3 py-2">
                      <th className="border px-3 py-2">
                        Description
                      </th>
                      <td className="px-4 md:px-6 py-4 text-slate-700 leading-relaxed break-words">
                        {assignmentStore.state.selectedAssignment.description}
                      </td>
                    </tr>
                    <tr className="border px-3 py-2">
                      <th className="border px-3 py-2">
                        Due Date
                      </th>
                      <td className="px-4 md:px-6 py-4 text-red-500 font-semibold">
                        {assignmentStore.state.selectedAssignment.dueDate}
                      </td>
                    </tr>
                    <tr className="border px-3 py-2">
                      <th className="border px-3 py-2">
                        Subject
                      </th>
                      <td className="px-4 md:px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-orange-700 text-xs md:text-sm font-medium">
                          {assignmentStore.state.selectedAssignment.subject}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center p-10 md:p-14 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-slate-500 italic text-base md:text-lg">
                Please select a subject above to begin.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: Upload Area (Now Under Table) */}
        <main className="w-full transition-all duration-500 ease-in-out">
          {assignmentStore.state.selectedAssignment ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-3 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-orange-600">
                        Upload PDF
                      </span>
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const isPdf =
                        file.type === "application/pdf" ||
                        file.name.toLowerCase().endsWith(".pdf");
                      if (!isPdf) {
                        toast.error("Only PDF files allowed", {
                          style: {
                            borderRadius: "12px",
                            background: "#ef4444",
                            color: "#fff",
                            fontWeight: "600",
                          },
                        });
                        e.target.value = "";
                        return;
                      }
                      assignmentStore.state.setFile(file);
                      documentStore.state.uploadingFile = {
                        name: file.name,
                        progress: 0,
                        status: "idle",
                      };
                    }}
                  />
                </label>
              </div>

              {/* Progress Section */}
              {documentStore.state.uploadingFile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg animate-pulse">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-blue-700 truncate w-2/3">
                      {documentStore.state.uploadingFile.name}
                    </span>
                    <span className="text-xs font-black text-blue-700">
                      {documentStore.state.uploadingFile.progress}%
                    </span>
                  </div>
                  {documentStore.state.uploadingFile.status === "uploading" && (
                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${documentStore.state.uploadingFile.progress}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                disabled={
                  documentStore.state.loading || !assignmentStore.state.file
                }
                onClick={() =>
                  documentStore.uploadDocument({
                    file: assignmentStore.state.file!,
                    assignmentId: assignmentStore.state.selectedAssignment!.id,
                  })
                }
                className="w-full mt-6 bg-gradient-to-br from-orange-500 to-rose-500 text-white py-3 rounded-xl font-bold transition-all disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {documentStore.state.loading ? "Processing..." : "Submit"}
              </button>
            </div>
          ) : null}
        </main>

        {/* SECTION 3: List of Uploaded Documents */}
        <footer className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">
              Uploaded Documents
            </h4>
            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold">
              {documentStore.state.submissions.length}
            </span>
          </div>

          <div className="space-y-2">
            {documentStore.state.submissions.map((submission, idx) => (
              <div
                onClick={() => {
                  documentStore.state.setSelectedDoc(submission);
                  handleGetAllReviews(submission.id);
                }}
                key={idx}
                className="cursor-pointer flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:text-orange-500">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-700">
                      {submission.fileName}
                    </h3>
                    <span className="text-xs italic text-slate-500">
                      {submission.uploadTimestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {documentStore.state.submissions.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-4">
                No submissions yet for this subject.
              </p>
            )}
          </div>
        </footer>
      </div>

      {/* RIGHT SIDE PANEL: Comments (Shown when a document is clicked) */}
      <aside
        className={`bg-white border-l border-slate-200 transition-all duration-300 ease-in-out flex flex-col shadow-2xl h-screen sticky top-0
${documentStore.state.selectedDoc
            ? "w-full md:w-[400px]"
            : "w-0 overflow-hidden opacity-0"
          }`}
      >
        {documentStore.state.selectedDoc && (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <p className="text-[13px] text-orange-600 font-bold uppercase truncate">
                  {documentStore.state.selectedDoc.fileName}
                </p>
              </div>
              <button
                onClick={() => documentStore.state.setSelectedDoc(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex flex-col">
                {commentStore.state.feedbacks.slice().reverse().map((feedback, index) => (
                  <div
                    key={index}
                    className="py-4 border-b border-slate-100 last:border-0 flex flex-col space-y-1"
                  >
                    {/* Header Row: Metadata */}
                    <div className="flex items-center space-x-2">
                      {/* Optional: Add a small user icon or name here if available */}
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {formatDate(feedback.timeStamp)}
                      </span>
                    </div>

                    {/* Comment Content: Simple and clean text */}
                    <div className="max-w-full">
                      <p className="text-sm text-slate-700 leading-relaxed break-words">
                        {feedback.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="relative flex items-end gap-2 bg-slate-100 rounded-2xl p-2 transition-focus-within focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100">
                <textarea
                  value={commentStore.state.description}
                  onChange={(e) => {
                    commentStore.state.setField("description", e.target.value);
                  }}
                  placeholder="Write a comment..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 resize-none max-h-32 min-h-[44px]"
                />
                <button
                  onClick={() => handlePostComments()}
                  className="bg-gradient-to-br from-orange-500 to-rose-500 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-90 flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
});

export default DocumentUpload;
