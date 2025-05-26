import React from 'react';
import { useParams } from 'react-router-dom';

export default function StudentsInClass() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Danh sách sinh viên lớp {id}</h1>
      {/* Hiển thị danh sách sinh viên tương ứng ở đây */}
    </div>
  );
}
