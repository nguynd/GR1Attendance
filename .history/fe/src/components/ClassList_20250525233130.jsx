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
              <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">STT</th>
              <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Mã lớp</th>
              <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Tên lớp</th>
              <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Số lượng SV</th>
              <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left"></th>
              <th th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => (
              <tr key={cls.id} className="hover:bg-gray-50">
                <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">{index + 1}</td>
                <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">{cls.class_code}</td>
                <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">{cls.class_name}</td>
                <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">{cls.student_count}</td>
                <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left ">
                  <button onClick={() => handleEllipsisClick(cls)}>
                    <img src={pencil} alt="Menu" className="w-5 h-5 cursor-pointer transition" />
                     </button>
                    </td>
                    <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">
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