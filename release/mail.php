<?php

$to = "xtraordinaryDev@outlook.com";


$fname = $_POST["fname"];
$lname = $_POST["lname"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$subject = $_POST["topic"];
$choice   = $_POST['radio_group'] ?? '';
$message = $_POST["message"];
$terms    = isset($_POST['terms']) ? 'Accepted' : 'Not accepted'; // checkbox



$msg = "First Name: ".$fname."<br>";
$msg .= "Last Name: ".$lname."<br>";
$msg .= "Phone Number: ".$phone."<br>";
$msg .= "Email: ".$email."<br>";
$msg .= "Choose a topic: ".$subject."<br>";
$msg .= "Which best describes you?: ".$choice."<br>";
$msg .= "Mesasge: ".$message."<br>";
$msg .= "Terms Accepted:: ".$terms."<br>";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: xtraordinaryDev@outlook.com\r\n";
$headers .= "Reply-To: ".$email."\r\n";

$mailSent = mail($to, $subject, $msg, $headers);

if ($mailSent) {
    echo "Thanks you. Your message has been sent successfully!";
} else {
    echo "Oops. email not send!";
}


?>
