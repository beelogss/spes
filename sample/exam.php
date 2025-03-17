<?php
session_start();
if(!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit();
}
require_once '../config/database.php';

// Get user info
$db = new Database();
$conn = $db->getConnection();
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPES Exam System - <?php echo ucfirst($user['user_type']); ?> Level</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header>
        <div class="header-container">
            <div class="logo-section">
                <div class="logos">
                    <img src="peso.png" alt="Peso Logo" class="peso-logo">
                    <img src="bagong_montalban.png" alt="Montalban Logo" class="montalban-logo">
                </div>
                <div class="title-section">
                    <h1>Special Program for Employment of Students (SPES) Exam</h1>
                    <p class="subtitle">Municipality of Rodriguez (Montalban)</p>
                </div>
            </div>
            
            <nav>
                <ul>
                    <li><a href="#" class="active"><i class="fas fa-home"></i> Home</a></li>
                    <li><a href="#" id="examLink"><i class="fas fa-pencil-alt"></i> Take Exam</a></li>
                    <li><a href="#" id="resultsLink"><i class="fas fa-chart-bar"></i> Results</a></li>
                    <li><a href="#" id="settingsLink"><i class="fas fa-cog"></i> Settings</a></li>
                </ul>
            </nav>
            
            <div class="user-info">
                <div class="user-profile">
                    <span class="user-name"><?php echo htmlspecialchars($user['fullname']); ?></span>
                    <span class="user-type"><?php echo ucfirst($user['user_type']); ?> Level</span>
                </div>
                <span id="timer" class="hidden">Time: <span id="time">00:00</span></span>
                <div class="user-controls">
                    <button id="darkModeToggle"><i class="fas fa-moon"></i></button>
                    <a href="../logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i></a>
                </div>
            </div>
        </div>
    </header>

    <!-- Update the Settings Modal -->
    <div id="settingsModal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h2>User Settings</h2>
                <button type="button" class="close-btn" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="settingsForm" method="POST" action="update_settings.php">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullname" value="<?php echo htmlspecialchars($user['fullname']); ?>">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>">
                </div>
                <div class="form-group">
                    <label>Change Password</label>
                    <input type="password" name="new_password" placeholder="New Password">
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" placeholder="Confirm New Password">
                </div>
                <div class="form-actions">
                    <button type="submit" class="primary-btn">Save Changes</button>
                    <button type="button" class="secondary-btn" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <main>
        <div id="welcomeSection" class="section card">
            <h2>Welcome to Modern Exam System</h2>
            <p>Ready to test your knowledge?</p>
            <div class="exam-info">
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>Time Limit: 10 minutes</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-question-circle"></i>
                    <span>Total Questions: <span id="totalQuestions">0</span></span>
                </div>
            </div>
            <button id="startExamBtn" class="primary-btn">
                <i class="fas fa-play"></i> Start Exam
            </button>
        </div>

        <div id="examSection" class="section hidden">
            <div class="progress-bar">
                <div id="progressFill"></div>
            </div>
            <div id="questionContainer" class="card"></div>
            <div class="exam-controls">
                <button id="prevQuestion" class="secondary-btn"><i class="fas fa-arrow-left"></i> Previous</button>
                <button id="nextQuestion" class="secondary-btn">Next <i class="fas fa-arrow-right"></i></button>
                <button id="submitExam" class="primary-btn"><i class="fas fa-check"></i> Submit Exam</button>
            </div>
        </div>

        <div id="resultsSection" class="section hidden">
            <div class="card">
                <h2>Your Results</h2>
                <div id="scoreContainer"></div>
                <div id="chartContainer"></div>
                <button id="retakeExam" class="primary-btn">
                    <i class="fas fa-redo"></i> Retake Exam
                </button>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="script.js"></script>
</body>
</html>