<?php
header('Content-Type: application/json');
require_once 'database.php';

if (isset($_GET['user_id'])) {
  try {
    $db = new Database();
    $conn = $db->connect();

    $sql = "SELECT * FROM crime_reports 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $_GET['user_id']);
    $stmt->execute();

    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'reports' => $reports]);
  } catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
  }
}
?>