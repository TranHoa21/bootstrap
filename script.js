let cartItemCount = 0; // Khởi tạo biến cartItemCount
let totalOrderPrice = 0; // Khởi tạo biến tổng tiền đơn hàng

const products = [
    {
        id: '1',
        title: 'Điện thoại iPhone 16 Pro Max 256GB',
        image: 'https://res.cloudinary.com/dhjrrk4pg/image/upload/v1728974132/iphone-16-pro-max-titan-den-1-638638962017739954-750x500_drvd5f.jpg',
        description: 'Sản phẩm cao cấp của Apple với công nghệ hiện đại.',
        options: {
            capacity: ['256GB', '512GB', '1TB'],
            color: ['Titan tự nhiên', 'Titan trắng', 'Titan đen', 'Titan Sa Mạc']
        },
        prices: {
            '256GB': {
                'Titan tự nhiên': '34.990.000₫',
                'Titan trắng': '35.490.000₫',
                'Titan đen': '35.990.000₫',
                'Titan Sa Mạc': '36.490.000₫'
            },
            '512GB': {
                'Titan tự nhiên': '39.990.000₫',
                'Titan trắng': '40.490.000₫',
                'Titan đen': '40.990.000₫',
                'Titan Sa Mạc': '41.490.000₫'
            },
            '1TB': {
                'Titan tự nhiên': '44.990.000₫',
                'Titan trắng': '45.490.000₫',
                'Titan đen': '45.990.000₫',
                'Titan Sa Mạc': '46.490.000₫'
            }
        },
        RAM: '8 GB',
        mobile_network: 'Hỗ trợ 5G',
        Sim: '1 Nano SIM & 1 eSIM',
        CPU: 'Hãng không công bố',
        operating_system: 'IOS',
        screen: 'OLED',
        resolution: 'Super Retina XDR (1320 x 2868 Pixels)',

    },
    {
        id: '2',
        title: 'Điện thoại iPhone 15 Pro Max 256GB',
        image: 'https://res.cloudinary.com/dhjrrk4pg/image/upload/v1728974132/iphone-16-pro-max-titan-den-1-638638962017739954-750x500_drvd5f.jpg',
        description: 'Điện thoại iPhone 15 Pro Max với công nghệ mới nhất.',
        options: {
            capacity: ['128GB', '256GB'],
            color: ['Đen', 'Xanh', 'Trắng']
        },
        price: '29.990.000₫' // Sản phẩm này chỉ có một giá
    }
];

const cartItemsData = {};


function addToCart(productTitle, productPrice, productImage, productType, productId, productQuantity) {
    const priceValue = parseFloat(productPrice.replace(/[^\d]/g, '')); // Chuyển đổi giá tiền về dạng số

    if (isNaN(priceValue)) {
        console.error('Lỗi: Giá sản phẩm không hợp lệ.');
        return;
    }

    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng với cùng ID
    const existingProduct = cartItemsData[`${productId}-${productType}`];

    if (existingProduct) {
        // Nếu sản phẩm đã có nhưng khác phân loại hoặc giá
        if (existingProduct.type !== productType || existingProduct.price !== priceValue) {
            // Tăng số lượng cho mục mới
            cartItemCount++;
            document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;

            const cartItems = document.getElementById('cartItems');
            const newRow = document.createElement('tr');
            newRow.classList.add(`cart-item-${productId}`);
            newRow.innerHTML = `
            <td>${cartItemCount}</td>
            <td><img src="${productImage}" width="80" /></td>
            <td>${productTitle}</td>
            <td>${productType}</td>
            <td><input type="number" class="form-control quantity" value="${productQuantity}" min="1"></td>
            <td class="total-price">${productPrice}</td>
            <td><button class="btn btn-danger delete-item">Xóa</button></td>
        `;

            cartItems.appendChild(newRow);

            // Thêm sản phẩm mới vào cartItemsData
            cartItemsData[`${productId}-${productType}`] = {
                title: productTitle,
                price: priceValue,
                quantity: productQuantity,
                type: productType // Lưu trữ loại sản phẩm
            };

            updateTotalPrice(priceValue * productQuantity, 'add');

            newRow.querySelector('.delete-item').addEventListener('click', function () {
                const itemPrice = parseFloat(newRow.querySelector('.total-price').innerText.replace(/[^\d]/g, ''));
                updateTotalPrice(itemPrice, 'remove');
                newRow.remove();
                cartItemCount--;
                document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;
                delete cartItemsData[`${productId}-${productType}`]; // Sử dụng id + type để xóa
                showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
            });

            const quantityInput = newRow.querySelector('.quantity');
            quantityInput.addEventListener('input', function () {
                const newQuantity = parseInt(quantityInput.value);
                const totalPriceCell = newRow.querySelector('.total-price');

                if (newQuantity <= 0) {
                    const itemPrice = parseFloat(totalPriceCell.innerText.replace(/[^\d]/g, ''));
                    updateTotalPrice(itemPrice, 'remove');
                    newRow.remove();
                    cartItemCount--;
                    document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;
                    delete cartItemsData[`${productId}-${productType}`]; // Sử dụng id + type để xóa
                    showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
                } else {
                    cartItemsData[`${productId}-${productType}`].quantity = newQuantity;
                    const newTotal = (cartItemsData[`${productId}-${productType}`].price * newQuantity).toLocaleString();
                    totalPriceCell.innerText = `${newTotal}₫`;
                    updateTotalPrice(cartItemsData[`${productId}-${productType}`].price * (newQuantity - existingProduct.quantity), 'update');
                }
            });

            showNotification('Đã thêm sản phẩm vào giỏ hàng!');
        } else {
            // Nếu sản phẩm đã có và cùng loại, chỉ tăng số lượng
            existingProduct.quantity += productQuantity;
            const quantityInput = document.querySelector(`.cart-item-${productId} .quantity`);
            quantityInput.value = existingProduct.quantity;

            const totalPriceCell = document.querySelector(`.cart-item-${productId} .total-price`);
            const newTotal = (priceValue * existingProduct.quantity).toLocaleString();
            totalPriceCell.innerText = `${newTotal}₫`;

            updateTotalPrice(priceValue * productQuantity, 'update');
            showNotification('Sản phẩm đã có trong giỏ hàng!');
        }
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng
        cartItemCount++;
        document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;

        const cartItems = document.getElementById('cartItems');
        const newRow = document.createElement('tr');
        newRow.classList.add(`cart-item-${productId}`);
        newRow.innerHTML = `
        <td>${cartItemCount}</td>
        <td><img src="${productImage}" width="50" /></td>
        <td>${productTitle}</td>
        <td>${productType}</td>
        <td><input type="number" class="form-control quantity" value="${productQuantity}" min="1"></td>
        <td class="total-price">${productPrice}</td>
        <td><button class="btn btn-danger delete-item">Xóa</button></td>
    `;

        cartItems.appendChild(newRow);

        cartItemsData[`${productId}-${productType}`] = {
            title: productTitle,
            price: priceValue,
            quantity: productQuantity,
            type: productType // Lưu trữ loại sản phẩm
        };

        updateTotalPrice(priceValue * productQuantity, 'add');

        newRow.querySelector('.delete-item').addEventListener('click', function () {
            const itemPrice = parseFloat(newRow.querySelector('.total-price').innerText.replace(/[^\d]/g, ''));
            updateTotalPrice(itemPrice, 'remove');
            newRow.remove();
            cartItemCount--;
            document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;
            delete cartItemsData[`${productId}-${productType}`]; // Sử dụng id + type để xóa
            showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
        });

        const quantityInput = newRow.querySelector('.quantity');
        quantityInput.addEventListener('input', function () {
            const newQuantity = parseInt(quantityInput.value);
            const totalPriceCell = newRow.querySelector('.total-price');

            if (newQuantity <= 0) {
                const itemPrice = parseFloat(totalPriceCell.innerText.replace(/[^\d]/g, ''));
                updateTotalPrice(itemPrice, 'remove');
                newRow.remove();
                cartItemCount--;
                document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;
                delete cartItemsData[`${productId}-${productType}`]; // Sử dụng id + type để xóa
                showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
            } else {
                cartItemsData[`${productId}-${productType}`].quantity = newQuantity;
                const newTotal = (cartItemsData[`${productId}-${productType}`].price * newQuantity).toLocaleString();
                totalPriceCell.innerText = `${newTotal}₫`;
                updateTotalPrice(cartItemsData[`${productId}-${productType}`].price * (newQuantity - productQuantity), 'update');
            }
        });

        showNotification('Đã thêm sản phẩm vào giỏ hàng!');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-hot-products-item').forEach(button => {
        button.addEventListener('click', function () {
            const productItem = button.closest('.hot-products-item'); // Tìm phần tử sản phẩm chứa nút
            const productId = productItem.getAttribute('data-id'); // Lấy ID sản phẩm từ data-id

            if (productId) {
                // Điều hướng tới trang chi tiết sản phẩm với ID
                window.location.href = `product.html?id=${productId}`;
            } else {
                console.error('ID sản phẩm không tồn tại!');
            }
        });
    });
});



// Hàm cập nhật tổng tiền
function updateTotalPrice(priceValue, action) {
    if (action === 'add') {
        totalOrderPrice += priceValue; // Cộng thêm giá vào tổng
    } else if (action === 'remove') {
        totalOrderPrice -= priceValue; // Trừ giá khỏi tổng
    } else if (action === 'update') {
        // Cập nhật tổng tiền lại
        totalOrderPrice = Array.from(document.querySelectorAll('.total-price')).reduce((acc, el) => {
            return acc + parseFloat(el.innerText.replace(/[^\d]/g, ''));
        }, 0);
    }
    document.getElementById('totalPrice').innerText = `${totalOrderPrice.toLocaleString()}₫`; // Cập nhật hiển thị tổng tiền
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Gắn sự kiện cho nút "Xóa tất cả"
document.getElementById('deleteAll').addEventListener('click', function () {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = ''; // Xóa nội dung bên trong tbody
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    cartItemCount = 0; // Đặt lại số lượng sản phẩm
    document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;

    // Đặt lại tổng tiền
    totalOrderPrice = 0;
    document.getElementById('totalPrice').innerText = '0₫'; // Reset tổng tiền

    // Đặt lại cartItemsData
    for (const key in cartItemsData) {
        delete cartItemsData[key];
    }

    // Hiển thị thông báo
    showNotification('Đã xóa tất cả sản phẩm trong giỏ hàng!');
});


// Hiển thị options cho capacity
const capacityOptions = document.getElementById('capacity-options');
products.forEach(product => {
    if (product.options && product.options.capacity) {
        product.options.capacity.forEach(item => {
            const button = document.createElement('button');
            button.classList.add('capacity-option');
            button.dataset.value = item;
            button.textContent = item;
            capacityOptions.appendChild(button);
        });
    }
});

// Hiển thị options cho color
const colorOptions = document.getElementById('color-options');
products.forEach(product => {
    if (product.options && product.options.color) {
        product.options.color.forEach(item => {
            const button = document.createElement('button');
            button.classList.add('color-option');
            button.dataset.value = item;
            button.textContent = item;
            colorOptions.appendChild(button);
        });
    }
});

// Thêm event listener để hiển thị active state
const capacityButtons = document.querySelectorAll('.capacity-option');
const colorButtons = document.querySelectorAll('.color-option');

capacityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        capacityButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        colorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

function updatePrice() {
    const product = products.find(p => p.title === document.getElementById('product-title').innerText);
    const selectedCapacity = document.querySelector('.capacity-option.active')?.getAttribute('data-value');
    const selectedColor = document.querySelector('.color-option.active')?.getAttribute('data-value');

    if (product && product.prices && selectedCapacity && selectedColor) {
        const productPrice = product.prices[selectedCapacity][selectedColor];
        if (productPrice) {
            document.getElementById('product-price').innerText = productPrice; // Cập nhật giá hiển thị
        } else {
            console.error('Giá không tồn tại cho tùy chọn này.');
        }
    } else {
        console.error('Chưa chọn dung lượng hoặc màu sắc.');
    }
}

// Gắn sự kiện click cho các nút tùy chọn dung lượng và màu sắc
document.querySelectorAll('.capacity-option').forEach(option => {
    option.addEventListener('click', function () {
        // Xóa class 'active' từ tất cả các nút 'capacity-option'
        document.querySelectorAll('.capacity-option').forEach(opt => opt.classList.remove('active'));
        // Thêm class 'active' cho nút được nhấp
        this.classList.add('active');
        updatePrice(); // Gọi hàm updatePrice để cập nhật giá
    });
});

document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function () {
        // Xóa class 'active' từ tất cả các nút 'color-option'
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        // Thêm class 'active' cho nút được nhấp
        this.classList.add('active');
        updatePrice(); // Gọi hàm updatePrice để cập nhật giá
    });
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định
        parent.location.href = this.href; // Chuyển hướng trang cha
    });
});

