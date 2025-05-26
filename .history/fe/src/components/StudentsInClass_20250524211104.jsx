import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentsByClass } from "../services/studentAPI";

export default function StudentsInClass() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudentsByClass(id);
        setStudents(data);
        if (data.length > 0) {
          setClassName(data[0].class_name || "");
          setClassCode(data[0].class_code || "");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sinh viên:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
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
      <h1 className="text-2xl font-bold mb-4">
        {className} ({classCode})
      </h1>
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