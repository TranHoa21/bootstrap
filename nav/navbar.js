
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định
        parent.location.href = this.href; // Chuyển hướng trang cha
    });
});

document.querySelectorAll('.shopping-cart').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định
        parent.location.href = this.href; // Chuyển hướng trang cha
    });
});

