import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentsByClass, createStudent } from "../services/studentAPI";
import axios from "axios";
import { ArrowLeft, Plus } from "lucide-react";

export default function StudentsInClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    birth_date: "",
    class_id: id,
  });

  const fetchData = async () => {
    try {
      const [studentRes, classRes, summaryRes] = await Promise.all([
        getStudentsByClass(id),
        axios.get(`http://localhost:5000/api/classes/${id}`),
        axios.get(`http://localhost:5000/api/classes/${id}/attendance-summary`)
      ]);

      // Map appearance vào từng sinh viên
      const summaryMap = new Map(
        summaryRes.data.map(item => [item.student_id, item.appearance])
      );

      const mergedStudents = studentRes.map(s => ({
        ...s,
        appearance: summaryMap.get(s.student_id) || 0
      }));

      setStudents(mergedStudents);
      setClassName(classRes.data.class_name);
      setClassCode(classRes.data.class_code);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await createStudent({ ...formData, class_id: id });
      setShowModal(false);
      setFormData({ name: "", student_id: "", birth_date: "", class_id: id });
      fetchData(); // refresh danh sách
    } catch (err) {
      alert("Lỗi khi thêm sinh viên");
      console.error(err);
    }
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
            {students.map((sv, index) => (
              <tr key={sv.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{sv.name}</td>
                <td className="px-4 py-2 border-b">{sv.student_id}</td>
                <td className="px-4 py-2 border-b">{formatDate(sv.birth_date)}</td>
                <td className="...">
                  {sv.appearance} / {sv.total_sessions} 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
