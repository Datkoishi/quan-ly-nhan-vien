import * as nhanVienModel from '../models/nhanVienModel.js';

// Lấy tất cả nhân viên
export async function getAllNhanVien(req, res) {
  try {
    const nhanVien = await nhanVienModel.getAllNhanVien();
    res.status(200).json(nhanVien);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Lấy thông tin một nhân viên theo ID
export async function getNhanVienById(req, res) {
  try {
    const id = req.params.id;
    const nhanVien = await nhanVienModel.getNhanVienById(id);
    
    if (!nhanVien) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    
    res.status(200).json(nhanVien);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Thêm nhân viên mới
export async function createNhanVien(req, res) {
  try {
    const nhanVien = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!nhanVien.ho_ten || !nhanVien.email) {
      return res.status(400).json({ message: 'Họ tên và email là bắt buộc' });
    }
    
    const newNhanVien = await nhanVienModel.createNhanVien(nhanVien);
    res.status(201).json(newNhanVien);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Cập nhật thông tin nhân viên
export async function updateNhanVien(req, res) {
  try {
    const id = req.params.id;
    const nhanVien = req.body;
    
    // Kiểm tra xem nhân viên có tồn tại không
    const existingNhanVien = await nhanVienModel.getNhanVienById(id);
    if (!existingNhanVien) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    
    const updatedNhanVien = await nhanVienModel.updateNhanVien(id, nhanVien);
    res.status(200).json(updatedNhanVien);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Xóa nhân viên
export async function deleteNhanVien(req, res) {
  try {
    const id = req.params.id;
    
    // Kiểm tra xem nhân viên có tồn tại không
    const existingNhanVien = await nhanVienModel.getNhanVienById(id);
    if (!existingNhanVien) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    
    await nhanVienModel.deleteNhanVien(id);
    res.status(200).json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}