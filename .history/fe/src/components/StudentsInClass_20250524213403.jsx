import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentsByClass } from "../services/studentAPI";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function StudentsInClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, classRes] = await Promise.all([
          getStudentsByClass(id),
          axios.get(`http://localhost:5000/api/classes/${id}`)
        ]);

        setStudents(studentRes);
        setClassName(classRes.data.class_name);
        setClassCode(classRes.data.class_code);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <div className="pt-20 p-6 ml-64">
      <div className="flex items-center mb-4">
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
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">STT</th>
              <th className="px-4 py-2 border-b text-left">Mã sinh viên</th>
              <th className="px-4 py-2 border-b text-left">Họ tên</th>
              <th className="px-4 py-2 border-b text-left">Ngày sinh</th>
            </tr>
          </thead>
          <tbody>
            {students.map((sv, index) => (
              <tr key={sv.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{sv.student_id}</td>
                <td className="px-4 py-2 border-b">{sv.name}</td>
                <td className="px-4 py-2 border-b">{formatDate(sv.birth_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
