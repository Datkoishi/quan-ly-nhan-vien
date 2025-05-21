// Cấu hình API URL
const API_URL = 'http://localhost:3000/api/nhanvien';

// DOM Elements
const nhanVienForm = document.getElementById('nhanVienForm');

// Hàm khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    // Thiết lập ngày mặc định là ngày hiện tại
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('ngayVaoLam').value = today;
    
    // Thêm sự kiện submit form
    nhanVienForm.addEventListener('submit', handleSubmit);
});

// Hàm xử lý khi submit form
async function handleSubmit(e) {
    e.preventDefault();
    
    // Lấy dữ liệu từ form
    const formData = new FormData(nhanVienForm);
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
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nhanVien)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Không thể thêm nhân viên');
        }
        
        // Hiển thị thông báo thành công
        showAlert('Thêm nhân viên thành công', 'success');
        
        // Reset form
        nhanVienForm.reset();
        
        // Thiết lập lại ngày mặc định
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('ngayVaoLam').value = today;
        
    } catch (error) {
        console.error('Lỗi:', error);
        showAlert(error.message || 'Đã xảy ra lỗi khi thêm nhân viên', 'danger');
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