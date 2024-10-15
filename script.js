let cartItemCount = 0; // Khởi tạo biến cartItemCount

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
function addToCart(productTitle, productPrice) {
    cartItemCount++;
    document.getElementById('cart-count').innerText = `${cartItemCount} sản phẩm`;

    // Thêm sản phẩm vào giỏ hàng
    const cartItems = document.getElementById('cartItems');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="checkbox" class="select-item"></td>
        <td><img src="https://res.cloudinary.com/dhjrrk4pg/image/upload/v1728974132/iphone-16-pro-max-titan-den-1-638638962017739954-750x500.jpg" width="50" /></td>
        <td>${productTitle}</td>
        <td><input type="number" class="form-control quantity" value="1" min="1"></td>
        <td class="total-price">${productPrice}</td>
        <td><button class="btn btn-danger delete-item">Xóa</button></td>
    `;
    cartItems.appendChild(newRow);

    // Hiển thị thông báo
    showNotification();
}

// Hàm hiển thị thông báo
function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'block'; // Hiển thị thông báo

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Gắn sự kiện cho nút "Chọn sản phẩm"
document.querySelectorAll('.btn-hot-products-item').forEach(button => {
    button.addEventListener('click', function () {
        console.log('Nút đã được nhấn'); // Thêm dòng này để kiểm tra
        const productItem = button.closest('.hot-products-item');
        const productTitle = productItem.querySelector('.hot-products-item-title').innerText;
        const productPrice = productItem.querySelector('.hot-products-item-price').innerText;
        addToCart(productTitle, productPrice);
    });
});
