<?php
session_start();
if($_SESSION['role'] != 'admin') {
    header('Location: ../login.php');
    exit();
}

require_once '../config/database.php';
$db = new Database();
$conn = $db->getConnection();

// Get statistics
$totalStudents = $conn->query("SELECT COUNT(*) FROM users WHERE role='user'")->fetchColumn();
$totalExams = $conn->query("SELECT COUNT(*) FROM exam_results")->fetchColumn();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPES Admin Dashboard</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <div class="admin-container">
        <nav class="admin-nav">
            <h2>Admin Dashboard</h2>
            <ul>
                <li><a href="#" class="active">Overview</a></li>
                <li><a href="students.php">Students</a></li>
                <li><a href="results.php">Results</a></li>
                <li><a href="questions.php">Questions</a></li>
                <li><a href="settings.php">Settings</a></li>
                <li><a href="logout.php">Logout</a></li>
            </ul>
        </nav>

        <main class="admin-content">
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Students</h3>
                    <p><?php echo $totalStudents; ?></p>
                </div>
                <div class="stat-card">
                    <h3>Total Exams Taken</h3>
                    <p><?php echo $totalExams; ?></p>
                </div>
            </div>

            <!-- Recent Results Table -->
            <div class="recent-results">
                <h3>Recent Exam Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $stmt = $conn->prepare("
                            SELECT 
                                u.username,
                                er.score,
                                er.submitted_at,
                                er.id
                            FROM exam_results er
                            JOIN users u ON er.user_id = u.id
                            ORDER BY er.submitted_at DESC
                            LIMIT 10
                        ");
                        $stmt->execute();
                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                            echo "<tr>
                                <td>{$row['username']}</td>
                                <td>{$row['score']}%</td>
                                <td>{$row['submitted_at']}</td>
                                <td>
                                    <a href='view_result.php?id={$row['id']}'>View</a>
                                </td>
                            </tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</body>
</html>