import React, { useEffect, useState } from "react";
import { getClasses } from "../services/classAPI";

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (err) {
        console.error("Lỗi khi tải lớp:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <p>Đang tải lớp...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách lớp</h2>
      <ul className="space-y-2">
        {classes.map((cls) => (
          <li key={cls.id} className="p-3 border rounded shadow-sm">
            <strong>{cls.class_code}</strong> - {cls.class_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
