import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nhanVienRoutes from './routes/nhanVienRoutes.js';

// Cấu hình dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Đường dẫn tĩnh cho frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, '../frontend')));

// Routes
app.use('/api/nhanvien', nhanVienRoutes);

// Route mặc định trả về trang chủ
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});