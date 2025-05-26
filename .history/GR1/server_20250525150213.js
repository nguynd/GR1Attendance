const express = require('express');
const cors = require('cors');
require('dotenv').config();

const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
let attendanceRoutes;
try {
  attendanceRoutes = require('./routes/attendanceRoutes');
  console.log("✅ Đã load attendanceRoutes thành công");
} catch (err) {
  console.error("❌ Lỗi khi require attendanceRoutes:", err.message);
}

const app = express();
app.use(cors());
app.use(express.json());  

app.use('/api/classes', classRoutes);      
app.use('/api/students', studentRoutes);  
app.use('/api/attendances', attendanceRoutes);  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
