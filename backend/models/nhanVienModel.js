import pool from './db.js';

// Lấy tất cả nhân viên
export async function getAllNhanVien() {
  try {
    const [rows] = await pool.query('SELECT * FROM nhan_vien WHERE trang_thai = TRUE');
    return rows;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    throw error;
  }
}

// Lấy thông tin một nhân viên theo ID
export async function getNhanVienById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM nhan_vien WHERE id = ? AND trang_thai = TRUE', [id]);
    return rows[0];
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhân viên:', error);
    throw error;
  }
}

// Thêm nhân viên mới
export async function createNhanVien(nhanVien) {
  try {
    const { ho_ten, email, so_dien_thoai, chuc_vu, phong_ban, luong, ngay_vao_lam } = nhanVien;
    const [result] = await pool.query(
      'INSERT INTO nhan_vien (ho_ten, email, so_dien_thoai, chuc_vu, phong_ban, luong, ngay_vao_lam) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ho_ten, email, so_dien_thoai, chuc_vu, phong_ban, luong, ngay_vao_lam]
    );
    return { id: result.insertId, ...nhanVien };
  } catch (error) {
    console.error('Lỗi khi thêm nhân viên:', error);
    throw error;
  }
}

// Cập nhật thông tin nhân viên
export async function updateNhanVien(id, nhanVien) {
  try {
    const { ho_ten, email, so_dien_thoai, chuc_vu, phong_ban, luong, ngay_vao_lam } = nhanVien;
    await pool.query(
      'UPDATE nhan_vien SET ho_ten = ?, email = ?, so_dien_thoai = ?, chuc_vu = ?, phong_ban = ?, luong = ?, ngay_vao_lam = ? WHERE id = ?',
      [ho_ten, email, so_dien_thoai, chuc_vu, phong_ban, luong, ngay_vao_lam, id]
    );
    return { id, ...nhanVien };
  } catch (error) {
    console.error('Lỗi khi cập nhật nhân viên:', error);
    throw error;
  }
}

// Xóa nhân viên (soft delete)
export async function deleteNhanVien(id) {
  try {
    await pool.query('UPDATE nhan_vien SET trang_thai = FALSE WHERE id = ?', [id]);
    return { id };
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
    throw error;
  }
}