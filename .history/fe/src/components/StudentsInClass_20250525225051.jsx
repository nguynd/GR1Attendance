import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {
  getStudentsByClass,
  createStudent,
  getClassById,
  getAttendanceSummaryByClass,
} from "../services/studentAPI";
import {
  getAttendanceDatesByClass,
  getAttendanceByClass,
  initAttendanceByClass,
  markAttendance,
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
      Swal.fire("Lỗi", "Không thể thêm sinh viên", "error");
      console.error(err);
    }
  };
  const handleAddStudentOptions = async () => {
    const result = await Swal.fire({
      title: "Bạn muốn thêm sinh viên bằng cách nào?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "➕ Nhập thủ công",
      denyButtonText: "📥 Nhập từ file Excel",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      setShowModal(true); // hiển thị form thêm 1 sinh viên
    } else if (result.isDenied) {
      document.getElementById("excel-upload").click(); // click ngầm vào input file
    }
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const data = await getAttendanceByClass(id, formattedDate);
      const statusMap = new Map(
        data.map((item) => [
          String(item.student_id).trim(),
          item.status === true || item.status === 'true' || item.status === 1,
        ])
      );
      setAttendanceStatus(statusMap);
    } catch (err) {
      console.error("Lỗi khi lấy điểm danh:", err);
    }
  };
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const formatted = data.map((row) => ({
          name: row.name?.toString() || "",
          student_id: row.student_id?.toString() || "",
          birth_date: new Date(row.birth_date).toISOString().split("T")[0],
          class_id: id,
        }));

        // Gửi từng sinh viên lên server
        for (const student of formatted) {
          if (student.name && student.student_id && student.birth_date) {
            await createStudent(student);
          }
        }

        Swal.fire("Thành công", `Đã nhập ${formatted.length} sinh viên`, "success");
        await fetchInitialData();
      } catch (err) {
        console.error("Lỗi khi xử lý file:", err);
        Swal.fire("Lỗi", "Không thể đọc file Excel", "error");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleInitAttendance = async () => {
    try {
      const res = await initAttendanceByClass(id);
      Swal.fire("Thành công", res.message || "Đã khởi tạo điểm danh hôm nay", "success");
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
      await handleDateSelect(today);
      await fetchInitialData();
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi điểm danh.";
      Swal.fire("Lỗi", msg, "error");
      console.error("Điểm danh lỗi:", err);
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
        <div className="flex gap-2 items-center">
          <button
            onClick={handleInitAttendance}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Điểm danh hôm nay
          </button>

          <button
            onClick={handleAddStudentOptions}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            + Thêm sinh viên
          </button>

          <input
            type="file"
            accept=".xlsx"
            onChange={handleImportExcel}
            className="hidden"
            id="excel-upload"
          />
        </div>

      </div>

      {dates.length > 0 && (
        <div className="mb-4">
          <select
            value={selectedDate || ""}
               onChange={async (e) => {
              const value = e.target.value;
              if (value === "") {
                setSelectedDate(null);
                setAttendanceStatus(new Map());
                await fetchInitialData(); 
              } else {
                handleDateSelect(value);
              }
            }}
            className="px-4 py-2 border rounded text-sm"
          >
            <option value="">- Chọn ngày -</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
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
              {currentStudents.map((sv, index) => {
                const key = String(sv.student_id).trim();
                const status = attendanceStatus.get(key);
                const hasRecord = attendanceStatus.has(key);

                const toggleAttendance = async () => {
                  try {
                    const newStatus = !status;
                    await markAttendance({
                      student_id: sv.student_id,
                      class_id: id,
                      attendance_date: selectedDate,
                      status: newStatus,
                    });
                    setAttendanceStatus(
                      new Map(attendanceStatus.set(key, newStatus))
                    );
                  } catch (err) {
                    Swal.fire("Lỗi", "Không thể cập nhật điểm danh", "error");
                    console.error(err);
                  }
                };

                return (
                  <tr key={sv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{startIndex + index + 1}</td>
                    <td className="px-4 py-2 border-b">{sv.name}</td>
                    <td className="px-4 py-2 border-b">{sv.student_id}</td>
                    <td className="px-4 py-2 border-b">{formatDate(sv.birth_date)}</td>
                    <td className="px-4 py-2 border-b text-center">
                      {selectedDate ? (
                        <input
                          type="checkbox"
                          checked={status || false}
                          onChange={toggleAttendance}
                          className="w-6 h-6 accent-blue-600 rounded"
                        />
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
                );
              })}
            </tbody>
          </table>

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
