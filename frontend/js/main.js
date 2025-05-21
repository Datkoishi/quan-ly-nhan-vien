// Cấu hình API URL
const API_URL = 'http://localhost:3000/api/nhanvien';

// Biến toàn cục
let nhanVienList = [];
let currentPage = 1;
let itemsPerPage = 10;
let deleteId = null;

// DOM Elements
const nhanVienTableBody = document.getElementById('nhanVienList');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const filterPhongBan = document.getElementById('filterPhongBan');
const sortOption = document.getElementById('sortOption');
const confirmDeleteButton = document.getElementById('confirmDelete');
const deleteModal = document.getElementById('deleteModal'); // Declare the variable before using it

// Import Bootstrap Modal
const bootstrap = window.bootstrap; // Assuming Bootstrap is loaded globally

// Hàm khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    // Tải danh sách nhân viên
    fetchNhanVien();
    
    // Thêm sự kiện cho các nút
    searchButton.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
    
    filterPhongBan.addEventListener('change', applyFilters);
    sortOption.addEventListener('change', applyFilters);
    confirmDeleteButton.addEventListener('click', confirmDelete);
});

// Hàm lấy danh sách nhân viên từ API
async function fetchNhanVien() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Không thể kết nối đến máy chủ');
        }
        
        const data = await response.json();
        nhanVienList = data;
        applyFilters();
    } catch (error) {
        console.error('Lỗi:', error);
        showAlert('Đã xảy ra lỗi khi tải dữ liệu nhân viên', 'danger');
    }
}

// Hàm áp dụng bộ lọc và sắp xếp
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const phongBanFilter = filterPhongBan.value;
    const sortBy = sortOption.value;
    
    // Lọc danh sách
    let filteredList = nhanVienList.filter(nv => {
        const matchSearch = nv.ho_ten.toLowerCase().includes(searchTerm) || 
                           nv.email.toLowerCase().includes(searchTerm) ||
                           (nv.so_dien_thoai && nv.so_dien_thoai.includes(searchTerm));
        
        const matchPhongBan = phongBanFilter === '' || nv.phong_ban === phongBanFilter;
        
        return matchSearch && matchPhongBan;
    });
    
    // Sắp xếp danh sách
    filteredList.sort((a, b) => {
        switch (sortBy) {
            case 'name_asc':
                return a.ho_ten.localeCompare(b.ho_ten);
            case 'name_desc':
                return b.ho_ten.localeCompare(a.ho_ten);
            case 'salary_asc':
                return a.luong - b.luong;
            case 'salary_desc':
                return b.luong - a.luong;
            default:
                return 0;
        }
    });
    
    // Hiển thị danh sách đã lọc và sắp xếp
    renderNhanVien(filteredList);
}

// Hàm hiển thị danh sách nhân viên
function renderNhanVien(list) {
    // Tính toán phân trang
    const totalPages = Math.ceil(list.length / itemsPerPage);
    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedList = list.slice(start, end);
    
    // Xóa nội dung cũ
    nhanVienTableBody.innerHTML = '';
    
    // Kiểm tra nếu không có dữ liệu
    if (paginatedList.length === 0) {
        nhanVienTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">Không tìm thấy nhân viên nào</td>
            </tr>
        `;
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Hiển thị dữ liệu
    paginatedList.forEach(nv => {
        const row = document.createElement('tr');
        
        // Format lương
        const formattedSalary = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(nv.luong || 0);
        
        // Format ngày
        const formattedDate = nv.ngay_vao_lam ? new Date(nv.ngay_vao_lam).toLocaleDateString('vi-VN') : '';
        
        row.innerHTML = `
            <td>${nv.id}</td>
            <td>${nv.ho_ten}</td>
            <td>${nv.email}</td>
            <td>${nv.so_dien_thoai || ''}</td>
            <td>${nv.chuc_vu || ''}</td>
            <td>${nv.phong_ban || ''}</td>
            <td class="currency">${formattedSalary}</td>
            <td>${formattedDate}</td>
            <td>
                <a href="sua-nhan-vien.html?id=${nv.id}" class="btn btn-sm btn-primary btn-action">
                    <i class="bi bi-pencil"></i>
                </a>
                <button class="btn btn-sm btn-danger btn-action" onclick="showDeleteModal(${nv.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        nhanVienTableBody.appendChild(row);
    });
    
    // Hiển thị phân trang
    renderPagination(totalPages);
}

// Hàm hiển thị phân trang
function renderPagination(totalPages) {
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    const ul = document.createElement('ul');
    ul.className = 'pagination';
    
    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Trước</a>`;
    ul.appendChild(prevLi);
    
    // Các trang
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>`;
        ul.appendChild(li);
    }
    
    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Sau</a>`;
    ul.appendChild(nextLi);
    
    paginationContainer.appendChild(ul);
}

// Hàm chuyển trang
function changePage(page) {
    currentPage = page;
    applyFilters();
}

// Hàm hiển thị modal xác nhận xóa
function showDeleteModal(id) {
    deleteId = id;
    const modalInstance = new bootstrap.Modal(deleteModal);
    modalInstance.show();
}

// Hàm xác nhận xóa nhân viên
async function confirmDelete() {
    if (!deleteId) return;
    
    try {
        const response = await fetch(`${API_URL}/${deleteId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Không thể xóa nhân viên');
        }
        
        // Cập nhật danh sách
        nhanVienList = nhanVienList.filter(nv => nv.id !== deleteId);
        applyFilters();
        
        // Đóng modal
        const modalInstance = new bootstrap.Modal(deleteModal);
        modalInstance.hide();
        
        // Hiển thị thông báo
        showAlert('Xóa nhân viên thành công', 'success');
    } catch (error) {
        console.error('Lỗi:', error);
        showAlert('Đã xảy ra lỗi khi xóa nhân viên', 'danger');
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
    
    // Thêm vào đầu container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}