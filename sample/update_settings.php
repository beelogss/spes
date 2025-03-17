<?php
session_start();
require_once '../config/database.php';

if(!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit();
}

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $db = new Database();
    $conn = $db->getConnection();
    
    $fullname = trim($_POST['fullname']);
    $email = trim($_POST['email']);
    $new_password = $_POST['new_password'];
    
    // Update basic info
    $stmt = $conn->prepare("UPDATE users SET fullname = ?, email = ? WHERE id = ?");
    $stmt->execute([$fullname, $email, $_SESSION['user_id']]);
    
    // Update password if provided
    if(!empty($new_password) && $_POST['new_password'] === $_POST['confirm_password']) {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hashed_password, $_SESSION['user_id']]);
    }
    
    header('Location: exam.php?settings_updated=1');
    exit();
}