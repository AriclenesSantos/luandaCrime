<?php
require_once 'database.php';

try {
  $db = new Database();
  $conn = $db->connect();

  // Create users table
  $sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )";
  $conn->exec($sql);

  // Create crime_reports table
  $sql = "CREATE TABLE IF NOT EXISTS crime_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    region VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    weapons_present BOOLEAN DEFAULT FALSE,
    firearms_count INT DEFAULT 0,
    melee_weapons_count INT DEFAULT 0,
    casualties_present BOOLEAN DEFAULT FALSE,
    deaths_count INT DEFAULT 0,
    injured_count INT DEFAULT 0,
    additional_args TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )";
  $conn->exec($sql);

  echo "Database tables created successfully";
} catch(PDOException $e) {
  echo "Error creating tables: " . $e->getMessage();
}
?>