
let cartItemCount = 0;
let cartItemsData = {};
let selectedCapacity = null;
let selectedColor = null;
const products = [
    {
        id: '1',
        title: 'Điện thoại iPhone 16 Pro Max 256GB',
        image: 'https://res.cloudinary.com/dhjrrk4pg/image/upload/v1728974132/iphone-16-pro-max-titan-den-1-638638962017739954-750x500_drvd5f.jpg',
        description: 'iPhone 16 Pro Max 256GB là siêu phẩm công nghệ mới nhất từ Apple, mang đến thiết kế đẳng cấp và hiệu năng vượt trội. Sở hữu màn hình OLED Super Retina XDR sắc nét, hỗ trợ độ phân giải 1320 x 2868 pixels, thiết bị này cho trải nghiệm hiển thị chân thực và sống động. Với dung lượng lưu trữ lên đến 256GB và RAM 8GB, iPhone 16 Pro Max đảm bảo khả năng đa nhiệm mượt mà và lưu trữ rộng rãi. Bên cạnh đó, chiếc điện thoại này còn hỗ trợ mạng 5G và đi kèm các màu sắc độc đáo như Titan tự nhiên, Titan đen, Titan trắng, và Titan sa mạc, giúp người dùng thể hiện phong cách riêng biệt.',
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
function updateCartCount(cartCountElement, count) {
    if (cartCountElement) {
        cartCountElement.innerText = `${count} sản phẩm`;

        // Lưu số lượng vào localStorage
        localStorage.setItem('cartCount', count);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const cartCountElement = document.getElementById('cart-count'); // Lấy phần tử có ID cart-count
    const cartItems = JSON.parse(localStorage.getItem('cart')) || {}; // Lấy giỏ hàng từ localStorage
    const cartItemCount = Object.keys(cartItems).length; // Lấy số lượng sản phẩm trong giỏ hàng

    updateCartCount(cartCountElement, cartItemCount); // Cập nhật số lượng trên giao diện
});

let totalOrderPrice = 0;
document.addEventListener('DOMContentLoaded', function () {
    window.addToCart = function (productTitle, productPrice, productImage, productType, productId, productQuantity) {
        const cartCountElement = window.parent.document.getElementById('cart-count');

        // Lấy cart từ localStorage hoặc tạo mới nếu chưa có
        const cart = JSON.parse(localStorage.getItem('cart')) || {};

        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
        const existingProductKey = `${productId}-${productType}`;
        const existingProduct = cart[existingProductKey];

        if (existingProduct) {
            // Nếu sản phẩm đã có và cùng loại, chỉ tăng số lượng
            existingProduct.quantity += productQuantity;

            // Cập nhật lại giỏ hàng trong localStorage
            cart[existingProductKey] = existingProduct;
            localStorage.setItem('cart', JSON.stringify(cart));

            // Cập nhật số lượng giỏ hàng
            updateCartCount(cartCountElement, Object.keys(cart).length);
            showNotification('Sản phẩm đã có trong giỏ hàng!');
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng
            cart[existingProductKey] = {
                title: productTitle,
                price: productPrice,
                quantity: productQuantity,
                type: productType,
                image: productImage
            };

            // Lưu lại giỏ hàng vào localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartCount(cartCountElement, Object.keys(cart).length);
            showNotification('Đã thêm sản phẩm vào giỏ hàng!');
        }
    }

    const selectedProductId = localStorage.getItem('selectedProductId');
    if (selectedProductId) {
        const product = products.find(p => p.id == selectedProductId);
        if (product) {
            displayProductInfo(product);
            displayOptions(product);
            addOptionEventListeners();

            // Thêm sự kiện cho nút "Thêm vào giỏ hàng"
            const addToCartButton = document.getElementById('add-to-cart');
            addToCartButton.addEventListener('click', function () {
                const selectedColor = document.querySelector('.color-option.active')?.dataset.value; // Lấy màu sắc đã chọn
                const selectedCapacity = document.querySelector('.capacity-option.active')?.dataset.value; // Lấy dung lượng đã chọn
                const productPrice = product.price || product.prices?.[selectedCapacity]?.[selectedColor]; // Lấy giá dựa trên dung lượng và màu sắc đã chọn
                // Chuyển đổi giá tiền về dạng số
                const priceValue = parseFloat(productPrice.replace(/[^\d]/g, ''));

                // Kiểm tra tính hợp lệ của giá
                if (isNaN(priceValue)) {
                    console.error('Lỗi: Giá sản phẩm không hợp lệ.', productPrice);
                    return; // Dừng lại nếu giá không hợp lệ
                }

                console.log("Giá sản phẩm hợp lệ:", priceValue);
                addToCart(
                    product.title,  // Tên sản phẩm
                    priceValue,   // Giá sản phẩm
                    product.image,  // Hình ảnh sản phẩm
                    selectedColor,  // Màu sắc đã chọn
                    product.id,     // ID sản phẩm
                    1                // Số lượng mặc định là 1
                );
                updateTotalPrice(priceValue, 'add');
            });
        } else {
            console.error('Không tìm thấy sản phẩm với ID:', selectedProductId);
        }
    } else {
        console.error('Không có ID sản phẩm được chọn!');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
    const cartItemsContainer = document.getElementById('cartItems');
    let cartItemCount = 0;

    // Hiển thị sản phẩm trong giỏ hàng
    for (const key in cartItems) {
        const item = cartItems[key];
        cartItemCount++;

        const newRow = document.createElement('tr');
        const totalPrice = (item.price * item.quantity).toLocaleString() + '₫';
        newRow.classList.add(`cart-item-${item.id}`);
        newRow.innerHTML = `
            <td>${cartItemCount}</td>
            <td><img src="${item.image}" width="50" /></td>
            <td>${item.title}</td>
            <td>${item.type}</td>
            <td>
                <input type="number" class="form-control quantity" value="${item.quantity}" min="1" />
            </td>
            <td class="total-price">${totalPrice}</td>
            <td><button class="btn btn-danger delete-item">Xóa</button></td>
        `;
        cartItemsContainer.appendChild(newRow);
        document.getElementById('totalPrice').innerText = `${totalOrderPrice.toLocaleString()}₫`;
        // Thêm sự kiện cho nút "Xóa"
        newRow.querySelector('.delete-item').addEventListener('click', function () {
            const itemPrice = parseFloat(newRow.querySelector('.total-price').innerText.replace(/[^\d]/g, ''));
            updateTotalPrice(itemPrice, 'remove');
            newRow.remove();
            cartItemCount--;
            updateCartCount(cartItemCount);
            delete cartItems[key];
            localStorage.setItem('cart', JSON.stringify(cartItems)); // Cập nhật localStorage
            showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
        });

        // Cập nhật số lượng
        const quantityInput = newRow.querySelector('.quantity');
        quantityInput.addEventListener('input', function () {
            const newQuantity = parseInt(quantityInput.value);
            if (newQuantity <= 0) {
                newRow.querySelector('.delete-item').click(); // Gọi sự kiện xóa nếu số lượng <= 0
            } else {
                cartItems[key].quantity = newQuantity; // Cập nhật số lượng
                const totalPriceCell = newRow.querySelector('.total-price');
                const newTotal = (item.price * newQuantity).toLocaleString();
                totalPriceCell.innerText = `${newTotal}₫`;
                localStorage.setItem('cart', JSON.stringify(cartItems));
                // Cập nhật localStorage
            }
        });
    }

    // Cập nhật số lượng giỏ hàng
    updateCartCount(cartItemCount);
});

document.addEventListener('DOMContentLoaded', function () {
    const totalPriceElement = document.getElementById('totalPrice');
    const storedTotalPrice = localStorage.getItem('totalOrderPrice');

    // Lấy giá trị tổng tiền từ localStorage
    if (storedTotalPrice) {
        totalOrderPrice = parseFloat(storedTotalPrice); // Chuyển đổi thành số
    } else {
        totalOrderPrice = 0; // Nếu không có, đặt về 0
    }

    // Cập nhật hiển thị tổng tiền
    totalPriceElement.innerText = `${totalOrderPrice.toLocaleString()}₫`;
});

// Hàm hiển thị thông báo
function showNotification(message) {
    alert(message); // Thay thế bằng phương pháp hiển thị thông báo tốt hơn nếu cần
}

function updateTotalPrice(productPrice, action) {
    console.log("Tổng tiền hiện tại:", totalOrderPrice);
    console.log("Giá sản phẩm:", productPrice);
    console.log("Hành động:", action);

    if (action === 'add') {
        totalOrderPrice += productPrice;
    } else if (action === 'remove') {
        totalOrderPrice -= productPrice; // Trừ giá khỏi tổng
    }

    // Đảm bảo tổng tiền không âm
    if (totalOrderPrice < 0) {
        totalOrderPrice = 0;
    }
    localStorage.setItem('totalOrderPrice', totalOrderPrice);
    // Cập nhật hiển thị tổng tiền
    document.getElementById('totalPrice').innerText = `${totalOrderPrice.toLocaleString()}₫`;

    // Lưu tổng tiền vào localStorage

}

document.addEventListener('DOMContentLoaded', function () {
    // Thêm sự kiện cho các nút trong sản phẩm mới
    document.querySelectorAll('.btn-new-products-item').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // Ngăn chặn sự kiện nổi bọt để không kích hoạt sự kiện cho phần tử cha
            const productItem = button.closest('.new-products-item');
            const productId = productItem.getAttribute('data_id');

            if (productId) {
                // Điều hướng tới trang chi tiết sản phẩm với ID
                window.location.href = `/product/product.html?id=${productId}`;
            } else {
                console.error('ID sản phẩm không tồn tại!');
            }
        });
    });

    // Thêm sự kiện cho các nút trong sản phẩm hot
    document.querySelectorAll('.btn-hot-products-item').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
            const productItem = button.closest('.hot-products-item');
            const productId = productItem.getAttribute('data_id');

            if (productId) {
                // Lưu ID sản phẩm vào localStorage để sử dụng ở trang product.html
                localStorage.setItem('selectedProductId', productId);

                // Điều hướng tới trang chi tiết sản phẩm
                window.location.href = '/product/product.html';
            } else {
                console.error('ID sản phẩm không tồn tại!');
            }
        });
    });

    // Thêm sự kiện cho các phần tử sản phẩm hot
    document.querySelectorAll('.filtered-products-item').forEach(productItem => {
        productItem.addEventListener('click', function () {
            const productId = productItem.getAttribute('data_id');

            if (productId) {
                // Lưu ID sản phẩm vào localStorage để sử dụng ở trang product.html
                localStorage.setItem('selectedProductId', productId);

                // Điều hướng tới trang chi tiết sản phẩm
                window.location.href = '/product/product.html';
            } else {
                console.error('ID sản phẩm không tồn tại!');
            }
        });
    });
    // Thêm sự kiện cho các phần tử sản phẩm hot
    document.querySelectorAll('.hot-products-item').forEach(productItem => {
        productItem.addEventListener('click', function () {
            const productId = productItem.getAttribute('data_id');

            if (productId) {
                // Lưu ID sản phẩm vào localStorage để sử dụng ở trang product.html
                localStorage.setItem('selectedProductId', productId);

                // Điều hướng tới trang chi tiết sản phẩm
                window.location.href = '/product/product.html';
            } else {
                console.error('ID sản phẩm không tồn tại!');
            }
        });
    });

    // Thêm sự kiện cho các phần tử sản phẩm mới
    document.querySelectorAll('.new-products-item').forEach(productItem => {
        productItem.addEventListener('click', function () {
            const productId = productItem.getAttribute('data_id');

            if (productId) {
                // Điều hướng tới trang chi tiết sản phẩm với ID
                window.location.href = `/product/product.html?id=${productId}`;
            } else {
                console.error('ID sản phẩm không tồn tại!');
            }
        });
    });
});


// Trong trang product.html
// Hàm để hiển thị thông tin sản phẩm
function displayProductInfo(product) {
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
}


function displayOptions(product) {
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
}

// Hàm để thêm sự kiện cho các tùy chọn dung lượng và màu sắc
function addOptionEventListeners() {
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
}

// Hàm chính để xử lý khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    const selectedProductId = localStorage.getItem('selectedProductId');
    if (selectedProductId) {
        const product = products.find(p => p.id == selectedProductId);
        if (product) {
            displayProductInfo(product);
            displayOptions(product);
            addOptionEventListeners();
            addToCartEvent(product);
        } else {
            console.error('Không tìm thấy sản phẩm với ID:', selectedProductId);
        }
    } else {
        console.error('Không có ID sản phẩm được chọn!');
    }
});

function updatePrice() {
    const selectedCapacity = document.querySelector('.capacity-option.active')?.getAttribute('data-value');
    const selectedColor = document.querySelector('.color-option.active')?.getAttribute('data-value');
    const quantity = parseInt(document.getElementById('product-quantity').value, 10); // Lấy số lượng sản phẩm

    if (!selectedCapacity || !selectedColor) {
        console.error('Chưa chọn dung lượng hoặc màu sắc.');
        return;
    }

    let price;
    if (products.prices) {
        price = products.prices[selectedCapacity][selectedColor];
    } else {
        price = products.price;
    }

    if (price) {
        const totalPrice = price * quantity; // Tính tổng giá theo số lượng
        document.getElementById('product-price').innerText = totalPrice.toLocaleString() + ' VND'; // Hiển thị giá
    } else {
        console.error('Giá không tồn tại cho tùy chọn này.');
    }
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
    let cartItemCount = 0; // Đặt lại số lượng sản phẩm
    localStorage.setItem('cartCount', cartItemCount);

    // Đặt lại tổng tiền
    totalOrderPrice = 0;
    document.getElementById('totalPrice').innerText = '0₫'; // Reset tổng tiền
    localStorage.setItem('totalOrderPrice', totalOrderPrice);

    // Xóa giỏ hàng trong localStorage
    localStorage.removeItem('cart'); // Xóa thông tin giỏ hàng

    // Hiển thị thông báo
    showNotification('Đã xóa tất cả sản phẩm trong giỏ hàng!');
});
// Lấy phần tử có ID "pay-now"
const payNowButton = document.getElementById('pay-now');

// Lấy phần tử có ID "pay-now-container"
const payNowContainer = document.getElementById('pay-now-container');

// Thêm sự kiện "click" cho nút "Thanh toán"
payNowButton.addEventListener('click', function () {
    // Thay đổi thuộc tính "display" của phần tử "pay-now-container" thành "block" để hiển thị
    payNowContainer.style.display = 'block';
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









