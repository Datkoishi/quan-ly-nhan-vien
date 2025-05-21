// Cấu hình API URL
const API_URL = 'http://localhost:3000/api/nhanvien';

// DOM Elements
const editNhanVienForm = document.getElementById('editNhanVienForm');
const nhanVienIdInput = document.getElementById('nhanVienId');

// Hàm khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    // Lấy ID nhân viên từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const nhanVienId = urlParams.get('id');
    
    if (!nhanVienId) {
        // Nếu không có ID, chuyển hướng về trang danh sách
        window.location.href = 'index.html';
        return;
    }
    
    // Lưu ID vào input ẩn
    nhanVienIdInput.value = nhanVienId;
    
    // Tải thông tin nhân viên
    fetchNhanVien(nhanVienId);
    
    // Thêm sự kiện submit form
    editNhanVienForm.addEventListener('submit', handleSubmit);
});

// Hàm lấy thông tin nhân viên từ API
async function fetchNhanVien(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Không thể tải thông tin nhân viên');
        }
        
        const nhanVien = await response.json();
        
        // Điền thông tin vào form
        document.getElementById('hoTen').value = nhanVien.ho_ten || '';
        document.getElementById('email').value = nhanVien.email || '';
        document.getElementById('soDienThoai').value = nhanVien.so_dien_thoai || '';
        document.getElementById('chucVu').value = nhanVien.chuc_vu || 'Nhân viên';
        document.getElementById('phongBan').value = nhanVien.phong_ban || 'Kỹ thuật';
        document.getElementById('luong').value = nhanVien.luong || 0;
        
        // Format ngày
        if (nhanVien.ngay_vao_lam) {
            const date = new Date(nhanVien.ngay_vao_lam);
            const formattedDate = date.toISOString().split('T')[0];
            document.getElementById('ngayVaoLam').value = formattedDate;
        }
        
    } catch (error) {
        console.error('Lỗi:', error);
        showAlert('Đã xảy ra lỗi khi tải thông tin nhân viên', 'danger');
    }
}

// Hàm xử lý khi submit form
async function handleSubmit(e) {
    e.preventDefault();
    
    const nhanVienId = nhanVienIdInput.value;
    
    // Lấy dữ liệu từ form
    const formData = new FormData(editNhanVienForm);
    const nhanVien = {
        ho_ten: formData.get('ho_ten'),
        email: formData.get('email'),
        so_dien_thoai: formData.get('so_dien_thoai'),
        chuc_vu: formData.get('chuc_vu'),
        phong_ban: formData.get('phong_ban'),
        luong: parseFloat(formData.get('luong')) || 0,
        ngay_vao_lam: formData.get('ngay_vao_lam')
    };
    
    try {
        // Gửi dữ liệu lên server
        const response = await fetch(`${API_URL}/${nhanVienId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nhanVien)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Không thể cập nhật nhân viên');
        }
        
        // Hiển thị thông báo thành công
        showAlert('Cập nhật nhân viên thành công', 'success');
        
        // Chuyển hướng về trang danh sách sau 2 giây
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Lỗi:', error);
        showAlert(error.message || 'Đã xảy ra lỗi khi cập nhật nhân viên', 'danger');
    }
}

// Hàm hiển thị thông báo
function showAlert(message, type = 'info') {
    // Tạo phần tử thông báo
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Thêm vào đầu card-body
    const cardBody = document.querySelector('.card-body');
    cardBody.insertBefore(alertDiv, cardBody.firstChild);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}