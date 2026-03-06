
const loginForm = document.querySelector("form");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = loginForm.querySelector("input[type='email']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        alert("Login successful!");
        loginForm.reset();
    });
}




const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (name.length < 3) {
            alert("Name must be at least 3 characters.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Invalid email address.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        alert("Account created successfully!");
        registerForm.reset();
    });
}



function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}



function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    alert("Google Login Successful!");
}
