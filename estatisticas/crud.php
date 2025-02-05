<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "crimezone";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Criar um crime (CREATE)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $crimeType = $_POST['crimeType'];
    $description = $_POST['description'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    
    $sql = "INSERT INTO crimes (crimeType, description, latitude, longitude) VALUES ('$crimeType', '$description', '$latitude', '$longitude')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Crime registrado com sucesso"]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}

// Listar todos os crimes (READ)
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT * FROM crimes";
    $result = $conn->query($sql);
    $crimes = [];
    while ($row = $result->fetch_assoc()) {
        $crimes[] = $row;
    }
    echo json_encode($crimes);
}

// Atualizar um crime (UPDATE)
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = $_PUT['id'];
    $crimeType = $_PUT['crimeType'];
    $description = $_PUT['description'];
    
    $sql = "UPDATE crimes SET crimeType='$crimeType', description='$description' WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Crime atualizado com sucesso"]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}

// Deletar um crime (DELETE)
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = $_DELETE['id'];
    
    $sql = "DELETE FROM crimes WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Crime removido com sucesso"]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
}

$conn->close();
?>
