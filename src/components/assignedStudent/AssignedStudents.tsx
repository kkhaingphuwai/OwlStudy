import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

const AssignedStudents = observer(() => {

  const { tutorStore } = useStore();

  const [filterValue, setFilterValue] = useState("all");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    tutorStore.getAssignedStudentsById();
  }, []);

  const students = tutorStore.state.assignedStudents || [];

  const filteredStudents = useMemo(() => {
    switch (filterValue) {
      case "hasPhone":
        return students.filter((s: any) => s.phone)
      case "age18plus":
        return students.filter((s: any) => s.age >= 20);
      default:
        return students;
    }
  }, [students, filterValue])

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleContactClick = (student: any) => {
    navigate(`/message/${student.id}`, {
      state: {
        partnerId: student.id,
        partnerEmail: student.email,
        partnerName: student.fullName
      }
    });
  };

  const handleAssignmentDetails = (studentId: number | undefined) => {
    navigate(`/assignments/${studentId}`);
  };

  return (
    <div className="p-5">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Assigned Students</h2>

        {/* Filter Right Side */}
        <div className="flex items-center gap-2">
          {/* Funnel Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4h18l-7 8v6l-4 2v-8L3 4z"
            />
          </svg>

          <select
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Students</option>
            <option value="hasPhone">Has Phone</option>
            <option value="age18plus">Age 20+</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Full Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Age</th>
            <th className="border px-3 py-2">Phone</th>
            <th className="border px-3 py-2">Session</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedStudents.map((student: any) => (
            <tr key={student.id} className="text-center hover:bg-gray-50">
              <td className="border px-3 py-2">{student.id}</td>
              <td className="border px-3 py-2">{student.fullName}</td>
              <td className="border px-3 py-2">{student.email}</td>
              <td className="border px-3 py-2">{student.age ?? "-"}</td>
              <td className="border px-3 py-2">{student.phone ?? "-"}</td>
              <td className="border px-3 py-2">{student.session}</td>

              <td className="border px-3 py-2">
                <div className="flex justify-center gap-2">
                  {/* Message */}
                  <button
                    onClick={() => handleContactClick(student)}
                    className="cursor-pointer p-2 bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded hover:bg-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                  </button>

                  {/* Document */}
                  <button 
                    onClick={() => handleAssignmentDetails(student.id)}
                    className="cursor-pointer p-2 bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded hover:bg-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>

                  </button>
                </div>
              </td>
            </tr>
          ))}

          {paginatedStudents.length === 0 && (
            <tr>
              <td colSpan={8} className="py-4 text-center">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
});

export default AssignedStudents;