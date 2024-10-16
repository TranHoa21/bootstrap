// JavaScript cho phân trang
const itemsPerPage = 12;
let currentPage = 1;

// Hàm lấy tất cả sản phẩm từ HTML
function getProductsFromHTML() {
    const items = document.querySelectorAll('.new-products-item');
    return Array.from(items).map(item => {
        return {
            title: item.querySelector('.new-products-item-title').innerText,
            price: item.querySelector('.new-products-item-price').innerText,
            image: item.querySelector('.new-products-item-image').src
        };
    });
}

// Hàm hiển thị sản phẩm
function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Reset container

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    let row; // Khai báo biến để chứa hàng sản phẩm

    paginatedProducts.forEach((product, index) => {
        // Tạo hàng mới nếu là sản phẩm đầu tiên trong hàng
        if (index % 4 === 0) {
            row = document.createElement('div');
            row.className = 'new-products-box row';
            productContainer.appendChild(row);
        }

        const productItem = document.createElement('div');
        productItem.className = 'col-md-3 new-products-item';
        productItem.innerHTML = `
            <img class="new-products-item-image" src="${product.image}" />
            <h6 class="new-products-item-title">${product.title}</h6>
            <p class="new-products-item-price">${product.price}</p>
            <button class="btn-hot-products-item">Chọn sản phẩm</button>
        `;

        row.appendChild(productItem); // Thêm sản phẩm vào hàng
    });
}

// Hàm tạo phân trang

function setupPagination(products) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(products.length / itemsPerPage);

    paginationContainer.innerHTML = ''; // Reset phân trang

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = 'pagination-button';

        // Thêm sự kiện khi nút được nhấn
        pageButton.onclick = () => {
            currentPage = i; // Cập nhật trang hiện tại
            displayProducts(products); // Hiển thị sản phẩm cho trang hiện tại
            updateActiveButton(); // Cập nhật lớp active
        };

        paginationContainer.appendChild(pageButton);
    }

    // Cập nhật lớp active cho nút phân trang
    updateActiveButton();
}

// Hàm để cập nhật lớp active cho nút phân trang
function updateActiveButton() {
    const buttons = document.querySelectorAll('.pagination-button');
    buttons.forEach((button, index) => {
        if (index + 1 === currentPage) {
            button.classList.add('active'); // Thêm lớp active cho nút đang chọn
        } else {
            button.classList.remove('active'); // Bỏ lớp active cho các nút khác
        }
    });
}
// Hàm khởi động
function init() {
    const products = getProductsFromHTML();
    displayProducts(products);
    setupPagination(products);
}

// Gọi hàm khởi động
init();
