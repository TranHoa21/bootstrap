import { productData } from './data.js';

const itemsPerPage = 12; // Số lượng sản phẩm trên mỗi trang
let currentPage = 1;

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
                <img class="new-products-item-image" src="${product.image}" />
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

// Khởi tạo phân trang và hiển thị sản phẩm ban đầu
document.addEventListener('DOMContentLoaded', () => {
    setupPagination();
    displayProducts(currentPage);
});

document.querySelectorAll('.btn-hot-products-item').forEach(button => {
    button.addEventListener('click', function () {
        const productItem = button.closest('.hot-products-item');
        const productId = productItem.getAttribute('data-id');
        const product = products.find(p => p.id == productId);
        if (product) {
            document.getElementById('product-title').innerText = product.title;
            document.getElementById('product-price').innerText = product.price || product.prices?.[product.options.capacity[0]]?.[product.options.color[0]];
            document.getElementById('product-image').src = product.image;
            document.getElementById('product-description').innerText = product.description;
            document.getElementById('product-ram').innerText = product.RAM;
            document.getElementById('product-mobile_network').innerText = product.mobile_network;
            document.getElementById('product-sim').innerText = product.Sim;
            document.getElementById('product-cpu').innerText = product.CPU;
            document.getElementById('product-operating_system').innerText = product.operating_system;
            document.getElementById('product-screen').innerText = product.screen;
            document.getElementById('product-resolution').innerText = product.resolution;

            const selectedCapacity = product.options.capacity[0];
            const selectedColor = product.options.color[0];
            const productType = `${selectedCapacity} - ${selectedColor}`;

            document.querySelector('.box-product').style.display = 'none';
            document.querySelector('.product-details').style.display = 'flex';
            const capacityOptions = document.getElementById('capacity-options');
            capacityOptions.innerHTML = '';
            product.options.capacity.forEach(item => {
                const button = document.createElement('button');
                button.classList.add('capacity-option');
                button.dataset.value = item;
                button.textContent = item;
                capacityOptions.appendChild(button);
            });

            const colorOptions = document.getElementById('color-options');
            colorOptions.innerHTML = '';
            product.options.color.forEach(item => {
                const button = document.createElement('button');
                button.classList.add('color-option');
                button.dataset.value = item;
                button.textContent = item;
                colorOptions.appendChild(button);
            });

            // Thêm event listener để hiển thị active state
            const capacityButtons = document.querySelectorAll('.capacity-option');
            const colorButtons = document.querySelectorAll('.color-option');

            capacityButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    capacityButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updatePrice();
                });
            });

            colorButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    colorButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updatePrice();
                });
            });
            const addToCartButton = document.getElementById('add-to-cart');
            addToCartButton.onclick = function () {
                const selectedCapacity = document.querySelector('.capacity-option.active').getAttribute('data-value');
                const selectedColor = document.querySelector('.color-option.active').getAttribute('data-value');
                // Gọi hàm updatePrice() ở đây
                updatePrice(selectedCapacity, selectedColor);

                if (product.prices) {
                    const productPrice = product.prices[selectedCapacity][selectedColor];
                    if (productPrice) {
                        addToCart(product.title, productPrice, product.image, `${selectedCapacity} - ${selectedColor}`, productId);
                    } else {
                        console.error('Giá không tồn tại cho tùy chọn này.');
                    }
                } else {
                    addToCart(product.title, product.price, product.image, `${selectedCapacity} - ${selectedColor}`, productId);
                }
            };
        } else {
            console.error('Không tìm thấy sản phẩm với ID:', productId);
        }
    });
});
