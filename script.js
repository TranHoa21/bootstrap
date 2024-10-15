let cartItemCount = 0; // Khởi tạo biến cartItemCount
let totalOrderPrice = 0; // Khởi tạo biến tổng tiền đơn hàng

document.getElementById('show-cart').style.display = 'block';

document.getElementById('show-cart').addEventListener('click', function () {
    document.querySelector('.box-product').style.display = 'none';
    document.querySelector('.cart').style.display = 'block';
    document.querySelector('.cart').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('back-to-products').addEventListener('click', function () {
    document.querySelector('.cart').style.display = 'none';
    document.querySelector('.box-product').style.display = 'block';
});

// Hàm để thêm sản phẩm vào giỏ hàng
function addToCart(productTitle, productPrice, productImage) {
    cartItemCount++;
    document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;

    // Thêm sản phẩm vào giỏ hàng
    const cartItems = document.getElementById('cartItems');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="checkbox" class="select-item"></td>
        <td><img src="${productImage}" width="50" /></td>
        <td>${productTitle}</td>
        <td><input type="number" class="form-control quantity" value="1" min="1"></td>
        <td class="total-price">${productPrice}</td>
        <td><button class="btn btn-danger delete-item">Xóa</button></td>
    `;

    cartItems.appendChild(newRow);

    // Cập nhật tổng tiền khi thêm sản phẩm
    updateTotalPrice(productPrice, 'add');

    // Gắn sự kiện cho nút xóa
    newRow.querySelector('.delete-item').addEventListener('click', function () {
        updateTotalPrice(newRow.querySelector('.total-price').innerText, 'remove'); // Cập nhật tổng tiền
        newRow.remove();
        cartItemCount--;
        document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;
        showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
    });

    // Gắn sự kiện cho ô nhập số lượng
    const quantityInput = newRow.querySelector('.quantity');
    quantityInput.addEventListener('input', function () {
        const price = parseFloat(productPrice.replace(/[^\d]/g, '')); // Chuyển đổi giá tiền về dạng số
        const totalPriceCell = newRow.querySelector('.total-price');
        const newTotal = (price * quantityInput.value).toLocaleString();
        totalPriceCell.innerText = `${newTotal}₫`;
        updateTotalPrice(totalPriceCell.innerText, 'update'); // Cập nhật tổng tiền
    });

    // Hiển thị thông báo
    showNotification('Đã thêm sản phẩm vào giỏ hàng!');
}

// Hàm cập nhật tổng tiền
function updateTotalPrice(priceText, action) {
    const price = parseFloat(priceText.replace(/[^\d]/g, ''));
    if (action === 'add') {
        totalOrderPrice += price; // Cộng thêm giá vào tổng
    } else if (action === 'remove') {
        totalOrderPrice -= price; // Trừ giá khỏi tổng
    } else if (action === 'update') {
        // Chỉ cần tính lại tổng nếu có thay đổi số lượng
        totalOrderPrice = Array.from(document.querySelectorAll('.total-price')).reduce((acc, el) => {
            return acc + parseFloat(el.innerText.replace(/[^\d]/g, ''));
        }, 0);
    }

    document.getElementById('totalPrice').innerText = `${totalOrderPrice.toLocaleString()}₫`; // Cập nhật hiển thị tổng tiền
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

    // Hiển thị thông báo
    showNotification('Đã xóa tất cả sản phẩm trong giỏ hàng!');
});

// Hàm hiển thị thông báo
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message; // Cập nhật thông báo
    notification.style.display = 'block'; // Hiển thị thông báo

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Gắn sự kiện cho nút "Chọn sản phẩm"
document.querySelectorAll('.btn-hot-products-item').forEach(button => {
    button.addEventListener('click', function () {
        const productItem = button.closest('.hot-products-item');
        const productTitle = productItem.querySelector('.hot-products-item-title').innerText;
        const productPrice = productItem.querySelector('.hot-products-item-price').innerText;
        const productImage = productItem.querySelector('.hot-products-item-image').src; // Lấy đường dẫn ảnh
        addToCart(productTitle, productPrice, productImage); // Gọi hàm với ảnh
    });
});
