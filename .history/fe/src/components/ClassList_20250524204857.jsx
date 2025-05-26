import React, { useEffect, useState } from "react";
import { getClasses, addClass, updateClass, deleteClass } from "../services/classAPI";
import EditClass from "./EditClass";
import pencil from '../assets/pencil.svg';
import person from '../assets/person.svg'
import { useNavigate } from "react-router-dom";

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const data = await getClasses();
    setClasses(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingClass) {
        await updateClass(editingClass.id, data);
      } else {
        await addClass(data);
      }
      fetchData();
    } catch (err) {
      alert("Thao tác thất bại: " + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleEllipsisClick = (cls) => {
    setEditingClass(cls);
    setShowModal(true);
  };

  const handleViewStudents = (cls) => {
    navigate(`/class/${cls.id}/students`);
  };

  return (
    <div className="pt-20 p-6 ml-64 max-w-[calc(100vw-256px)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Danh sách lớp học</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
          onClick={() => {
            setEditingClass(null);
            setShowModal(true);
          }}
        >
          + Thêm lớp
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">STT</th>
              <th className="px-4 py-2 border-b text-left">Mã lớp</th>
              <th className="px-4 py-2 border-b text-left">Tên lớp</th>
              <th className="px-4 py-2 border-b text-left">Số lượng SV</th>
              <th className="px-4 py-2 border-b text-left"></th>
              <th th className="px-4 py-2 border-b text-left"></th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => (
              <tr key={cls.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{cls.class_code}</td>
                <td className="px-4 py-2 border-b">{cls.class_name}</td>
                <td className="px-4 py-2 border-b">{cls.student_count}</td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button onClick={() => handleEllipsisClick(cls)}>
                    <img src={pencil} alt="Menu" className="w-5 h-5 cursor-pointer transition" />
                  </button>
                  <button onClick={() => handleViewStudents(cls)} className="text-blue-600 hover:underline">
                     <img src={person} alt="Menu" className="w-5 h-5 cursor-pointer transition" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EditClass
          defaultData={editingClass}
          onClose={() => {
            setShowModal(false);
            setEditingClass(null);
          }}
          onSave={handleSave}
          onDeleted={fetchData}
        />
      )}
    </div>
  );
}