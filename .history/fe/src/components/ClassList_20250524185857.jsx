import React, { useEffect, useState } from "react";
import { getClasses } from "../services/classAPI";

export default function ClassList() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (err) {
        console.error("Lỗi khi tải lớp:", err);
      }
    };
    fetchData();
  }, []);

  return (
  <div className="p-6 w-full">
    <h2 className="text-xl font-bold mb-4">Danh sách lớp học</h2>
    <div className="overflow-x-auto">
      <table className="w-full bg-white border border-gray-200 rounded shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border-b">STT</th>
            <th className="px-4 py-2 border-b">Mã lớp</th>
            <th className="px-4 py-2 border-b">Tên lớp</th>
            <th className="px-4 py-2 border-b">Số lượng SV</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls, index) => (
            <tr key={cls.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">{cls.class_code}</td>
              <td className="px-4 py-2 border-b">{cls.class_name}</td>
              <td className="px-4 py-2 border-b text-center">{cls.student_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}
