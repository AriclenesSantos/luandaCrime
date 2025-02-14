<?php
header('Content-Type: application/json');
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
    $db = new Database();
    $conn = $db->connect();

    $data = json_decode(file_get_contents('php://input'), true);

    $sql = "INSERT INTO crime_reports (
      user_id, region, location, crime_type, 
      weapons_present, firearms_count, melee_weapons_count,
      casualties_present, deaths_count, injured_count,
      additional_args
    ) VALUES (
      :user_id, :region, :location, :crime_type,
      :weapons_present, :firearms_count, :melee_weapons_count,
      :casualties_present, :deaths_count, :injured_count,
      :additional_args
    )";

    $stmt = $conn->prepare($sql);
    
    $stmt->bindParam(':user_id', $data['user_id']);
    $stmt->bindParam(':region', $data['region']);
    $stmt->bindParam(':location', $data['location']);
    $stmt->bindParam(':crime_type', $data['crimeType']);
    $stmt->bindParam(':weapons_present', $data['weapons']['present'], PDO::PARAM_BOOL);
    $stmt->bindParam(':firearms_count', $data['weapons']['firearms']);
    $stmt->bindParam(':melee_weapons_count', $data['weapons']['meleeWeapons']);
    $stmt->bindParam(':casualties_present', $data['casualties']['present'], PDO::PARAM_BOOL);
    $stmt->bindParam(':deaths_count', $data['casualties']['deaths']);
    $stmt->bindParam(':injured_count', $data['casualties']['injured']);
    $stmt->bindParam(':additional_args', $data['additionalArgs']);

    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Crime report registered successfully']);
  } catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
  }
}
?>