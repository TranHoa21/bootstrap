let itemsPerPage = 12; // Số lượng sản phẩm trên mỗi trang
let currentPage = 1;
let productData = []; // Mảng chứa dữ liệu sản phẩm từ server

// Hàm lấy dữ liệu từ server
async function fetchProductData() {
    try {
        const response = await fetch('https://api.example.com/products'); // Đổi URL thành API thực tế
        const data = await response.json();
        productData = data; // Lưu dữ liệu sản phẩm vào biến productData
        setupPagination(); // Tạo phân trang
        displayProducts(currentPage); // Hiển thị sản phẩm cho trang đầu tiên
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    }
}

// Hàm để hiển thị sản phẩm dựa trên số trang hiện tại
function displayProducts(page) {
    const productContainer = document.querySelector('.new-products-box');
    productContainer.innerHTML = ''; // Xóa sản phẩm cũ trước khi hiển thị sản phẩm mới

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = productData.slice(startIndex, endIndex);

    let rowElement; // Biến lưu trữ row hiện tại
    paginatedItems.forEach((product, index) => {
        if (index % 4 === 0) {
            // Mỗi 4 sản phẩm, tạo một row mới
            rowElement = document.createElement('div');
            rowElement.classList.add('row'); // Tạo một row mới
            productContainer.appendChild(rowElement);
        }

        const productElement = `
            <div class="col-md-3 new-products-item">
                <img class="new-products-item-image" src="${product.img}" alt="${product.title}" />
                <h6 class="new-products-item-title">${product.title}</h6>
                <p class="new-products-item-price">${product.price}</p>
                <button class="btn-hot-products-item">Chọn sản phẩm</button>
            </div>
        `;
        rowElement.innerHTML += productElement;
    });
}

// Hàm tạo nút phân trang
function setupPagination() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // Xóa các nút trang cũ

    const totalPages = Math.ceil(productData.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-btn');
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayProducts(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }
}

// Khi trang tải, gọi API để lấy dữ liệu sản phẩm và hiển thị
document.addEventListener('DOMContentLoaded', () => {
    fetchProductData(); // Gọi API lấy dữ liệu khi trang vừa tải
});
