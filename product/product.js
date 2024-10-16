
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