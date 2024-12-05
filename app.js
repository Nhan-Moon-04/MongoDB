document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngừng hành động mặc định của form

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Gửi yêu cầu đăng nhập
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Lưu token vào localStorage
        alert('Đăng nhập thành công!');
    } else {
        const error = await response.text();
        alert('Lỗi: ' + error);
    }
});