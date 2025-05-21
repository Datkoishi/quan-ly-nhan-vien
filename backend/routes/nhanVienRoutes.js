import express from 'express';
import * as nhanVienController from '../controllers/nhanVienController.js';

const router = express.Router();

// Lấy tất cả nhân viên
router.get('/', nhanVienController.getAllNhanVien);

// Lấy thông tin một nhân viên theo ID
router.get('/:id', nhanVienController.getNhanVienById);

// Thêm nhân viên mới
router.post('/', nhanVienController.createNhanVien);

// Cập nhật thông tin nhân viên
router.put('/:id', nhanVienController.updateNhanVien);

// Xóa nhân viên
router.delete('/:id', nhanVienController.deleteNhanVien);

export default router;