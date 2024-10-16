let cartItemCount = 0; // Khởi tạo biến cartItemCount
let totalOrderPrice = 0; // Khởi tạo biến tổng tiền đơn hàng


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

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-new-products-item').forEach(button => {
        button.addEventListener('click', function () {
            const productItem = button.closest('.new-products-item'); // Tìm phần tử sản phẩm chứa nút
            const productId = productItem.getAttribute('data-id'); // Lấy ID sản phẩm từ data-id

            if (productId) {
                // Điều hướng tới trang chi tiết sản phẩm với ID
                window.location.href = `/product/product.html?id=${productId}`;
            } else {
                console.error('ID sản phẩm không tồn tại!');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn-hot-products-item').forEach(button => {
        button.addEventListener('click', function () {
            const productItem = button.closest('.hot-products-item');
            const productId = productItem.getAttribute('data-id');

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
});

// Trong trang product.html
document.addEventListener('DOMContentLoaded', function () {
    const selectedProductId = localStorage.getItem('selectedProductId');
    if (selectedProductId) {
        const product = products.find(p => p.id == selectedProductId);
        if (product) {
            // Render thông tin sản phẩm
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
            // ... (tiếp tục rendering các thông tin khác)

            // Hiển thị lựa chọn dung lượng và màu
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

            // Xử lý sự kiện khi chọn dung lượng hoặc màu
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

            const quantityInput = document.getElementById('product-quantity');
            quantityInput.addEventListener('input', updatePrice); // Cập nhật giá khi số lượng thay đổi

            // Hàm thêm sản phẩm vào giỏ hàng
            const addToCartButton = document.getElementById('add-to-cart');
            addToCartButton.onclick = function () {
                const selectedCapacity = document.querySelector('.capacity-option.active').getAttribute('data-value');
                const selectedColor = document.querySelector('.color-option.active').getAttribute('data-value');
                const quantity = parseInt(document.getElementById('product-quantity').value, 10); // Lấy giá trị số lượng

                updatePrice(selectedCapacity, selectedColor, quantity);

                if (product.prices) {
                    const productPrice = product.prices[selectedCapacity][selectedColor];
                    if (productPrice) {
                        addToCart(product.title, productPrice, product.image, `${selectedCapacity} - ${selectedColor}`, productId, quantity);
                    } else {
                        console.error('Giá không tồn tại cho tùy chọn này.');
                    }
                } else {
                    addToCart(product.title, product.price, product.image, `${selectedCapacity} - ${selectedColor}`, productId, quantity);
                }
            };
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
        price = product.price;
    }

    if (price) {
        const totalPrice = price * quantity; // Tính tổng giá theo số lượng
        document.getElementById('product-price').innerText = totalPrice.toLocaleString() + ' VND'; // Hiển thị giá
    } else {
        console.error('Giá không tồn tại cho tùy chọn này.');
    }
}
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





