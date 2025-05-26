import React, { useState } from "react";
import { deleteClass } from "../services/classAPI";
import Swal from "sweetalert2";

export default function EditClass({ onClose, onSave, defaultData, onDeleted }) {
  const [classCode, setClassCode] = useState(defaultData?.class_code || "");
  const [className, setClassName] = useState(defaultData?.class_name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ class_code: classCode, class_name: className });
    Swal.fire("Thành công", defaultData ? "Đã cập nhật lớp học" : "Đã thêm lớp học mới", "success");
    onClose();
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xoá lớp này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ"
    });

    if (result.isConfirmed) {
      await deleteClass(defaultData.id);
      Swal.fire("Đã xoá!", "Lớp học đã được xoá thành công.", "success");

      if (typeof onDeleted === "function") {
        onDeleted(); // ✅ Gọi callback từ ClassList để cập nhật danh sách
      }

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
