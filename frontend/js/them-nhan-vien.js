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
    
    // Thêm sự kiện validate cho các trường khi thay đổi giá trị
    const formInputs = nhanVienForm.querySelectorAll('input, select');
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
    const formInputs = nhanVienForm.querySelectorAll('input, select');
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

// Hàm xử lý khi submit form
async function handleSubmit(e) {
    e.preventDefault();
    
    // Kiểm tra tính hợp lệ của form
    if (!validateForm()) {
        showAlert('Vui lòng kiểm tra lại thông tin nhập vào', 'warning');
        return;
    }
    
    // Lấy dữ liệu từ form
    const formData = new FormData(nhanVienForm);
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
        
        // Reset form và trạng thái validation
        nhanVienForm.reset();
        nhanVienForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        
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