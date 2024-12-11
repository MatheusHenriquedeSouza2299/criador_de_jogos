<?php
session_start();

// Conexão com o banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$database = "login_system";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Erro ao conectar com o banco de dados: " . $conn->connect_error);
}

// Verifica o envio do formulário
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST['username'];
    $pass = md5($_POST['password']); // Usando MD5 para hashing simples (não recomendado em produção)

    // Consulta ao banco de dados
    $sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $user, $pass);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $_SESSION['username'] = $user;
        header("Location: home.php");
    } else {
        header("Location: login.html?error=Usuário ou senha incorretos!");
    }
}
?>
