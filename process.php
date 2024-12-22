<?php
// Check if the request is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input data
    $formData = array(
        "Full Name" => htmlspecialchars($_POST['fullName']),
        "Email" => htmlspecialchars($_POST['email']),
        "Phone" => htmlspecialchars($_POST['phone']),
        "Date of Birth" => htmlspecialchars($_POST['dob']),
        "Gender" => htmlspecialchars($_POST['gender'])
    );
    
    // Return the data as JSON
    echo json_encode($formData);
} else {
    // If not POST request, return error
    echo json_encode(array("error" => "Invalid request method"));
}
?>