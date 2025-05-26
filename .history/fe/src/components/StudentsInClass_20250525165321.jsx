import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStudentsByClass,
  createStudent,
  getClassById,
  getAttendanceSummaryByClass,
} from "../services/studentAPI";
import {
  getAttendanceDatesByClass,
  getAttendanceByClass,
} from "../services/attendanceAPI";
import { ArrowLeft, Plus } from "lucide-react";

export default function StudentsInClass() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    birth_date: "",
    class_id: id,
  });

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(new Map());

  const fetchInitialData = async () => {
    try {
      const [studentRes, classData, summaryRes, dateRes] = await Promise.all([
        getStudentsByClass(id),
        getClassById(id),
        getAttendanceSummaryByClass(id),
        getAttendanceDatesByClass(id),
      ]);

      const summaryMap = new Map(
        summaryRes.map((item) => [
          item.student_id,
          {
            appearance: item.appearance,
            total_sessions: item.total_sessions,
          },
        ])
      );

      const merged = studentRes.map((s) => {
        const summary = summaryMap.get(s.student_id) || {
          appearance: 0,
          total_sessions: 0,
        };
        return {
          ...s,
          appearance: summary.appearance,
          total_sessions: summary.total_sessions,
        };
      });

      setStudents(merged);
      setClassName(classData.class_name);
      setClassCode(classData.class_code);
      setDates(dateRes);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await createStudent({ ...formData, class_id: id });
      setShowModal(false);
      setFormData({ name: "", student_id: "", birth_date: "", class_id: id });
      setCurrentPage(1);
      await fetchInitialData();
    } catch (err) {
      alert("Lỗi khi thêm sinh viên");
      console.error(err);
    }
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const data = await getAttendanceByClass(id, formattedDate);
      console.log("📦 Dữ liệu trả về từ API:", data);

      const statusMap = new Map(
        data.map((item) => [
          String(item.student_id).trim(),
          item.status === true || item.status === 'true' || item.status === 1,
        ])
      );

      console.log("✅ Map sau khi xử lý:", statusMap);
      setAttendanceStatus(statusMap);
    } catch (err) {
      console.error("Lỗi khi lấy điểm danh:", err);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = students.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const handlePrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

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

      {/* Chọn ngày điểm danh */}
      {dates.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => handleDateSelect(date)}
              className={`px-3 py-1 rounded border text-sm ${
                selectedDate === date
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      )}

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
                <th className="px-4 py-2 border-b text-center">
                  {selectedDate ? "Có mặt" : "Số buổi có mặt"}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((sv, index) => (
                <tr key={sv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{startIndex + index + 1}</td>
                  <td className="px-4 py-2 border-b">{sv.name}</td>
                  <td className="px-4 py-2 border-b">{sv.student_id}</td>
                  <td className="px-4 py-2 border-b">{formatDate(sv.birth_date)}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {selectedDate ? (
                      (() => {
                        const key = String(sv.student_id).trim();
                        const status = attendanceStatus.get(key);
                        console.log(`🧪 Kiểm tra: ${key} → ${status}`);
                        return status ? (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        ) : (
                          <span className="text-red-500 font-bold text-xl">✗</span>
                        );
                      })()
                    ) : (
                      <>
                        {sv.appearance} / {sv.total_sessions} (
                        {sv.total_sessions > 0
                          ? Math.round((sv.appearance / sv.total_sessions) * 100)
                          : 0}
                        %)
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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

      {/* Modal thêm sinh viên */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Thêm sinh viên mới</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Họ tên"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
                placeholder="Mã sinh viên"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={(e) =>
                  setFormData({ ...formData, birth_date: e.target.value })
                }
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
