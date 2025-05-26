import React, { useEffect, useState } from "react";
import { getClasses, addClass, updateClass, deleteClass } from "../services/classAPI";
import EditClass from "./EditClass";
import ellipsisVertical from '../assets/ellipsis-vertical.svg';
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách lớp học</h1>
      <button
        onClick={() => {
          setEditingClass(null);
          setShowModal(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Thêm lớp học
      </button>
      <div className="grid grid-cols-1 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{cls.class_name}</h2>
              <p className="text-gray-600">Mã lớp: {cls.class_code}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => handleViewStudents(cls)} className="text-blue-600 hover:underline">
                👥 Xem SV
              </button>
              <img
                src={ellipsisVertical}
                alt="Chỉnh sửa"
                className="w-5 h-5 cursor-pointer"
                onClick={() => handleEllipsisClick(cls)}
              />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <EditClass
          defaultData={editingClass}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onDeleted={fetchData}
        />
      )}
    </div>
  );
}
