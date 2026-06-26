<?php
// ===== CONTACT FORM HANDLER =====

header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ===== INPUT VALIDATION =====
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Honeypot check (anti-spam)
$website = isset($_POST['website']) ? $_POST['website'] : '';
if (!empty($website)) {
    // Bot detected
    echo json_encode(['success' => false, 'message' => 'Invalid submission']);
    exit;
}

// Validate required fields
$errors = [];

if (empty($name) || strlen($name) < 2 || strlen($name) > 80) {
    $errors[] = 'Name must be between 2 and 80 characters';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 100) {
    $errors[] = 'Please provide a valid email address';
}

if (empty($subject) || strlen($subject) < 4 || strlen($subject) > 150) {
    $errors[] = 'Subject must be between 4 and 150 characters';
}

if (empty($message) || strlen($message) < 20 || strlen($message) > 2000) {
    $errors[] = 'Message must be between 20 and 2000 characters';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// ===== SANITIZATION =====
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// ===== EMAIL CONFIGURATION =====
$to = 'anupom.bhowmik@example.com'; // Replace with your email
$mail_subject = "New Portfolio Contact: " . $subject;

// HTML Email Template
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin: 15px 0; }
        .label { font-weight: bold; color: #6366f1; }
        .value { margin-top: 5px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>$name</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'><a href='mailto:$email'>$email</a></div>
            </div>
            <div class='field'>
                <div class='label'>Subject:</div>
                <div class='value'>$subject</div>
            </div>
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>
                    <p>" . nl2br($message) . "</p>
                </div>
            </div>
            <div class='footer'>
                <p>This is an automated message from your portfolio website.</p>
                <p>IP Address: {$_SERVER['REMOTE_ADDR']}</p>
                <p>Submitted at: " . date('Y-m-d H:i:s') . "</p>
            </div>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// ===== SEND EMAIL =====
try {
    $mail_sent = mail($to, $mail_subject, $email_body, $headers);
    
    if ($mail_sent) {
        // Optional: Send confirmation email to user
        $user_subject = "Confirmation: We received your message";
        $user_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Message Received</h2>
        </div>
        <div class='content'>
            <p>Hi $name,</p>
            <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
            <p><strong>Your Message:</strong></p>
            <p>" . nl2br($message) . "</p>
            <p>Best regards,<br>Anupom Bhowmik</p>
        </div>
    </div>
</body>
</html>
        ";
        
        $user_headers = "MIME-Version: 1.0\r\n";
        $user_headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $user_headers .= "From: noreply@anupom.dev\r\n";
        
        mail($email, $user_subject, $user_body, $user_headers);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Message sent successfully!'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log("Contact form error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message. Please try again later.'
    ]);
}

exit;
?>
