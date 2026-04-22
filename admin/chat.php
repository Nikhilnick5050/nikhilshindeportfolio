<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting but suppress HTML output
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once 'config.php';

// Custom error handler to return JSON
function jsonErrorHandler($errno, $errstr, $errfile, $errline)
{
    if (!headers_sent()) {
        header('Content-Type: application/json');
        http_response_code(500);
    }
    echo json_encode(['error' => "PHP Error: $errstr in $errfile on line $errline"]);
    exit();
}
set_error_handler("jsonErrorHandler");

// Catch Fatal Errors (like parse errors or memory issues)
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && $error['type'] === E_ERROR) {
        if (!headers_sent()) {
            header('Content-Type: application/json');
            http_response_code(500);
        }
        echo json_encode(['error' => "Fatal Error: {$error['message']} in {$error['file']} on line {$error['line']}"]);
    }
});

// Handle simple connectivity check (GET request)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['status' => 'active', 'message' => 'Chat API is working']);
    exit();
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$userMessage = $data['message'] ?? '';

if (empty($userMessage)) {
    echo json_encode(['error' => 'Message is required']);
    exit();
}

// Fetch context data
$pdo = getDBConnection();
// projects table uses 'technologies', not 'tech_stack'
$projectsStmt = $pdo->query("SELECT title, description, category, technologies FROM projects");
$projects = $projectsStmt->fetchAll(PDO::FETCH_ASSOC);

// testimonials table uses 'testimonial', not 'content'
$testimonialsStmt = $pdo->query("SELECT name, company, testimonial FROM testimonials");
$testimonials = $testimonialsStmt->fetchAll(PDO::FETCH_ASSOC);

// Manually added context from provided RESUME data
$resumeData = [
    'summary' => "Immersive technology developer with experience building AR, VR, and spatial computing solutions. Developed location-based AR tools, VR teleoperation systems, and mixed reality learning modules using Unity, ROS, and WebXR. Founded Visioment Studios, trained government professionals at CDAC. Currently doing MSc in Immersive Technology at University of Bristol.",

    'education' => [
        ['institution' => "University of Bristol", 'degree' => "MSc Immersive Technology (VR and AR)", 'year' => "2024–Present", 'project' => "WebGPU Immersive Web Tool"],
        ['institution' => "Sanjivani College of Engineering", 'degree' => "B.Tech Mechatronics", 'year' => "2021–2024", 'grade' => "CGPA: 8.34", 'project' => "3D Printer AR Digital Twin"]
    ],

    'experience' => [
        [
            'company' => "Oxford Instruments Plasma Technology",
            'role' => "Immersive Technician",
            'location' => "Bristol, UK",
            'date' => "Sep 2025–Present",
            'details' => "Developing Mixed Reality training apps for plasma processing tools. Collaborating with engineers to convert technical workflows into interactive learning modules."
        ],
        [
            'company' => "Kinisi Robotics",
            'role' => "VR Developer",
            'location' => "Bristol, UK",
            'date' => "Mar 2025–Sep 2025",
            'details' => "Built VR teleoperation system connecting Unity with ROS via gRPC for robotic hardware control. Improved precision and latency of VR interaction."
        ],
        [
            'company' => "Visioment Studios",
            'role' => "Lead Consultant / Founder",
            'location' => "India",
            'date' => "Dec 2023–Sep 2024",
            'details' => "Managed XR studio, delivered 20+ client projects (INR 1.5M revenue). Led 5-person team delivering for education, real estate, and retail."
        ],
        [
            'company' => "CDAC India",
            'role' => "XR Instructor",
            'location' => "Pune, India",
            'date' => "Jul 2024–Sep 2024",
            'details' => "Taught 150+ hours of XR dev (Unity, 3D) to 200+ government professionals. Created curriculum for public sector XR applications."
        ],
        [
            'company' => "Wallspace",
            'role' => "Computer Engineering Student (Remote)",
            'location' => "California, USA",
            'date' => "Aug 2023–Aug 2024",
            'details' => "Built AR features in Unity for art showcase platform. Optimized performance for mobile AR across devices."
        ],
        [
            'company' => "1M1B x Meta",
            'role' => "Creator Partner",
            'details' => "Trained students/faculty in AR creation using Meta Spark Studio."
        ],
        [
            'company' => "Fiverr",
            'role' => "Freelance Computer Engineering Student",
            'date' => "Sep 2023–Present",
            'details' => "Delivering AR/VR solutions to international clients."
        ]
    ],

    'certifications' => ["Unity Certified Professional Programmer", "Meta Certified Meta Spark Creator"],

    'publications' => [
        "Digital Twin: An Augmented Reality Based Additive Manufacturing System (IET, 2025)",
        "Augmented Reality Business Card: Revolutionizing Networking (IEEE, 2024)"
    ],

    'achievements' => [
        "Best Paper Award – ICRTC 2023",
        "1st Runner-Up – PI-CET 2025 (IET)",
        "2nd Runner Up – Augg.io Summer Hackathon",
        "Meta Spark AR Campus Ambassador – Trained 5,000+ participants"
    ],

    'skills' => [
        "Unity 3D",
        "C#",
        "AR Foundation",
        "WebXR",
        "ROS Integration",
        "gRPC",
        "Spark AR",
        "Blender",
        "Maya",
        "Git",
        "Cross-platform Deployment",
        "Technical Training",
        "Real-time Interaction Systems"
    ]
];

$context = "Projects:\n" . json_encode($projects) . "\n\nTestimonials:\n" . json_encode($testimonials) . "\n\nDetailed Resume Data:\n" . json_encode($resumeData);
$contactInfo = "Email: manepratik16@outlook.com, Phone: +44 7747156664, LinkedIn: linkedin.com/in/manepratik";
$bio = "Hands-on XR developer combining real-time 3D development, immersive training systems, and practical teaching. Strongest in Unity-based XR, interactive simulations, and training-focused immersive systems.";

$systemPrompt = "You are Nikhil's AI Assistant. Answer the user's question about Nikhil in the third person (e.g., 'Nikhil developed...', 'He is...'). 
Your goal is to simulate a **natural, real-time chat**. 

**CRITICAL INSTRUCTIONS:**
1. **STRICT LENGTH LIMIT**: Max **5-6 sentences** per response. Never write a wall of text.
2. **LIMIT EXAMPLES**: If listing things (projects, companies, skills), **ONLY mention the top 2-3**. Do NOT list everything.
3. **DO NOT DUMP INFO**: Give a little bit of information, then **ask if the user wants to know more**.
4. **STYLE**: Be helpful, concise, and conversational. Use **bold** for key names.

Bio: $bio
If anyone asks regarding any enquiry or any project, ask them to contact Nikhil's email ($contactInfo).
Context:
$context";

// Load environment variables from system env first, then local .env as fallback.
function getEnvValue($key)
{
    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return $value;
    }

    $envPath = __DIR__ . '/../.env';
    if (!file_exists($envPath)) {
        return null;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) {
            continue;
        }
        [$envKey, $envValue] = explode('=', $line, 2);
        if (trim($envKey) === $key) {
            return trim($envValue, " \t\n\r\0\x0B\"'");
        }
    }

    return null;
}

// Groq API Request
$apiKey = getEnvValue('GROQ_API_KEY') ?: getEnvValue('REACT_APP_GROQ_API_KEY');
if (empty($apiKey)) {
    echo json_encode(['error' => 'Missing GROQ_API_KEY (or REACT_APP_GROQ_API_KEY) in environment configuration.']);
    exit();
}

$url = 'https://api.groq.com/openai/v1/chat/completions';

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
];

$postData = [
    'model' => 'llama3-8b-8192',
    'messages' => [
        ['role' => 'system', 'content' => $systemPrompt],
        ['role' => 'user', 'content' => $userMessage]
    ],
    'temperature' => 0.7,
    'max_tokens' => 250 // Reduced to force brevity (approx 5-6 sentences)
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode(['error' => 'Request Error:' . curl_error($ch)]);
} else {
    // Determine strict error handling
    if ($httpCode !== 200) {
        // Pass through the OpenAI error or create one
        $errorResponse = json_decode($response, true);
        $errorMessage = $errorResponse['error']['message'] ?? 'Unknown OpenAI Error (' . $httpCode . ')';
        echo json_encode(['error' => "OpenAI API Error: $errorMessage"]);
    } else {
        echo $response;
    }
}

curl_close($ch);
?>
