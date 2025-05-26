import React, { useState } from "react";
import { deleteClass } from "../services/classAPI";

export default function EditClass({ onClose, onSave, defaultData }) {
  const [classCode, setClassCode] = useState(defaultData?.class_code || "");
  const [className, setClassName] = useState(defaultData?.class_name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ class_code: classCode, class_name: className });
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc muốn xoá lớp này?")) {
      await deleteClass(defaultData.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {defaultData ? "Chỉnh sửa lớp" : "Thêm lớp mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Mã lớp"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="text"
            placeholder="Tên lớp"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
          <div className="flex justify-between items-center pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Hủy
            </button>
            <div className="flex gap-2">
              {defaultData && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Xoá
                </button>
              )}
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Lưu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
