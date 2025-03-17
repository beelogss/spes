<?php
session_start();
require_once 'config/database.php';

$error = '';
$success = '';

// Handle Registration
if(isset($_POST['register'])) {
    $db = new Database();
    $conn = $db->getConnection();
    
    $fullname = trim($_POST['fullname']);
    $email = trim($_POST['email']);
    $username = trim($_POST['new_username']);
    $password = $_POST['new_password'];
    $user_type = $_POST['user_type'];
    
    // Validate inputs
    if(strlen($password) < 6) {
        $error = "Password must be at least 6 characters long";
    } else {
        $stmt = $conn->prepare("INSERT INTO users (fullname, email, username, password, user_type) VALUES (?, ?, ?, ?, ?)");
        try {
            $stmt->execute([$fullname, $email, $username, password_hash($password, PASSWORD_DEFAULT), $user_type]);
            $success = "Account created successfully! Please login.";
        } catch(PDOException $e) {
            $error = "Username already exists";
        }
    }
}

// Handle Login
if(isset($_POST['login'])) {
    $db = new Database();
    $conn = $db->getConnection();
    
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['user_type'] = $user['user_type'];
        header('Location: sample/exam.php');
        exit();
    } else {
        $error = "Invalid username or password";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>SPES Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/login.css">
</head>
<body>
    <!-- Mobile logo section -->
    <div class="mobile-logo">
        <img src="sample/bagong_montalban.png" alt="Montalban Logo">
        <h2>Welcome to SPES</h2>
        <p>Special Program for Employment of Students</p>
        <p>Municipality of Rodriguez (Montalban)</p>
    </div>

    <!-- Main container -->
    <div class="container">
        <div class="left-panel">
            <div class="logo-section">
                <img src="sample/peso.png" alt="PESO Logo">
                <h2>SPES Online Examination</h2>
            </div>
            <?php if($error): ?>
                <div class="error"><?php echo $error; ?></div>
            <?php endif; ?>
            <?php if($success): ?>
                <div class="success"><?php echo $success; ?></div>
            <?php endif; ?>
            
            <!-- Login Form -->
            <form id="loginForm" method="POST">
                <div class="input-group">
                    <label><i class="fas fa-user"></i> Username</label>
                    <input type="text" name="username" required>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <div class="password-input-container">
                        <input type="password" name="password" id="loginPassword" required>
                        <i class="fas fa-lock input-icon-left"></i>
                        <i class="fas fa-eye password-toggle" onclick="togglePassword('loginPassword', this)"></i>
                    </div>
                </div>
                <button type="submit" name="login" class="btn btn-primary">Login</button>
                <div class="toggle-form">
                    <a href="#" onclick="toggleForms()">Don't have an account? Register</a>
                </div>
            </form>

            <!-- Registration Form -->
            <form id="registerForm" method="POST">
                <div class="input-group">
                    <label><i class="fas fa-user-circle"></i> Full Name</label>
                    <input type="text" name="fullname" required>
                </div>
                <div class="input-group">
                    <label><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" name="email" required>
                </div>
                <div class="input-group">
                    <label><i class="fas fa-user"></i> Username</label>
                    <input type="text" name="new_username" required>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <div class="password-input-container">
                        <input type="password" name="new_password" id="registerPassword" required>
                        <i class="fas fa-lock input-icon-left"></i>
                        <i class="fas fa-eye password-toggle" onclick="togglePassword('registerPassword', this)"></i>
                    </div>
                </div>
                <div class="input-group">
                    <label><i class="fas fa-graduation-cap"></i> Educational Level</label>
                    <select name="user_type" required>
                        <option value="shs">Senior High School</option>
                        <option value="college">College</option>
                    </select>
                </div>
                <button type="submit" name="register" class="btn btn-secondary">Register</button>
                <div class="toggle-form">
                    <a href="#" onclick="toggleForms()">Already have an account? Login</a>
                </div>
            </form>
        </div>
        <div class="right-panel">
            <div style="text-align: center;">
                <img src="sample/bagong_montalban.png" alt="Montalban Logo" style="max-width: 200px;">
                <h2>Welcome to SPES</h2>
                <p>Special Program for Employment of Students</p>
                <p>Municipality of Rodriguez (Montalban)</p>
            </div>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        // Initially hide register form
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    function toggleForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if(loginForm.style.display !== 'none') {
            loginForm.classList.add('fade-out');
            setTimeout(() => {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
                registerForm.classList.add('fade-in');
            }, 300);
        } else {
            registerForm.classList.add('fade-out');
            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
                loginForm.classList.add('fade-in');
            }, 300);
        }
    }

    function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
</script>
</body>
</html>