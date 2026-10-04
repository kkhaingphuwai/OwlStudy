import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { assignmentStroe } from "../store/assignmnet";
import { observer } from "mobx-react-lite";
import LoaderIcon from "../common/LoaderIcon";

const UploadAssignment = observer(() => {

    const { assignmentStore } = useStore();

    useEffect(() => {
        assignmentStore.getAllAssignment();
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!assignmentStore.state.file) {
            alert("Please upload a file");
            return;
        }
        await assignmentStore.uploadAssignment({
            assignment: assignmentStore.state.file,
            title: assignmentStore.state.title,
            description: assignmentStore.state.description,
            dueDate: assignmentStore.state.dueDate,
            subject: assignmentStore.state.subject
        });
        alert("Assignment created");
        assignmentStore.state.reset();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

            <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm p-8 space-y-6">
                {assignmentStroe.state.loading && <LoaderIcon />}
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Create Assignment
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Upload coursework and set a deadline for students
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Title */}
                    <div>
                        <label className="text-sm text-gray-600">Title</label>
                        <input
                            value={assignmentStore.state.title}
                            onChange={(e) => assignmentStore.state.setTitle(e.target.value)}
                            type="text"
                            placeholder="e.g. Java Homework 1"
                            className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/70"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-gray-600">Description</label>
                        <textarea
                            value={assignmentStore.state.description}
                            onChange={(e) => assignmentStore.state.setDescription(e.target.value)}
                            placeholder="Write instructions or notes..."
                            className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/70"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Subject</label>

                        <div className="mt-2 grid grid-cols-2 gap-2">

                            {["Java", "React", "Database", "AI", "Networking", "Security"].map(subject => (

                                <label
                                    key={subject}
                                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition
                    ${assignmentStore.state.subject === subject
                                            ? "bg-black text-white"
                                            : "hover:bg-gray-50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="subject"
                                        value={subject}
                                        checked={assignmentStore.state.subject === subject}
                                        onChange={() => assignmentStore.state.setSubject(subject)}
                                        className="accent-black"
                                    />

                                    <span className="text-sm">
                                        {subject}
                                    </span>
                                </label>

                            ))}

                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-sm text-gray-600">Due Date</label>
                        <input
                            type="date"
                            value={assignmentStore.state.dueDate}
                            onChange={(e) => assignmentStore.state.setDueDate(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/70"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="text-sm text-gray-600">Upload Assignment File</label>

                        <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="file"
                                className="hidden"
                                id="fileUpload"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    assignmentStroe.state.setFile(file);
                                }}
                            />

                            <label htmlFor="fileUpload" className="cursor-pointer">
                                <p className="text-gray-500">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PDF, DOCX, ZIP
                                </p>
                            </label>
                        </div>

                        {/* File Name Display */}
                        {assignmentStore.state.fileName && (
                            <p className="text-sm text-gray-600 mt-2">
                                Selected: {assignmentStore.state.fileName}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
                        >
                            Create Assignment
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
})

export default UploadAssignment;