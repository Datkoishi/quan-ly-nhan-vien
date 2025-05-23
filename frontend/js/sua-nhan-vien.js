// Cấu hình API URL
const API_URL = 'http://localhost:3000/api/nhanvien';

// DOM Elements
const editNhanVienForm = document.getElementById('editNhanVienForm');
const nhanVienIdInput = document.getElementById('nhanVienId');

// Hàm khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    // Lấy ID nhân viên t�� URL
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
    
    // Thêm sự kiện validate cho các trường khi thay đổi giá trị
    const formInputs = editNhanVienForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('change', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });
});

// Hàm kiểm tra tính hợp lệ của một trường
function validateField(field) {
    // Xóa trạng thái hiện tại
    field.classList.remove('is-valid', 'is-invalid');
    
    // Kiểm tra trường bắt buộc
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('is-invalid');
        return false;
    }
    
    // Kiểm tra email
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    // Kiểm tra số điện thoại
    if (field.id === 'soDienThoai' && field.value.trim()) {
        const phoneRegex = /^(0[3-9][0-9]{8}|1[89]00[0-9]{4})$/;
        if (!phoneRegex.test(field.value.trim())) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    // Kiểm tra lương
    if (field.id === 'luong' && field.value.trim()) {
        const salary = parseFloat(field.value);
        if (isNaN(salary) || salary < 0) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    // Kiểm tra chức vụ (có thể để trống nhưng sẽ hiển thị thông báo)
    if (field.id === 'chucVu') {
        if (!field.value) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    // Nếu không có lỗi, đánh dấu là hợp lệ
    field.classList.add('is-valid');
    return true;
}

// Hàm kiểm tra tất cả các trường trong form
function validateForm() {
    const formInputs = editNhanVienForm.querySelectorAll('input, select');
    let isValid = true;
    
    formInputs.forEach(input => {
        // Chỉ kiểm tra các trường bắt buộc và các trường có giá trị
        if (input.hasAttribute('required') || input.value.trim() || input.id === 'chucVu') {
            const fieldValid = validateField(input);
            isValid = isValid && fieldValid;
        }
    });
    
    return isValid;
}

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
        document.getElementById('chucVu').value = nhanVien.chuc_vu || '';
        document.getElementById('phongBan').value = nhanVien.phong_ban || '';
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
    
    // Kiểm tra tính hợp lệ của form
    if (!validateForm()) {
        showAlert('Vui lòng kiểm tra lại thông tin nhập vào', 'warning');
        return;
    }
    
    const nhanVienId = nhanVienIdInput.value;
    
    // Lấy dữ liệu từ form
    const formData = new FormData(editNhanVienForm);
    const nhanVien = {
        ho_ten: formData.get('ho_ten').trim(),
        email: formData.get('email').trim(),
        so_dien_thoai: formData.get('so_dien_thoai').trim(),
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