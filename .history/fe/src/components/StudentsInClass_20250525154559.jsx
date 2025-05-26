import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStudentsByClass,
  createStudent,
  getClassById,
  getAttendanceSummaryByClass
} from "../services/studentAPI";
import { ArrowLeft, Plus } from "lucide-react";

export default function StudentsInClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    birth_date: "",
    class_id: id,
  });

  const fetchData = async () => {
    try {
      const [studentRes, classData, summaryRes] = await Promise.all([
        getStudentsByClass(id),
        getClassById(id),
        getAttendanceSummaryByClass(id)
      ]);

      const summaryMap = new Map(
        summaryRes.map(item => [
          item.student_id,
          {
            appearance: item.appearance,
            total_sessions: item.total_sessions,
          }
        ])
      );

      const mergedStudents = studentRes.map(s => {
        const summary = summaryMap.get(s.student_id) || {
          appearance: 0,
          total_sessions: 0
        };
        return {
          ...s,
          appearance: summary.appearance,
          total_sessions: summary.total_sessions,
        };
      });

      setStudents(mergedStudents);
      setClassName(classData.class_name);
      setClassCode(classData.class_code);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await createStudent({ ...formData, class_id: id });
      setShowModal(false);
      setFormData({ name: "", student_id: "", birth_date: "", class_id: id });
      setCurrentPage(1); // reset về trang đầu
      fetchData();
    } catch (err) {
      alert("Lỗi khi thêm sinh viên");
      console.error(err);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // PHÂN TRANG
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + studentsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="pt-20 p-6 ml-64">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Quay lại"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">
            {className} ({classCode})
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm sinh viên
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table className="w-full bg-white border border-gray-200 rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">STT</th>
                <th className="px-4 py-2 border-b text-left">Họ tên</th>
                <th className="px-4 py-2 border-b text-left">Mã sinh viên</th>
                <th className="px-4 py-2 border-b text-left">Ngày sinh</th>
                <th className="px-4 py-2 border-b text-left">Số buổi có mặt</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((sv, index) => (
                <tr key={sv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{startIndex + index + 1}</td>
                  <td className="px-4 py-2 border-b">{sv.name}</td>
                  <td className="px-4 py-2 border-b">{sv.student_id}</td>
                  <td className="px-4 py-2 border-b">{formatDate(sv.birth_date)}</td>
                  <td className="px-4 py-2 border-b">
                    {sv.appearance} / {sv.total_sessions} (
                    {sv.total_sessions > 0
                      ? Math.round((sv.appearance / sv.total_sessions) * 100)
                      : 0}
                    %)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PHÂN TRANG */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-[#676f86] rounded font-bold text-sm text-[#676f86] hover:bg-[#f0f0f0] disabled:bg-transparent disabled:text-[#e0e0e0] disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <span
                  key={index + 1}
                  className={`px-4 py-2 rounded font-bold text-sm text-center cursor-pointer ${
                    currentPage === index + 1
                      ? "bg-[#f8f9fd] text-[#2470de]"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-[#676f86] rounded font-bold text-sm text-[#676f86] hover:bg-[#f0f0f0] disabled:bg-transparent disabled:text-[#e0e0e0] disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Thêm sinh viên mới</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Họ tên"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                placeholder="Mã sinh viên"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                required
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
