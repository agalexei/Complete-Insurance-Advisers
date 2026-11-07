<?php
// Only accept real form posts; bots that fill the honeypot get a silent "success"
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
if (!empty($_POST['_honey'])) { header('Location: https://ciansw.com.au/thankyou'); exit; }

// Strip line breaks from single-line fields to prevent header injection
$clean   = fn($v) => trim(preg_replace('/[\r\n]+/', ' ', strip_tags($v ?? '')));
$name    = $clean($_POST['name'] ?? '');
$phone   = $clean($_POST['phone'] ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$enquiry = trim(strip_tags($_POST['enquiry'] ?? ''));

if ($name === '' || !$email || $enquiry === '') {
  http_response_code(422);
  exit('Please go back and complete the required fields.');
}

$to      = 'admin@ciansw.com.au';
$subject = 'CIANSW website | Contact enquiry';
$body    = "Name: $name\nEmail: $email\nPhone: " . ($phone ?: 'Not provided') . "\n\nEnquiry:\n$enquiry\n";
$headers = "From: CIANSW Website <no-reply@ciansw.com.au>\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers, '-fno-reply@ciansw.com.au')) {
  header('Location: https://ciansw.com.au/thankyou');
  exit;
}

http_response_code(500);
exit('Sorry, your message could not be sent. Please call 0411 541 698 or email admin@ciansw.com.au.');