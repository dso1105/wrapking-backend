<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer's autoload file
require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    // SMTP server configuration
    $mail->isSMTP();
    $mail->Host = 'smtps.udag.de'; // Replace with your SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'noreply@wrapking.net'; // Your SMTP username
    $mail->Password = 'rubGyf-5dudby-fubzop'; // Your SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Use STARTTLS encryption
    $mail->Port = 587; // SMTP port

    // Collect form data from POST request
    $inputData = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "JSON Decode Error: " . json_last_error_msg();
        exit;
    }

    $mail->isHTML(true);
    $firstName = $inputData['firstName'] ?? '';
    $lastName = $inputData['lastName'] ?? '';
    $email = $inputData['email'] ?? '';
    $subject = $inputData['subject'] ?? '';
    $bodyHTML = $inputData['bodyHTML'] ?? '';

    $logoPath = '../media/logo.png'; // Path to your logo file
    if (file_exists($logoPath)) {
        $mail->AddEmbeddedImage($logoPath, 'logo_cid'); // Embed the logo with a Content-ID (CID)
    } else {
        echo "Logo file not found.";
        exit;
    }

    // Email settings
    $mail->setFrom('noreply@wrapking.net', 'Wrapking'); // Sender's email and name
    $mail->addAddress($email, "$firstName $lastName");

    // Construct HTML email content based on `paste.txt`
    $htmlContent = <<<HTML
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
                .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
                h1 { color: #FF5C00; }
                .color-primary { color: #FF5C00 !important; }
                .lead { font-size: 16px; margin-bottom: 12px; }
                .cus-btn { display: inline-block; padding: 10px 20px; background-color: #FF5C00; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .custom-btn { display: inline-block; padding: 10px 20px; background-color: #FF5C00; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                :root {
                    color-scheme: light;
                    supported-color-schemes: light;
                }
                
                .coupon-container {
                    display: inline-block; 
                    background-color: #F0F0F0;
                    border-radius: 15px; 
                    padding: 10px 20px;
                    text-align: center;
                }
                
                img {
                max-width: 100%;
                height: auto;
                vertical-align: middle;
                }

                ul.list-style,
                ol.list-style {
                padding: 0;
                }

                ul.list-style li::marker,
                ol.list-style li::marker {
                color: #FF5C00;
                }

                .unstyled {
                padding-left: 0;
                list-style: none;
                margin-bottom: 0;
                }

                @media (min-width: 1200px) {
                .container-fluid {
                    padding: 0 5vw;
                    width: 100%;
                }
                }

                @media (min-width: 1200px) {
                .container-fluid-small {
                    padding: 0 1vw;
                    width: 100%;
                }
                }

                @media (max-width: 575px) {
                .container-fluid {
                    --bs-gutter-x: 2rem;
                    --bs-gutter-y: 0;
                    width: 100%;
                    padding-right: calc(var(--bs-gutter-x) * .5);
                }
                }

                .x-hidden {
                overflow-x: auto;
                }

                .page-content {
                margin: 20px 0;
                }


                .page-content-top {
                margin: 0px 0;
                }
                /*-------------------------
                    Typography
                -------------------------*/
                html {
                scroll-behavior: smooth;
                }

                body {
                font-family: "Hind", sans-serif;
                color: #979797;
                background-color: #FCFDFD;
                font-size: 0.938vw;
                font-weight: 400;
                line-height: 140%;
                height: 100%;
                vertical-align: baseline;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
                }
                @media (max-width: 1199px) {
                body {
                    font-size: 1.65vw;
                }
                }
                @media (max-width: 991px) {
                body {
                    font-size: 1.85vw;
                }
                }
                @media (max-width: 767px) {
                body {
                    font-size: 2.3vw;
                }
                }
                @media (max-width: 575px) {
                body {
                    font-size: clamp(12px, 4vw, 18px);
                }
                }
                body::-webkit-scrollbar {
                width: 10px;
                }
                body::-webkit-scrollbar-track {
                background-color: #e4e4e4;
                border-radius: 6px;
                }
                body::-webkit-scrollbar-thumb {
                border-radius: 6px;
                background: #FFA500;
                }

                h1,
                h2,
                h3,
                h4,
                h5,
                h6,
                address,
                p,
                pre,
                blockquote,
                table,
                hr {
                margin: 0;
                }

                h1 a,
                h2 a,
                h3 a,
                h4 a,
                h5 a,
                h6 a {
                color: inherit;
                }

                h1,
                .h1,
                h2,
                .h2,
                h3,
                .h3,
                h4,
                .h4,
                h5,
                .h5,
                h6,
                .h6 {
                color: #282525;
                margin-bottom: 0;
                }

                h1,
                .h1 {
                font-family: "Oswald", sans-serif;
                font-size: 4.74vw;
                font-weight: 600;
                line-height: 120%;
                letter-spacing: -0.095vw;
                }
                @media (max-width: 1199px) {
                h1,
                .h1 {
                    font-size: 6.65vw;
                }
                }
                @media (max-width: 991px) {
                h1,
                .h1 {
                    font-size: 8.65vw;
                }
                }
                @media (max-width: 767px) {
                h1,
                .h1 {
                    font-size: 9.65vw;
                }
                }
                @media (max-width: 575px) {
                h1,
                .h1 {
                    font-size: clamp(32px, 15.5vw, 64px);
                }
                }

                h2,
                .h2 {
                font-family: "Oswald", sans-serif;
                font-size: 3.594vw;
                font-weight: 600;
                line-height: 120%;
                letter-spacing: -0.036vw;
                }
                @media (max-width: 1199px) {
                h2,
                .h2 {
                    font-size: 5.3vw;
                }
                }
                @media (max-width: 991px) {
                h2,
                .h2 {
                    font-size: 6.65vw;
                }
                }
                @media (max-width: 767px) {
                h2,
                .h2 {
                    font-size: 8vw;
                }
                }
                @media (max-width: 575px) {
                h2,
                .h2 {
                    font-size: 10.522vw;
                }
                }

                h3,
                .h3 {
                font-family: "Oswald", sans-serif;
                font-size: 2.76vw;
                font-weight: 600;
                line-height: 120%;
                letter-spacing: -0.028vw;
                }
                @media (max-width: 1199px) {
                h3,
                .h3 {
                    font-size: 4.2vw;
                }
                }
                @media (max-width: 991px) {
                h3,
                .h3 {
                    font-size: 5.3vw;
                }
                }
                @media (max-width: 767px) {
                h3,
                .h3 {
                    font-size: 6.6vw;
                }
                }
                @media (max-width: 575px) {
                h3,
                .h3 {
                    font-size: 9vw;
                }
                }

                h4,
                .h4 {
                font-family: "Hind", sans-serif;
                font-size: 2.083vw;
                font-weight: 600;
                line-height: 120%;
                letter-spacing: -0.042vw;
                }
                @media (max-width: 1199px) {
                h4,
                .h4 {
                    font-size: 3.1vw;
                }
                }
                @media (max-width: 991px) {
                h4,
                .h4 {
                    font-size: 4.2vw;
                }
                }
                @media (max-width: 767px) {
                h4,
                .h4 {
                    font-size: 5.3vw;
                }
                }
                @media (max-width: 575px) {
                h4,
                .h4 {
                    font-size: 7.2vw;
                }
                }

                h5,
                .h5 {
                font-family: "Hind", sans-serif;
                font-size: 1.615vw;
                font-weight: 600;
                line-height: 120%;
                letter-spacing: -0.032vw;
                }
                @media (max-width: 1199px) {
                h5,
                .h5 {
                    font-size: 2.5vw;
                }
                }
                @media (max-width: 991px) {
                h5,
                .h5 {
                    font-size: 3.1vw;
                }
                }
                @media (max-width: 767px) {
                h5,
                .h5 {
                    font-size: 4.2vw;
                }
                }
                @media (max-width: 575px) {
                h5,
                .h5 {
                    font-size: 6.348vw;
                }
                }

                h6,
                .h6 {
                font-family: "Hind", sans-serif;
                font-size: 1.25vw;
                font-weight: 600;
                line-height: 120%;
                letter-spacing: -0.025vw;
                }
                h6.light,
                .h6.light {
                font-weight: 400;
                }
                @media (max-width: 1199px) {
                h6,
                .h6 {
                    font-size: 2vw;
                }
                }
                @media (max-width: 991px) {
                h6,
                .h6 {
                    font-size: 2.5vw;
                }
                }
                @media (max-width: 767px) {
                h6,
                .h6 {
                    font-size: 3.1vw;
                }
                }
                @media (max-width: 575px) {
                h6,
                .h6 {
                    font-size: 5.2vw;
                }
                }

                .lead {
                font-size: 1.25vw;
                line-height: 150%;
                font-weight: 400;
                }
                @media (max-width: 1199px) {
                .lead {
                    font-size: 1.8vw;
                }
                }
                @media (max-width: 991px) {
                .lead {
                    font-size: 2.2vw;
                }
                }
                @media (max-width: 767px) {
                .lead {
                    font-size: 2.8vw;
                }
                }
                @media (max-width: 575px) {
                .lead {
                    font-size: 4.8vw;
                }
                }

                a {
                display: inline-block;
                text-decoration: none;
                color: unset;
                transition: all 0.5s ease-in;
                }
                a:hover {
                color: #FF5C00;
                transition: all 0.5s ease-in;
                }

                span {
                display: inline-block;
                }

                b,
                strong {
                font-family: "Hind", sans-serif;
                }

                /*-------------------------
                Helpers
                -------------------------*/
                .color-primary {
                color: #FF5C00 !important;
                }

                .bg-primary {
                background-color: #FF5C00 !important;
                }

                .color-white {
                color: #FCFDFD !important;
                }

                .bg-white {
                background-color: #FCFDFD !important;
                }

                .color-black {
                color: #282525 !important;
                }

                .bg-black {
                background-color: #282525 !important;
                }

                .lightest-gray {
                color: #F5F7F9 !important;
                }

                .bg-lightest-gray {
                background-color: #F5F7F9 !important;
                }

                .light-gray {
                color: #F0F0F0 !important;
                }

                .bg-light-gray {
                background-color: #F0F0F0 !important;
                }

                .medium-gray {
                color: #BDBCBC !important;
                }

                .bg-medium-gray {
                background-color: #BDBCBC !important;
                }

                .dark-gray {
                color: #979797 !important;
                }

                .bg-dark-gray {
                background-color: #979797 !important;
                }

                .color-primary-2 {
                color: #FFA500 !important;
                }

                .color-red {
                color: #DF6254 !important;
                }

                .color-green {
                color: #49B379 !important;
                }

                .b-unstyle {
                border: 0;
                background: transparent;
                }

                .fw-500 {
                font-weight: 500;
                }

                .fs-160 {
                font-family: "Oswald", sans-serif;
                font-size: 8.333vw;
                font-weight: 600;
                line-height: 120%;
                letter-spacing: -0.095vw;
                }
                @media (max-width: 1199px) {
                .fs-160 {
                    font-size: 12vw;
                }
                }
                @media (max-width: 991px) {
                .fs-160 {
                    font-size: 16vw;
                }
                }
                @media (max-width: 767px) {
                .fs-160 {
                    font-size: 18vw;
                }
                }
                @media (max-width: 575px) {
                .fs-160 {
                    font-size: 25vw;
                }
                }

                @media (max-width: 767px) {
                .hide-on-mobile {
                    display: none;
                }
                }
                .quantity {
                background: #F0F0F0;
                display: flex;
                gap: 8px;
                width: fit-content;
                border-radius: 5px;
                padding: 0.833vw;
                height: 2.917vw;
                }
                @media (max-width: 1199px) {
                .quantity {
                    padding: 0.53vw 0.8vw;
                    height: 3.17vw;
                }
                }
                @media (max-width: 991px) {
                .quantity {
                    padding: 0.76vw 0.9vw;
                    height: 3.7vw;
                }
                }
                @media (max-width: 767px) {
                .quantity {
                    padding: 1vw 1.5vw;
                    height: 6vw;
                    gap: 4px;
                }
                }
                @media (max-width: 575px) {
                .quantity {
                    padding: 1.5vw 2vw;
                    height: 9vw;
                    gap: 4px;
                }
                }
                .quantity input {
                border: none !important;
                font-family: "Oswald", sans-serif;
                font-size: 1.25vw;
                font-weight: 400;
                line-height: 125%;
                width: 1.563vw;
                text-align: center;
                color: #282525 !important;
                padding: 0 !important;
                background: transparent;
                }
                @media (max-width: 1199px) {
                .quantity input {
                    width: 1.5vw;
                    font-size: 1.65vw;
                }
                }
                @media (max-width: 991px) {
                .quantity input {
                    width: 2.5vw;
                    font-size: 1.95vw;
                }
                }
                @media (max-width: 767px) {
                .quantity input {
                    font-size: 3.5vw;
                    width: 6vw;
                }
                }
                @media (max-width: 575px) {
                .quantity input {
                    font-size: 5vw;
                    width: 8vw;
                }
                }
                .quantity input:focus {
                border: none;
                outline: none;
                color: #282525;
                }
                .quantity input:hover {
                border: none;
                color: #282525;
                }
                .quantity .decrement,
                .quantity .increment {
                display: grid;
                align-content: center;
                cursor: pointer;
                }
                .quantity .decrement i,
                .quantity .increment i {
                font-size: 0.938vw;
                color: #282525;
                }
                @media (max-width: 1199px) {
                .quantity .decrement i,
                .quantity .increment i {
                    font-size: 1.138vw;
                }
                }
                @media (max-width: 991px) {
                .quantity .decrement i,
                .quantity .increment i {
                    font-size: 1.3vw;
                }
                }
                @media (max-width: 767px) {
                .quantity .decrement i,
                .quantity .increment i {
                    font-size: 2.5vw;
                }
                }
                @media (max-width: 575px) {
                .quantity .decrement i,
                .quantity .increment i {
                    font-size: 3.5vw;
                }
                }

                .cart-btn {
                height: 2.917vw;
                width: 2.917vw;
                display: grid;
                align-content: center;
                justify-content: center;
                border-radius: 5px;
                border: 1px solid #FF5C00;
                background: rgba(255, 92, 0, 0.2);
                transition: all 0.5s ease-in;
                }
                @media (max-width: 1199px) {
                .cart-btn {
                    width: 3.7vw;
                    height: 3.7vw;
                }
                }
                @media (max-width: 991px) {
                .cart-btn {
                    width: 4vw;
                    height: 4vw;
                }
                }
                @media (max-width: 767px) {
                .cart-btn {
                    width: 7.5vw;
                    height: 7.5vw;
                    border-radius: 8px;
                }
                }
                @media (max-width: 575px) {
                .cart-btn {
                    height: 14vw;
                    width: 14vw;
                    border-radius: 8px;
                }
                }
                .cart-btn img {
                width: 1.042vw;
                height: 1.042vw;
                transition: all 0.5s ease-in;
                }
                @media (max-width: 1199px) {
                .cart-btn img {
                    width: 1.5vw;
                    height: 1.5vw;
                }
                }
                @media (max-width: 991px) {
                .cart-btn img {
                    width: 1.7vw;
                    height: 1.7vw;
                }
                }
                @media (max-width: 767px) {
                .cart-btn img {
                    width: 1.9vw;
                    height: 1.9vw;
                }
                }
                @media (max-width: 575px) {
                .cart-btn img {
                    width: 4vw;
                    height: auto;
                }
                }
                .cart-btn:hover img {
                scale: 0.9;
                }

                /*----------------------------------------*/
                /*  SPACE CSS START
                /*----------------------------------------*/
                .my-80 {
                margin: 80px 0;
                }
                @media (max-width: 1599px) {
                .my-80 {
                    margin: 70px 0;
                }
                }
                @media (max-width: 1399px) {
                .my-80 {
                    margin: 60px 0;
                }
                }
                @media (max-width: 1199px) {
                .my-80 {
                    margin: 50px 0;
                }
                }
                @media (max-width: 991px) {
                .my-80 {
                    margin: 40px 0;
                }
                }
                @media (max-width: 767px) {
                .my-80 {
                    margin: 35px 0;
                }
                }

                .mt-80 {
                margin-top: 80px;
                }
                @media (max-width: 1599px) {
                .mt-80 {
                    margin-top: 70px;
                }
                }
                @media (max-width: 1399px) {
                .mt-80 {
                    margin-top: 60px;
                }
                }
                @media (max-width: 1199px) {
                .mt-80 {
                    margin-top: 50px;
                }
                }
                @media (max-width: 991px) {
                .mt-80 {
                    margin-top: 40px;
                }
                }
                @media (max-width: 767px) {
                .mt-80 {
                    margin-top: 35px;
                }
                }

                .mb-80 {
                margin-bottom: 80px;
                }
                @media (max-width: 1599px) {
                .mb-80 {
                    margin-bottom: 70px;
                }
                }
                @media (max-width: 1399px) {
                .mb-80 {
                    margin-bottom: 60px;
                }
                }
                @media (max-width: 1199px) {
                .mb-80 {
                    margin-bottom: 50px;
                }
                }
                @media (max-width: 991px) {
                .mb-80 {
                    margin-bottom: 40px;
                }
                }
                @media (max-width: 767px) {
                .mb-80 {
                    margin-bottom: 35px;
                }
                }

                .mt-64 {
                margin-top: 64px;
                }
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                .mt-64 {
                    margin-top: 48px;
                }
                }
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                .mt-64 {
                    margin-top: 42px;
                }
                }
                @media (max-width: 767px) {
                .mt-64 {
                    margin-top: 32px;
                }
                }

                .mb-64 {
                margin-bottom: 64px;
                }
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                .mb-64 {
                    margin-bottom: 48px;
                }
                }
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                .mb-64 {
                    margin-bottom: 42px;
                }
                }
                @media (max-width: 767px) {
                .mb-64 {
                    margin-bottom: 32px;
                }
                }

                .mb-50 {
                margin-bottom: 50px;
                }
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                .mb-50 {
                    margin-bottom: 44px;
                }
                }
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                .mb-50 {
                    margin-bottom: 38px;
                }
                }
                @media (max-width: 767px) {
                .mb-50 {
                    margin-bottom: 32px;
                }
                }

                .m-48 {
                margin: 48px 0;
                }
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                .m-48 {
                    margin: 42px 0;
                }
                }
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                .m-48 {
                    margin: 32px 0;
                }
                }
                @media (max-width: 767px) {
                .m-48 {
                    margin: 24px 0;
                }
                }

                .mt-48 {
                margin-top: 48px;
                }
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                .mt-48 {
                    margin-top: 42px;
                }
                }
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                .mt-48 {
                    margin-top: 32px;
                }
                }
                @media (max-width: 767px) {
                .mt-48 {
                    margin-top: 24px;
                }
                }

                .mb-48 {
                margin-bottom: 48px;
                }
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                .mb-48 {
                    margin-bottom: 42px;
                }
                }
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                .mb-48 {
                    margin-bottom: 36px;
                }
                }
                @media (max-width: 767px) {
                .mb-48 {
                    margin-bottom: 32px;
                }
                }

                .m-40 {
                margin: 40px 0;
                }
                @media (max-width: 1199px) {
                .m-40 {
                    margin: 32px 0;
                }
                }
                @media (max-width: 991px) {
                .m-40 {
                    margin: 28px 0;
                }
                }
                @media (max-width: 767px) {
                .m-40 {
                    margin: 22px 0;
                }
                }

                .mt-40 {
                margin-top: 40px;
                }
                @media (max-width: 1199px) {
                .mt-40 {
                    margin-top: 32px;
                }
                }
                @media (max-width: 991px) {
                .mt-40 {
                    margin-top: 28px;
                }
                }
                @media (max-width: 767px) {
                .mt-40 {
                    margin-top: 22px;
                }
                }

                .mb-40 {
                margin-bottom: 40px;
                }
                @media (max-width: 1199px) {
                .mb-40 {
                    margin-bottom: 32px;
                }
                }
                @media (max-width: 991px) {
                .mb-40 {
                    margin-bottom: 28px;
                }
                }
                @media (max-width: 767px) {
                .mb-40 {
                    margin-bottom: 22px;
                }
                }

                .mb-36 {
                margin-bottom: 36px;
                }
                @media (max-width: 1199px) {
                .mb-36 {
                    margin-bottom: 32px;
                }
                }
                @media (max-width: 991px) {
                .mb-36 {
                    margin-bottom: 28px;
                }
                }
                @media (max-width: 767px) {
                .mb-36 {
                    margin-bottom: 22px;
                }
                }

                .mt-32 {
                margin-top: 32px !important;
                }
                @media (max-width: 1199px) {
                .mt-32 {
                    margin-top: 28px;
                }
                }
                @media (max-width: 991px) {
                .mt-32 {
                    margin-top: 24px;
                }
                }
                @media (max-width: 767px) {
                .mt-32 {
                    margin-top: 20px;
                }
                }

                .mb-32 {
                margin-bottom: 32px;
                }
                @media (max-width: 1199px) {
                .mb-32 {
                    margin-bottom: 28px;
                }
                }
                @media (max-width: 991px) {
                .mb-32 {
                    margin-bottom: 24px;
                }
                }
                @media (max-width: 767px) {
                .mb-32 {
                    margin-bottom: 20px;
                }
                }

                .mb-30 {
                margin-bottom: 30px;
                }
                @media (max-width: 1199px) {
                .mb-30 {
                    margin-bottom: 28px;
                }
                }
                @media (max-width: 991px) {
                .mb-30 {
                    margin-bottom: 24px;
                }
                }
                @media (max-width: 767px) {
                .mb-30 {
                    margin-bottom: 20px;
                }
                }

                .mb-24 {
                margin-bottom: 24px;
                }
                @media (max-width: 1199px) {
                .mb-24 {
                    margin-bottom: 22px;
                }
                }
                @media (max-width: 991px) {
                .mb-24 {
                    margin-bottom: 22px;
                }
                }
                @media (max-width: 767px) {
                .mb-24 {
                    margin-bottom: 20px;
                }
                }

                .mt-24 {
                margin-top: 24px;
                }
                @media (max-width: 1199px) {
                .mt-24 {
                    margin-top: 22px;
                }
                }
                @media (max-width: 991px) {
                .mt-24 {
                    margin-top: 22px;
                }
                }
                @media (max-width: 767px) {
                .mt-24 {
                    margin-top: 20px;
                }
                }

                .mb-20 {
                margin-bottom: 20px;
                }
                @media (max-width: 1199px) {
                .mb-20 {
                    margin-bottom: 18px;
                }
                }
                @media (max-width: 991px) {
                .mb-20 {
                    margin-bottom: 16px;
                }
                }
                @media (max-width: 767px) {
                .mb-20 {
                    margin-bottom: 14px;
                }
                }

                .mb-16 {
                margin-bottom: 16px;
                }
                @media (max-width: 1199px) {
                .mb-16 {
                    margin-bottom: 15px;
                }
                }
                @media (max-width: 991px) {
                .mb-16 {
                    margin-bottom: 14px;
                }
                }
                @media (max-width: 767px) {
                .mb-16 {
                    margin-bottom: 12px;
                }
                }

                .mb-12 {
                margin-bottom: 12px;
                }
                @media (max-width: 1199px) {
                .mb-12 {
                    margin-bottom: 11px;
                }
                }
                @media (max-width: 991px) {
                .mb-12 {
                    margin-bottom: 10px;
                }
                }
                @media (max-width: 767px) {
                .mb-12 {
                    margin-bottom: 8px;
                }
                }

                .mb-8 {
                margin-bottom: 8px;
                }
                @media (max-width: 767px) {
                .mb-8 {
                    margin-bottom: 4px;
                }
                }

                .mt-8 {
                margin-top: 8px;
                }

                .mb-4p {
                margin-bottom: 4px;
                }

                .py-160 {
                padding: 160px 0;
                }
                @media (max-width: 1599px) {
                .py-160 {
                    padding: 140px 0;
                }
                }
                @media (max-width: 1399px) {
                .py-160 {
                    padding: 120px 0;
                }
                }
                @media (max-width: 1199px) {
                .py-160 {
                    padding: 100px 0;
                }
                }
                @media (max-width: 991px) {
                .py-160 {
                    padding: 80px 0;
                }
                }
                @media (max-width: 767px) {
                .py-160 {
                    padding: 70px 0;
                }
                }

                .py-80 {
                padding: 80px 0;
                }
                @media (max-width: 1599px) {
                .py-80 {
                    padding: 70px 0;
                }
                }
                @media (max-width: 1399px) {
                .py-80 {
                    padding: 60px 0;
                }
                }
                @media (max-width: 1199px) {
                .py-80 {
                    padding: 50px 0;
                }
                }
                @media (max-width: 991px) {
                .py-80 {
                    padding: 40px 0;
                }
                }
                @media (max-width: 767px) {
                .py-80 {
                    padding: 35px 0;
                }
                }

                .pt-80 {
                padding-top: 80px;
                }
                @media (max-width: 1599px) {
                .pt-80 {
                    padding-top: 70px;
                }
                }
                @media (max-width: 1399px) {
                .pt-80 {
                    padding-top: 60px;
                }
                }
                @media (max-width: 1199px) {
                .pt-80 {
                    padding-top: 50px;
                }
                }
                @media (max-width: 991px) {
                .pt-80 {
                    padding-top: 40px;
                }
                }
                @media (max-width: 767px) {
                .pt-80 {
                    padding-top: 35px;
                }
                }

                .pb-80 {
                padding-bottom: 80px;
                }
                @media (max-width: 1599px) {
                .pb-80 {
                    padding-bottom: 70px;
                }
                }
                @media (max-width: 1399px) {
                .pb-80 {
                    padding-bottom: 60px;
                }
                }
                @media (max-width: 1199px) {
                .pb-80 {
                    padding-bottom: 50px;
                }
                }
                @media (max-width: 991px) {
                .pb-80 {
                    padding-bottom: 40px;
                }
                }
                @media (max-width: 767px) {
                .pb-80 {
                    padding-bottom: 35px;
                }
                }

                .py-64 {
                padding: 64px 0;
                }
                @media (max-width: 1599px) {
                .py-64 {
                    padding: 58px 0;
                }
                }
                @media (max-width: 1399px) {
                .py-64 {
                    padding: 52px 0;
                }
                }
                @media (max-width: 1199px) {
                .py-64 {
                    padding: 46px 0;
                }
                }
                @media (max-width: 991px) {
                .py-64 {
                    padding: 40px 0;
                }
                }
                @media (max-width: 767px) {
                .py-64 {
                    padding: 30px 0;
                }
                }

                .pt-64 {
                padding-top: 64px;
                }
                @media (max-width: 1599px) {
                .pt-64 {
                    padding-top: 58px;
                }
                }
                @media (max-width: 1399px) {
                .pt-64 {
                    padding-top: 52px;
                }
                }
                @media (max-width: 1199px) {
                .pt-64 {
                    padding-top: 46px;
                }
                }
                @media (max-width: 991px) {
                .pt-64 {
                    padding-top: 40px;
                }
                }
                @media (max-width: 767px) {
                .pt-64 {
                    padding-top: 30px;
                }
                }

                .pb-64 {
                padding-bottom: 64px;
                }
                @media (max-width: 1599px) {
                .pb-64 {
                    padding-bottom: 58px;
                }
                }
                @media (max-width: 1399px) {
                .pb-64 {
                    padding-bottom: 52px;
                }
                }
                @media (max-width: 1199px) {
                .pb-64 {
                    padding-bottom: 46px;
                }
                }
                @media (max-width: 991px) {
                .pb-64 {
                    padding-bottom: 40px;
                }
                }
                @media (max-width: 767px) {
                .pb-64 {
                    padding-bottom: 30px;
                }
                }

                .py-48 {
                padding: 48px 0;
                }
                @media (max-width: 1599px) {
                .py-48 {
                    padding: 45px 0;
                }
                }
                @media (max-width: 1399px) {
                .py-48 {
                    padding: 42px 0;
                }
                }
                @media (max-width: 1199px) {
                .py-48 {
                    padding: 38px 0;
                }
                }
                @media (max-width: 991px) {
                .py-48 {
                    padding: 32px 0;
                }
                }
                @media (max-width: 767px) {
                .py-48 {
                    padding: 26px 0;
                }
                }

                .pt-48 {
                padding-top: 48px;
                }
                @media (max-width: 1599px) {
                .pt-48 {
                    padding-top: 45px;
                }
                }
                @media (max-width: 1399px) {
                .pt-48 {
                    padding-top: 42px;
                }
                }
                @media (max-width: 1199px) {
                .pt-48 {
                    padding-top: 38px;
                }
                }
                @media (max-width: 991px) {
                .pt-48 {
                    padding-top: 32px;
                }
                }
                @media (max-width: 767px) {
                .pt-48 {
                    padding-top: 26px;
                }
                }

                .pb-48 {
                padding-bottom: 48px;
                }
                @media (max-width: 1599px) {
                .pb-48 {
                    padding-bottom: 45px;
                }
                }
                @media (max-width: 1399px) {
                .pb-48 {
                    padding-bottom: 42px;
                }
                }
                @media (max-width: 1199px) {
                .pb-48 {
                    padding-bottom: 38px;
                }
                }
                @media (max-width: 991px) {
                .pb-48 {
                    padding-bottom: 32px;
                }
                }
                @media (max-width: 767px) {
                .pb-48 {
                    padding-bottom: 26px;
                }
                }

                .py-40 {
                padding: 40px 0;
                }
                @media (max-width: 1599px) {
                .py-40 {
                    padding: 36px 0;
                }
                }
                @media (max-width: 1399px) {
                .py-40 {
                    padding: 32px 0;
                }
                }
                @media (max-width: 1199px) {
                .py-40 {
                    padding: 28px 0;
                }
                }
                @media (max-width: 991px) {
                .py-40 {
                    padding: 24px 0;
                }
                }
                @media (max-width: 767px) {
                .py-40 {
                    padding: 20px 0;
                }
                }

                .pt-40 {
                padding-top: 40px;
                }
                @media (max-width: 1599px) {
                .pt-40 {
                    padding-top: 36px;
                }
                }
                @media (max-width: 1399px) {
                .pt-40 {
                    padding-top: 32px;
                }
                }
                @media (max-width: 1199px) {
                .pt-40 {
                    padding-top: 28px;
                }
                }
                @media (max-width: 991px) {
                .pt-40 {
                    padding-top: 24px;
                }
                }
                @media (max-width: 767px) {
                .pt-40 {
                    padding-top: 20px;
                }
                }

                .pb-40 {
                padding-bottom: 40px;
                }
                @media (max-width: 1599px) {
                .pb-40 {
                    padding-bottom: 36px;
                }
                }
                @media (max-width: 1399px) {
                .pb-40 {
                    padding-bottom: 32px;
                }
                }
                @media (max-width: 1199px) {
                .pb-40 {
                    padding-bottom: 28px;
                }
                }
                @media (max-width: 991px) {
                .pb-40 {
                    padding-bottom: 24px;
                }
                }
                @media (max-width: 767px) {
                .pb-40 {
                    padding-bottom: 20px;
                }
                }

                .py-32 {
                padding: 32px 0;
                }
                @media (max-width: 1599px) {
                .py-32 {
                    padding: 30px 0;
                }
                }
                @media (max-width: 1399px) {
                .py-32 {
                    padding: 28px 0;
                }
                }
                @media (max-width: 1199px) {
                .py-32 {
                    padding: 26px 0;
                }
                }
                @media (max-width: 991px) {
                .py-32 {
                    padding: 24px 0;
                }
                }
                @media (max-width: 767px) {
                .py-32 {
                    padding: 22px 0;
                }
                }

                .pt-32 {
                padding-top: 32px;
                }
                @media (max-width: 1599px) {
                .pt-32 {
                    padding-top: 30px;
                }
                }
                @media (max-width: 1399px) {
                .pt-32 {
                    padding-top: 28px;
                }
                }
                @media (max-width: 1199px) {
                .pt-32 {
                    padding-top: 26px;
                }
                }
                @media (max-width: 991px) {
                .pt-32 {
                    padding-top: 24px;
                }
                }
                @media (max-width: 767px) {
                .pt-32 {
                    padding-top: 22px;
                }
                }

                .pb-32 {
                padding-bottom: 40px;
                }
                @media (max-width: 1599px) {
                .pb-32 {
                    padding-bottom: 30px;
                }
                }
                @media (max-width: 1399px) {
                .pb-32 {
                    padding-bottom: 28px;
                }
                }
                @media (max-width: 1199px) {
                .pb-32 {
                    padding-bottom: 26px;
                }
                }
                @media (max-width: 991px) {
                .pb-32 {
                    padding-bottom: 24px;
                }
                }
                @media (max-width: 767px) {
                .pb-32 {
                    padding-bottom: 22px;
                }
                }

                .p-16 {
                padding: 16px;
                }
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                .p-16 {
                    padding: 15px;
                }
                }
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                .p-16 {
                    padding: 13px;
                }
                }
                @media (max-width: 767px) {
                .p-16 {
                    padding: 10px;
                }
                }
                @media (max-width: 490px) {
                .p-16 {
                    padding: 10px;
                }
                }

                /*-------------------------
                Elements
                -------------------------*/
                .cus-btn {
                border-radius: 10px;
                box-shadow: 0px 15px 30px 0px rgba(40, 37, 37, 0.5);
                padding: 0.417vw 1.25vw 0.417vw 0.417vw;
                transition: all 0.5s ease-in;
                font-size: 0.938vw;
                font-weight: 500;
                line-height: 120%;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 12px;
                border: none;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                transition: all 0.5s ease-in;
                width: fit-content;
                }
                @media (max-width: 991px) {
                .cus-btn {
                    gap: 8px;
                    padding: 0.8vw 1.6vw 0.8vw 0.8vw;
                    font-size: 1.8vw;
                }
                }
                @media (max-width: 575px) {
                .cus-btn {
                    gap: 8px;
                    padding: 2vw 4vw 2vw 2vw;
                    font-size: 4vw;
                }
                }
                .cus-btn .icon-wrapper {
                flex-shrink: 0;
                width: 2.083vw;
                height: 2.083vw;
                position: relative;
                border-radius: 50%;
                display: grid;
                place-items: center;
                overflow: hidden;
                }
                @media (max-width: 991px) {
                .cus-btn .icon-wrapper {
                    width: 3.83vw;
                    height: 3.83vw;
                }
                }
                @media (max-width: 575px) {
                .cus-btn .icon-wrapper {
                    width: 6.083vw;
                    height: 6.083vw;
                }
                }
                .cus-btn .icon-wrapper .icon-svg {
                width: 1.042vw;
                height: 1.042vw;
                }
                @media (max-width: 991px) {
                .cus-btn .icon-wrapper .icon-svg {
                    width: 1.5vw;
                    height: 1.5vw;
                }
                }
                @media (max-width: 575px) {
                .cus-btn .icon-wrapper .icon-svg {
                    width: 3vw;
                    height: 3vw;
                }
                }
                .cus-btn .icon-wrapper .icon-svg-copy {
                position: absolute;
                transform: translate(-150%, 150%);
                }
                .cus-btn:hover .icon-wrapper .icon-svg :first-child {
                transition: transform 0.3s ease-in-out;
                transform: translate(150%, -150%);
                }
                .cus-btn:hover .icon-wrapper .icon-svg-copy {
                transition: transform 0.3s ease-in-out 0.1s;
                transform: translate(0);
                }
                .cus-btn:hover .icon-wrapper .icon-svg-copy :first-child {
                transform: translate(0);
                }
                .cus-btn.primary {
                box-shadow: 0px 5px 20px 0px rgba(255, 92, 0, 0.5);
                background: linear-gradient(99deg, #FF8946 -4.71%, #FF5C00 93.14%);
                color: #FCFDFD;
                transition: all 0.5s ease-in;
                }
                .cus-btn.primary .icon-wrapper {
                color: #FF5C00;
                background: #FCFDFD;
                }
                .cus-btn.primary .icon-wrapper svg {
                fill: #FF5C00;
                }
                .cus-btn.primary .icon-wrapper svg path {
                stroke: #FF5C00;
                }
                .cus-btn.primary .icon-wrapper svg.icon-svg-copy path {
                stroke: #FF5C00;
                }
                .cus-btn.primary-banner {
                padding: 0.833vw 1.667vw;
                color: #FCFDFD;
                background: linear-gradient(99deg, #FF8946 -4.71%, #FF5C00 93.14%);
                box-shadow: 0px 15px 30px 0px rgba(255, 92, 0, 0.5);
                }
                @media (max-width: 1199px) {
                .cus-btn.primary-banner {
                    padding: 1.3vw 2.6vw;
                }
                }
                @media (max-width: 575px) {
                .cus-btn.primary-banner {
                    padding: 2vw 4vw;
                }
                }
                .cus-btn.dark {
                background-color: #282525;
                color: #FCFDFD;
                transition: all 0.5s ease-in;
                }
                .cus-btn.dark .icon-wrapper {
                background: #FCFDFD;
                color: #282525;
                }
                .cus-btn.dark .icon-wrapper svg {
                fill: #282525;
                }
                .cus-btn.dark .icon-wrapper svg path {
                stroke: #282525;
                }
                .cus-btn.dark .icon-wrapper svg.icon-svg-copy path {
                stroke: #FF5C00;
                }
                .cus-btn.dark:hover {
                background: #FF5C00;
                box-shadow: 0px 15px 30px 0px rgba(255, 92, 0, 0.5);
                transition: all 0.5s ease-in;
                }
                .cus-btn.light {
                display: inline-flex;
                background-color: #FCFDFD;
                color: #282525;
                transition: all 0.5s ease-in;
                box-shadow: 0px 10px 20px 0px rgba(40, 37, 37, 0.25);
                }
                .cus-btn.light .icon-wrapper {
                background: #282525;
                color: #FCFDFD;
                }
                .cus-btn.light .icon-wrapper svg {
                fill: #FCFDFD;
                }
                .cus-btn.light .icon-wrapper svg path {
                stroke: #FCFDFD;
                }
                .cus-btn.light:hover {
                background: #FCFDFD;
                box-shadow: 0px 15px 30px 0px rgba(255, 92, 0, 0.5);
                transition: all 0.5s ease-in;
                }
                .cus-btn.outline {
                background: transparent;
                color: #FF5C00;
                border: 1px solid #FF5C00;
                box-shadow: none;
                transition: all 0.5s ease-in;
                }
                .cus-btn.outline .icon-wrapper {
                background: #FF5C00;
                color: #FCFDFD;
                }
                .cus-btn.outline:hover {
                background: #FF5C00;
                transition: all 0.5s ease-in;
                color: #FCFDFD;
                }
                .cus-btn.outline:hover .icon-wrapper {
                background: #FCFDFD;
                color: #FCFDFD;
                }
                .cus-btn.outline:hover .icon-wrapper svg {
                fill: #FF5C00;
                }
                .cus-btn.outline:hover .icon-wrapper svg path {
                stroke: #FF5C00;
                }
                .cus-btn.outline:hover .icon-wrapper svg.icon-svg-copy path {
                stroke: #FF5C00;
                }

                .slider-arrow {
                display: flex;
                align-items: center;
                gap: 1.25vw;
                }
                .slider-arrow .arrow {
                width: 3vw;
                height: 3vw;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #F5F7F9;
                border: 1px solid #282525;
                border-radius: 0.58125vw;
                transition: all 0.5s ease-in;
                padding: 0;
                }
                .slider-arrow .arrow svg {
                transition: all 0.5s ease-in;
                width: 1.71875vw;
                height: 1.71875vw;
                }
                @media (max-width: 991px) {
                .slider-arrow .arrow svg {
                    width: 2.4vw;
                    height: 2.4vw;
                }
                }
                .slider-arrow .arrow svg path {
                transition: all 0.5s ease-in;
                }
                .slider-arrow .arrow.slick-disabled svg {
                opacity: 0.3;
                }
                .slider-arrow .arrow:hover:not(.slick-disabled) {
                background: #FF5C00;
                border-color: #FF5C00;
                box-shadow: 0px 0px 20px 1px #FF5C00;
                }
                .slider-arrow .arrow:hover:not(.slick-disabled) svg path {
                stroke: #FCFDFD;
                }

                /*-------------------------
                Form Styling
                -------------------------*/
                .form-group {
                position: relative;
                width: 100%;
                }
                .form-group label {
                color: #282525;
                font-weight: 500;
                display: block;
                text-align: left;
                }

                input[type=date],
                input[type=text],
                input[type=email],
                input[type=file],
                input[type=number],
                input[type=password],
                input[type=search],
                input[type=submit],
                input[type=tel],
                textarea,
                .cus-form-control {
                width: 100%;
                background: transparent;
                padding: 0.833vw;
                padding-left: 0;
                color: #BDBCBC;
                border: none;
                border-bottom: 1px solid #282525;
                }
                input[type=date]:focus,
                input[type=text]:focus,
                input[type=email]:focus,
                input[type=file]:focus,
                input[type=number]:focus,
                input[type=password]:focus,
                input[type=search]:focus,
                input[type=submit]:focus,
                input[type=tel]:focus,
                textarea:focus,
                .cus-form-control:focus {
                color: #BDBCBC;
                border: none;
                outline: none;
                background: transparent !important;
                border-bottom: 1px solid #282525;
                box-shadow: none;
                border-radius: 0;
                }
                input[type=date]:hover,
                input[type=text]:hover,
                input[type=email]:hover,
                input[type=file]:hover,
                input[type=number]:hover,
                input[type=password]:hover,
                input[type=search]:hover,
                input[type=submit]:hover,
                input[type=tel]:hover,
                textarea:hover,
                .cus-form-control:hover {
                color: #BDBCBC;
                border-bottom: 1px solid #282525;
                }
                input[type=date]::placeholder,
                input[type=text]::placeholder,
                input[type=email]::placeholder,
                input[type=file]::placeholder,
                input[type=number]::placeholder,
                input[type=password]::placeholder,
                input[type=search]::placeholder,
                input[type=submit]::placeholder,
                input[type=tel]::placeholder,
                textarea::placeholder,
                .cus-form-control::placeholder {
                color: #BDBCBC;
                opacity: 1;
                }

                .search-field {
                display: flex;
                gap: 16px;
                width: 100%;
                align-items: flex-end;
                justify-content: space-between;
                }
                .search-field .search-btn {
                flex-shrink: 0;
                width: clamp(48px, 2.5vw, 56px);
                height: clamp(48px, 2.5vw, 56px);
                display: grid;
                align-content: center;
                justify-content: center;
                border: 0;
                background: #FF5C00;
                color: #FCFDFD;
                border-radius: 5px;
                }
                @media (max-width: 575px) {
                .search-field .search-btn {
                    width: clamp(32px, 2.5vw, 48px);
                    height: clamp(32px, 2.5vw, 48px);
                }
                }
                .search-field .search-btn i {
                font-size: clamp(24px, 1.458vw, 32px);
                }
                @media (max-width: 575px) {
                .search-field .search-btn i {
                    font-size: clamp(18px, 1.458vw, 24px);
                }
                }

                .filter-row {
                display: flex;
                gap: 32px;
                align-items: flex-end;
                justify-content: center;
                margin: 0 auto;
                margin-bottom: 48px;
                max-width: clamp(700px, 44.375vw, 900px);
                }
                @media (max-width: 575px) {
                .filter-row {
                    flex-wrap: wrap;
                }
                }

                .filter-row-2 {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 16px;
                }
                .filter-row-2 .right-filters {
                display: flex;
                align-items: center;
                gap: 16px;
                justify-content: end;
                }
                .filter-row-2 .right-filters .layout-filter {
                display: flex;
                gap: 8px;
                }
                .filter-row-2 .right-filters .layout-filter li {
                background: transparent;
                border-radius: 10px;
                }
                .filter-row-2 .right-filters .layout-filter li a {
                height: 48px;
                width: 48px;
                display: grid;
                justify-content: center;
                align-content: center;
                }
                .filter-row-2 .right-filters .layout-filter li a i {
                color: #282525;
                font-size: 24px;
                }
                .filter-row-2 .right-filters .layout-filter li.active {
                background: #FF5C00;
                }
                .filter-row-2 .right-filters .layout-filter li.active a i {
                color: #FCFDFD;
                }

                .cus-form-control-select {
                padding: 0 24px;
                border: 1px solid #282525;
                height: 48px;
                display: grid;
                align-content: center;
                border-radius: 10px;
                width: clamp(200px, 11.146vw, 240px);
                }

                .heading .title {
                color: #282525;
                }
                .heading .title span {
                position: relative;
                color: #FF5C00;
                }
                .heading .title span::before {
                content: "";
                background: url(../media/vector/bottom-line.png);
                background-repeat: no-repeat;
                background-size: contain;
                position: absolute;
                width: 100%;
                height: 7px;
                left: 0;
                bottom: -10px;
                }

                .eyebrow {
                color: #FF5C00;
                text-transform: uppercase;
                margin-bottom: 8px;
                }
                @media (max-width: 767px) {
                .eyebrow {
                    margin-bottom: 4px;
                }
                }
                @media (max-width: 575px) {
                .eyebrow {
                    margin-bottom: 0px;
                }
                }

                /*--------------------------------------------------------------
                # Search Popup
                --------------------------------------------------------------*/
                .search-popup {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: -2;
                -webkit-transition: all 1s ease;
                -khtml-transition: all 1s ease;
                -moz-transition: all 1s ease;
                -ms-transition: all 1s ease;
                -o-transition: all 1s ease;
                transition: all 1s ease;
                }
                .search-popup .search-popup__overlay {
                position: fixed;
                width: 224vw;
                height: 224vw;
                top: calc(90px - 112vw);
                right: calc(50% - 112vw);
                z-index: 3;
                display: block;
                -webkit-border-radius: 50%;
                -khtml-border-radius: 50%;
                -moz-border-radius: 50%;
                -ms-border-radius: 50%;
                -o-border-radius: 50%;
                border-radius: 50%;
                -webkit-transform: scale(0);
                -khtml-transform: scale(0);
                -moz-transform: scale(0);
                -ms-transform: scale(0);
                -o-transform: scale(0);
                transform: scale(0);
                -webkit-transform-origin: center;
                transform-origin: center;
                -webkit-transition: transform 0.8s ease-in-out;
                -khtml-transition: transform 0.8s ease-in-out;
                -moz-transition: transform 0.8s ease-in-out;
                -ms-transition: transform 0.8s ease-in-out;
                -o-transition: transform 0.8s ease-in-out;
                transition: transform 0.8s ease-in-out;
                transition-delay: 0s;
                transition-delay: 0.3s;
                -webkit-transition-delay: 0.3s;
                background: #FCFDFD;
                cursor: url(../media/close.png), auto;
                }
                @media (max-width: 767px) {
                .search-popup .search-popup__overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    transform: none;
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                    transform: translateY(-110%);
                }
                }
                .search-popup .search-popup__content {
                position: fixed;
                width: 0;
                max-width: fit-content;
                padding: 30px 96px;
                left: 50%;
                top: 50%;
                opacity: 0;
                z-index: 3;
                -webkit-transform: translate(-50%, -50%);
                -khtml-transform: translate(-50%, -50%);
                -moz-transform: translate(-50%, -50%);
                -ms-transform: translate(-50%, -50%);
                -o-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                -webkit-transition: opacity 0.5s 0s, width 0.8s 0.8s cubic-bezier(0.225, 0.01, 0.475, 1.01), transform 0.2s 0s;
                -khtml-transition: opacity 0.5s 0s, width 0.8s 0.8s cubic-bezier(0.225, 0.01, 0.475, 1.01), transform 0.2s 0s;
                -moz-transition: opacity 0.5s 0s, width 0.8s 0.8s cubic-bezier(0.225, 0.01, 0.475, 1.01), transform 0.2s 0s;
                -ms-transition: opacity 0.5s 0s, width 0.8s 0.8s cubic-bezier(0.225, 0.01, 0.475, 1.01), transform 0.2s 0s;
                -o-transition: opacity 0.5s 0s, width 0.8s 0.8s cubic-bezier(0.225, 0.01, 0.475, 1.01), transform 0.2s 0s;
                transition: opacity 0.5s 0s, width 0.8s 0.8s cubic-bezier(0.225, 0.01, 0.475, 1.01), transform 0.2s 0s;
                transition-delay: 0s, 0.8s, 0s;
                transition-delay: 0s, 0.4s, 0s;
                transition-delay: 0.2s;
                -webkit-transition-delay: 0.2s;
                }
                @media (max-width: 575px) {
                .search-popup .search-popup__content {
                    padding: 30px 64px;
                }
                }
                .search-popup .search-popup__content .search-popup__form {
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                }
                .search-popup .search-popup__content .search-popup__form .blur-layer input[type=search],
                .search-popup .search-popup__content .search-popup__form .blur-layer input[type=text] {
                width: 59.5833333333vw;
                }
                .search-popup .search-popup__content .search-popup__form button {
                padding: 0;
                border: 0;
                background: transparent;
                color: #282525;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                position: absolute;
                top: 50%;
                right: 0%;
                transform: translate(-50%, -50%);
                border-radius: 0;
                }
                @media (max-width: 575px) {
                .search-popup .search-popup__content .search-popup__form button {
                    top: 45%;
                }
                }
                .search-popup .search-popup__content .search-popup__form button i {
                margin: 0;
                font-size: 24px;
                }
                @media (max-width: 575px) {
                .search-popup .search-popup__content .search-popup__form button i {
                    font-size: 20px;
                }
                }
                .search-popup .search-popup__content .search-popup__form button::after {
                background-color: #9b59b6;
                }
                .search-popup.active {
                z-index: 9999999;
                }
                .search-popup.active .search-popup__overlay {
                top: auto;
                bottom: calc(90px - 112vw);
                -webkit-transform: scale(1);
                -khtml-transform: scale(1);
                -moz-transform: scale(1);
                -ms-transform: scale(1);
                -o-transform: scale(1);
                transform: scale(1);
                transition-delay: 0s;
                -webkit-transition-delay: 0s;
                opacity: 1;
                -webkit-transition: transform 1.6s cubic-bezier(0.4, 0, 0, 1);
                -khtml-transition: transform 1.6s cubic-bezier(0.4, 0, 0, 1);
                -moz-transition: transform 1.6s cubic-bezier(0.4, 0, 0, 1);
                -ms-transition: transform 1.6s cubic-bezier(0.4, 0, 0, 1);
                -o-transition: transform 1.6s cubic-bezier(0.4, 0, 0, 1);
                transition: transform 1.6s cubic-bezier(0.4, 0, 0, 1);
                }
                @media (max-width: 767px) {
                .search-popup.active .search-popup__overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    transform: none;
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                    transform: translateY(0%);
                }
                }
                .search-popup.active .search-popup__content {
                width: 100%;
                opacity: 1;
                transition-delay: 0.7s;
                -webkit-transition-delay: 0.7s;
                }

                #preloader {
                position: fixed;
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #FCFDFD;
                z-index: 9999999;
                }
                #preloader .logo-bottom-vector {
                padding-top: 8px;
                width: clamp(250px, 26.042vw, 800px);
                }
                #preloader .loading {
                font-family: "Cinzel", "serif";
                font-size: clamp(42.178px, 4.394vw, 134.97px);
                font-weight: 600;
                line-height: 120%;
                /* 101.228px */
                display: flex;
                align-items: center;
                gap: clamp(2.265px, 0.332vw, 6.049px);
                text-align: center;
                }
                #preloader .loading span {
                position: relative;
                color: rgba(255, 92, 0, 0.4);
                }
                #preloader .loading span::after {
                position: absolute;
                top: 0;
                left: 0;
                content: attr(data-text);
                color: #FF5C00;
                opacity: 0;
                transform: rotateY(-90deg);
                animation: loading06 4s infinite;
                }
                #preloader .loading span:nth-child(2)::after {
                animation-delay: 0.2s;
                }
                #preloader .loading span:nth-child(3)::after {
                animation-delay: 0.4s;
                }
                #preloader .loading span:nth-child(4)::after {
                animation-delay: 0.6s;
                }
                #preloader .loading span:nth-child(5)::after {
                animation-delay: 0.8s;
                }
                #preloader .loading span:nth-child(6)::after {
                animation-delay: 1s;
                }
                #preloader .loading span:nth-child(7)::after {
                animation-delay: 1.2s;
                }
                #preloader .loading span:nth-child(8)::after {
                animation-delay: 1.4s;
                }
                #preloader .loading span:nth-child(9)::after {
                animation-delay: 1.6s;
                }

                @keyframes loading {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(15px);
                }
                }
                @keyframes loading06 {
                0%, 75%, 100% {
                    transform: rotateY(-90deg);
                    opacity: 0;
                }
                25%, 50% {
                    transform: rotateY(0);
                    opacity: 1;
                }
                }
                .pagination {
                display: flex;
                align-items: center;
                margin-top: 16px;
                gap: 4px;
                justify-content: center;
                }
                .pagination li {
                border-radius: 5px;
                background: transparent;
                }
                .pagination li a > i,
                .pagination li a {
                width: clamp(42px, 2.5vw, 64px);
                height: clamp(42px, 2.5vw, 64px);
                display: grid;
                align-content: center;
                justify-content: center;
                font-size: clamp(20px, 1.25vw, 28px);
                font-weight: 600;
                line-height: 150%;
                letter-spacing: -0.025vw;
                }
                @media (max-width: 1199px) {
                .pagination li a > i,
                .pagination li a {
                    font-size: clamp(18px, 2vw, 24px);
                }
                }
                @media (max-width: 991px) {
                .pagination li a > i,
                .pagination li a {
                    font-size: clamp(16px, 2.5vw, 22px);
                }
                }
                @media (max-width: 767px) {
                .pagination li a > i,
                .pagination li a {
                    font-size: clamp(16px, 3.1vw, 20px);
                }
                }
                @media (max-width: 575px) {
                .pagination li a > i,
                .pagination li a {
                    font-size: clamp(14px, 5vw, 20px);
                    width: clamp(32px, 2.5vw, 42px);
                    height: clamp(32px, 2.5vw, 42px);
                }
                }
                .pagination li.prev, .pagination li.next {
                background: #F5F7F9;
                }
                .pagination li.active, .pagination li:hover {
                background: #FF5C00;
                transition: all 0.5s ease-in;
                }
                .pagination li.active a, .pagination li:hover a {
                color: #FCFDFD;
                transition: all 0.5s ease-in;
                }

                /*-------------------------
                layouts
                -------------------------*/
                /* ------------------------------------------------------------- *
                * ui-Header
                /* ------------------------------------------------------------- */
                #ui-header {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                color: #fff;
                z-index: 999;
                pointer-events: none;
                /* header position fixed */
                /* header inner */
                /* header columns */
                /* Header logo
                =============== */
                /* ------------------------------------------------------------- *
                * Header tools
                /* ------------------------------------------------------------- */
                }
                #ui-header.ui-header-fixed {
                position: fixed;
                }
                #ui-header .ui-header-inner {
                width: 100%;
                display: flex;
                padding-top: 24px;
                align-items: center;
                }
                @media (max-width: 1024px) {
                #ui-header .ui-header-inner {
                    padding-top: 20px;
                }
                }
                @media (max-width: 575px) {
                #ui-header .ui-header-inner {
                    padding-top: 12px;
                }
                }
                #ui-header .ui-header-col {
                display: flex;
                align-items: center;
                }
                #ui-header .ui-header-col:first-child {
                margin-right: auto;
                }
                #ui-header .ui-logo img {
                position: absolute;
                top: 24px;
                margin-right: auto;
                line-height: 1;
                pointer-events: initial;
                z-index: 9;
                max-height: 64px;
                /* You may need to change the img height to match your logo type! */
                }
                @media (max-width: 1399px) {
                #ui-header .ui-logo img {
                    max-height: 56px;
                }
                }
                @media (max-width: 1024px) {
                #ui-header .ui-logo img {
                    max-height: 48px;
                }
                }
                @media (max-width: 575px) {
                #ui-header .ui-logo img {
                    max-height: 40px;
                }
                }
                #ui-header .ui-logo .ui-logo-light {
                visibility: visible;
                opacity: 1;
                width: auto;
                transition: all 0.5s ease-in;
                }
                #ui-header .ui-logo .ui-logo-dark {
                visibility: hidden;
                opacity: 0;
                width: 0;
                transition: all 0.5s ease-in;
                }
                #ui-header .ui-header-tools {
                position: relative;
                display: flex;
                gap: 8px;
                pointer-events: initial;
                /* Header tools item */
                }
                @media (max-width: 400px) {
                #ui-header .ui-header-tools {
                    gap: 6px;
                }
                }
                #ui-header .ui-header-tools .ui-header-tools-item {
                width: 40px;
                height: 40px;
                border-radius: 5px;
                font-size: 20px;
                display: grid;
                align-content: center;
                justify-content: center;
                background: #E9E9E9;
                color: #282525;
                transition: all 0.5s ease-in;
                }
                #ui-header .ui-header-tools .ui-header-tools-item:hover {
                background: #282525;
                color: #FCFDFD;
                transition: all 0.5s ease-in;
                }
                @media (max-width: 575px) {
                #ui-header .ui-header-tools .ui-header-tools-item {
                    width: 32px;
                    font-size: 16px;
                    height: 32px;
                }
                }
                @media (max-width: 400px) {
                #ui-header .ui-header-tools .ui-header-tools-item {
                    width: 30px;
                    font-size: 14px;
                    height: 30px;
                }
                }

                body.ui-ol-menu-open #ui-header .ui-logo .ui-logo-light {
                visibility: hidden;
                opacity: 0;
                width: 0;
                transition: all 0.5s ease-in;
                }
                body.ui-ol-menu-open #ui-header .ui-logo .ui-logo-dark {
                visibility: visible;
                opacity: 1;
                width: auto;
                transition: all 0.5s ease-in;
                }

                /* ------------------------------------------------------------- *
                * Overlay menu
                /* ------------------------------------------------------------- */
                /* Overlay menu
                ================ */
                .ui-overlay-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background-color: #FCFDFD;
                visibility: hidden;
                opacity: 0;
                pointer-events: initial;
                }

                .ui-ol-menu-holder {
                position: relative;
                height: 100%;
                width: calc(100% + 17px);
                padding-right: 17px;
                overflow-y: scroll;
                z-index: 2;
                }

                .ui-ol-menu-inner {
                display: table;
                width: 100%;
                height: 100%;
                padding-left: 0;
                padding-right: 0;
                }

                .ui-ol-menu-content {
                display: flex;
                align-items: end;
                text-align: left;
                height: 100vh;
                padding: 64px 0;
                }
                @media (max-width: 1024px) {
                .ui-ol-menu-content {
                    flex-direction: row-reverse;
                }
                }
                @media (max-width: 767px) {
                .ui-ol-menu-content {
                    padding-top: 25%;
                    padding-bottom: 35%;
                    padding-left: 15px;
                    padding-right: 15px;
                    text-align: center;
                    align-items: center;
                    flex-direction: column;
                }
                }

                .ui-menu-nav {
                display: grid;
                height: 100%;
                align-content: center;
                }

                /* Disable page scroll if overlay menu is open */
                body.ui-ol-menu-open {
                overflow-y: hidden !important;
                }

                /* Hide smooth scrollbar if overlay menu is open */
                body.ui-smooth-scroll.ui-ol-menu-open .scrollbar-track {
                display: none !important;
                }

                /* Overlay menu list */
                .ui-ol-menu-list {
                display: inline-block;
                margin: 0;
                padding: 0;
                list-style: none;
                }

                .ui-ol-menu-list > li {
                position: relative;
                margin-top: 20px;
                margin-bottom: 20px;
                }

                @media (max-width: 767px) {
                .ui-ol-menu-list > li {
                    margin-top: 15px;
                    margin-bottom: 15px;
                }
                }
                .ui-ol-menu-list > li:first-child {
                margin-top: 0;
                }

                .ui-ol-menu-list > li:last-child {
                margin-bottom: 0;
                }

                /* Overlay menu list item counter */
                @media (min-width: 992px) {
                .ui-overlay-menu.ui-ol-menu-count .ui-ol-menu-list {
                    counter-reset: ol-menu-list-counter;
                }

                .ui-overlay-menu.ui-ol-menu-count .ui-ol-menu-list > li > a::before,
                .ui-overlay-menu.ui-ol-menu-count .ui-ol-menu-list > li > .ui-ol-submenu-trigger > a::before {
                    position: absolute;
                    counter-increment: ol-menu-list-counter;
                    content: "" counter(ol-menu-list-counter, decimal-leading-zero);
                    top: 5px;
                    left: -30px;
                    line-height: 1;
                    font-size: 14px;
                    font-weight: normal;
                    color: #282525;
                    opacity: 0.4;
                }
                }
                /* Overlay menu list links (master parent) */
                .ui-ol-menu-list > li > a,
                .ui-ol-menu-list > li > .ui-ol-submenu-trigger > a {
                position: relative;
                display: inline-block;
                font-size: clamp(34px, 3.2vw, 62px);
                font-weight: bold;
                font-family: "Oswald", sans-serif;
                font-weight: 600;
                line-height: 1.2;
                color: #282525;
                transition: opacity 0.3s ease-in-out;
                }

                /* Overlay menu list hover/active (master parent). Note: no effect on mobile devices! */
                body:not(.is-mobile) .ui-ol-menu-list.ui-ol-menu-hover > li > a,
                body:not(.is-mobile) .ui-ol-menu-list.ui-ol-menu-hover > li > .ui-ol-submenu-trigger > a,
                body:not(.is-mobile) .ui-ol-menu-list.ui-ol-menu-hover > li > .ui-ol-submenu-trigger .ui-ol-submenu-caret {
                opacity: 0.6;
                }

                body:not(.is-mobile) .ui-ol-menu-list > li.active > a,
                body:not(.is-mobile) .ui-ol-menu-list > li.active > .ui-ol-submenu-trigger > a,
                body:not(.is-mobile) .ui-ol-menu-list > li.active > .ui-ol-submenu-trigger .ui-ol-submenu-caret,
                body:not(.is-mobile) .ui-ol-menu-list > li > a:hover,
                body:not(.is-mobile) .ui-ol-menu-list > li > .ui-ol-submenu-trigger:hover > a,
                body:not(.is-mobile) .ui-ol-menu-list > li > .ui-ol-submenu-trigger:hover .ui-ol-submenu-caret,
                body:not(.is-mobile) .ui-ol-menu-list > li > .ui-ol-submenu-trigger.ui-ol-submenu-open > a,
                body:not(.is-mobile) .ui-ol-menu-list > li > .ui-ol-submenu-trigger.ui-ol-submenu-open .ui-ol-submenu-caret {
                opacity: 1;
                }

                /* Overlay menu submenu */
                .ui-ol-submenu-wrap {
                position: relative;
                }

                .ui-ol-submenu-trigger {
                position: relative;
                display: inline-block;
                }

                .ui-ol-submenu {
                display: none;
                position: relative;
                height: auto;
                margin-left: 20px;
                color: #8a8a8a;
                }

                .ui-ol-menu-list > li > .ui-ol-submenu {
                margin-top: 20px;
                margin-bottom: 20px;
                }

                /* Overlay menu submenu list */
                .ui-ol-submenu-list {
                padding: 0;
                list-style: none;
                }

                .ui-ol-submenu-list .ui-ol-submenu {
                margin-top: 15px;
                margin-bottom: 20px;
                }

                /* Overlay menu submenu list links */
                .ui-ol-submenu-list > li a,
                .ui-ol-submenu-list > li > .ui-ol-submenu-trigger > a {
                display: inline-block;
                padding-top: 6px;
                padding-bottom: 6px;
                font-size: 19px;
                font-weight: 500;
                color: #979797;
                font-family: "Oswald", sans-serif;
                transition: color 0.3s ease-in-out;
                }

                /* Overlay menu submenu list hover/active */
                .ui-ol-submenu-list > li > .ui-ol-submenu-trigger.ui-ol-submenu-open > a,
                .ui-ol-submenu-list > li > .ui-ol-submenu-trigger.ui-ol-submenu-open .ui-ol-submenu-caret,
                .ui-ol-submenu-list > li.active > a,
                .ui-ol-submenu-list > li.active > .ui-ol-submenu-trigger > a,
                .ui-ol-submenu-list > li.active > .ui-ol-submenu-trigger .ui-ol-submenu-caret,
                .ui-ol-submenu-list > li a:hover,
                .ui-ol-submenu-list > li > .ui-ol-submenu-trigger:hover > a,
                .ui-ol-submenu-list > li > .ui-ol-submenu-trigger:hover .ui-ol-submenu-caret {
                color: #282525;
                }

                /* Submenu caret (requires FontAwesome: https://fontawesome.com/) */
                .ui-ol-submenu-caret-wrap {
                position: absolute;
                top: 60%;
                right: -40px;
                transform: translate3d(0, -50%, 0);
                }

                @media (max-width: 767px) {
                .ui-ol-submenu-caret-wrap {
                    right: -40px;
                }
                }
                .ui-ol-submenu-caret {
                position: relative;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: #282525;
                cursor: pointer;
                z-index: 2;
                border-radius: 100%;
                transition: opacity 0.3s ease-in-out;
                }

                .ui-ol-submenu-caret::after {
                font-family: "Font Awesome 6 Pro";
                content: "";
                font-weight: 900;
                display: inline-block;
                font-style: normal;
                font-variant: normal;
                text-rendering: auto;
                -webkit-font-smoothing: antialiased;
                transition: all 0.2s ease-in-out;
                }

                .ui-ol-submenu-trigger.ui-ol-submenu-open .ui-ol-submenu-caret::after {
                transform: rotate(180deg);
                }

                /* Sub-submenu caret */
                .ui-ol-menu-list > li li .ui-ol-submenu-caret-wrap {
                top: 50%;
                right: -40px;
                }

                .ui-ol-menu-list > li li .ui-ol-submenu-caret {
                font-size: 16px;
                color: #8a8a8a;
                }

                /* Overlay menu toggle button
                ============================== */
                #ui-ol-menu-toggle-btn-wrap {
                position: relative;
                display: flex;
                align-items: center;
                pointer-events: initial;
                cursor: pointer;
                z-index: 9;
                }

                @media (min-width: 1025px) {
                body.ui-header-tools-on #ui-ol-menu-toggle-btn-wrap {
                    margin-right: 16px;
                }
                }
                .ui-ol-menu-toggle-btn-holder {
                float: left;
                }

                /* Toggle button */
                .ui-ol-menu-toggle-btn {
                position: relative;
                display: block;
                width: 50px;
                height: 50px;
                }

                .ui-ol-menu-toggle-btn span {
                position: absolute;
                display: block;
                top: 54%;
                left: 50%;
                height: 2px;
                width: 24px;
                background-color: transparent;
                transform: translate(-50%, -50%);
                transition: all 0.3s ease-in-out;
                }

                .ui-ol-menu-toggle-btn span::before,
                .ui-ol-menu-toggle-btn span::after {
                position: absolute;
                display: block;
                content: "";
                height: 2px;
                width: 24px;
                background-color: #FCFDFD;
                transition: all 0.3s ease-in-out;
                }

                @media (max-width: 1199px) {
                .white-bg .ui-ol-menu-toggle-btn span::before,
                .white-bg .ui-ol-menu-toggle-btn span::after {
                    background-color: #282525;
                    transition: all 0.3s ease-in-out;
                }
                }

                body.ui-ol-menu-open .ui-ol-menu-toggle-btn span::before,
                body.ui-ol-menu-open .ui-ol-menu-toggle-btn span::after {
                background-color: #282525;
                transition: all 0.3s ease-in-out;
                }

                .ui-ol-menu-toggle-btn span::before {
                top: -4px;
                width: 24px;
                }

                .ui-ol-menu-toggle-btn span::after {
                top: auto;
                bottom: -4px;
                width: 18px;
                }

                /* Toggle button text */
                .ui-ol-menu-toggle-btn-text {
                float: left;
                padding-right: 5px;
                padding-top: 5px;
                overflow: hidden;
                text-align: right;
                font-size: 15px;
                color: #FCFDFD;
                }
                @media (max-width: 575px) {
                .ui-ol-menu-toggle-btn-text {
                    display: none;
                }
                }

                body.ui-ol-menu-open .ui-ol-menu-toggle-btn-text {
                color: #282525;
                transition: all 0.3s ease-in-out;
                }

                /* Toggle button text hover */
                .ui-ol-menu-toggle-btn-text .text-menu {
                position: relative;
                display: inline-block;
                text-align: right;
                transition: transform 0.3s;
                }

                body.ui-ol-menu-open .ui-ol-menu-toggle-btn-text .text-menu {
                display: none;
                }

                body:not(.is-mobile) .ui-ol-menu-toggle-btn-text .text-menu::before {
                position: absolute;
                top: 100%;
                right: 0;
                content: attr(data-hover);
                }

                body:not(.is-mobile) #ui-ol-menu-toggle-btn-wrap:hover .ui-ol-menu-toggle-btn-text .text-menu {
                transform: translate3d(0, -100%, 0);
                }

                /* Toggle button close */
                body.ui-ol-menu-open .ui-ol-menu-toggle-btn span {
                width: 20px;
                background-color: transparent;
                }

                body.ui-ol-menu-open .ui-ol-menu-toggle-btn span::before {
                top: 0;
                width: 20px;
                transform: rotate(45deg);
                }

                body.ui-ol-menu-open .ui-ol-menu-toggle-btn span::after {
                bottom: 0;
                width: 20px;
                transform: rotate(-45deg);
                }

                .ui-ol-menu-toggle-btn-text .text-close {
                display: none;
                }

                body.ui-ol-menu-open .ui-ol-menu-toggle-btn-text .text-close {
                display: block;
                }

                /* Disable menu toggle button click until the animations last */
                body.olm-toggle-no-click .ui-ol-menu-toggle-btn-text,
                body.olm-toggle-no-click .ui-ol-menu-toggle-btn {
                pointer-events: none;
                }

                /* Overlay menu position center
                ================================ */
                .ui-overlay-menu.ui-ol-menu-center .ui-ol-menu-content {
                text-align: center;
                }

                .ui-overlay-menu.ui-ol-menu-center .ui-ol-submenu {
                margin-left: 0;
                }

                /* Disable page scroll if ui-Search is open. */
                body.ui-search-open {
                overflow-y: hidden !important;
                }
                body.ui-search-open .scrollbar-track {
                display: none !important;
                }

                .company-info {
                position: relative;
                }
                .company-info .vector {
                position: absolute;
                top: 0%;
                left: 50%;
                transform: translate(-50%, -80%);
                }

                .hero-banner-1 {
                position: relative;
                width: 100vw;
                height: 100vh;
                background: radial-gradient(103.95% 102.72% at 53.02% 10.62%, rgba(255, 255, 255, 0.66) 0%, #F57A35 29.07%, #913908 83.9%, #FDAF84 100%), #FF5C00;
                display: flex;
                align-items: center;
                justify-content: space-between;
                }
                @media (max-width: 1199px) {
                .hero-banner-1 {
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: flex-start;
                }
                }
                .hero-banner-1 .content {
                width: 51.7708333333vw;
                height: 100%;
                position: relative;
                display: grid;
                height: 100%;
                align-content: center;
                }
                @media (min-width: 1200px) {
                .hero-banner-1 .content {
                    padding: 0 0 0 5vw;
                }
                }
                @media (max-width: 1199px) {
                .hero-banner-1 .content {
                    width: 100vw;
                    padding: 0 2vw;
                    height: 60%;
                }
                }
                .hero-banner-1 .content .element-vector {
                position: absolute;
                z-index: 20;
                top: 50%;
                right: 0;
                transform: translate(-20%, -50%);
                width: 11.615vw;
                height: 9.531vw;
                }
                .hero-banner-1 .content::before {
                content: "";
                background: url(../media/banner/text-bg.png);
                background-position: top right;
                background-repeat: no-repeat;
                background-size: cover;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                z-index: 10;
                }
                @media (max-width: 1199px) {
                .hero-banner-1 .content::before {
                    background: url(../media/banner/text-bg-md.png);
                    background-position: bottom left;
                    background-size: cover;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-1 .content::before {
                    background: url(../media/banner/text-bg-sm.png);
                    background-position: bottom left;
                    background-size: cover;
                }
                }
                .hero-banner-1 .content .text-block {
                position: relative;
                display: inline-block;
                z-index: 20;
                }
                @media (max-width: 1199px) {
                .hero-banner-1 .content .text-block {
                    padding-top: 10%;
                }
                }
                .hero-banner-1 .content .text-block .title-block {
                position: relative;
                width: fit-content;
                }
                .hero-banner-1 .content .text-block .title-block .text-effect {
                position: absolute;
                top: -30%;
                right: -10%;
                width: 4.794vw;
                height: 5.154vw;
                }
                .hero-banner-1 .content .text-block .description {
                margin-bottom: 3.333vw;
                }
                .hero-banner-1 .content .text-block .order {
                display: flex;
                align-items: center;
                gap: 32px;
                margin-bottom: 2.5vw;
                }
                .hero-banner-1 .content .text-block .sm-image {
                display: flex;
                align-items: center;
                gap: 24px;
                }
                .hero-banner-1 .content .text-block .sm-image .fill-block {
                position: relative;
                width: 122px;
                height: 122px;
                background: #282525;
                }
                .hero-banner-1 .image-block {
                margin-top: 9.167vw;
                width: 49.375vw;
                padding-bottom: 3.333vw;
                padding-top: 2.5vw;
                }
                @media (max-width: 1199px) {
                .hero-banner-1 .image-block {
                    width: 100vw;
                    margin-top: 0;
                    padding-bottom: 0;
                    padding-top: 0;
                    height: 40%;
                    display: grid;
                    align-content: center;
                }
                }
                .hero-banner-1 .image-block .images {
                position: relative;
                height: 37.708vw;
                width: 100%;
                }
                @media (max-width: 575px) {
                .hero-banner-1 .image-block .images {
                    height: 85vw;
                }
                }
                .hero-banner-1 .image-block .images .img {
                width: 100%;
                height: 37.708vw;
                position: absolute;
                top: 0;
                z-index: 100;
                scale: 0;
                }
                @media (max-width: 1199px) {
                .hero-banner-1 .image-block .images .img {
                    position: relative;
                    scale: 1;
                    top: auto;
                    width: fit-content;
                    margin: 0 auto;
                    position: relative;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-1 .image-block .images .img {
                    height: 75vw;
                    margin-left: 10%;
                }
                }
                @media (max-width: 1199px) {
                .hero-banner-1 .image-block .images .img.img-2 {
                    display: none;
                }
                }
                @media (max-width: 1199px) {
                .hero-banner-1 .image-block .images .img.img-3 {
                    display: none;
                }
                }
                @media (max-width: 1199px) {
                .hero-banner-1 .image-block .images .img.img-4 {
                    display: none;
                }
                }
                .hero-banner-1 .image-block .images .img img {
                object-fit: cover;
                height: 100%;
                }

                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .content {
                    padding: 0;
                    padding-top: 10%;
                    padding-left: 20px;
                    width: 60.7708333333vw;
                    height: 100%;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .content .element-vector {
                    display: none;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .content::before {
                    background: url(../media/banner/text-bg.png);
                    background-position: top right;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 120%;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .content .text-block {
                    padding-top: 0;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .content .text-block .title-block .banner-title {
                    font-size: 48px;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .content .text-block .description {
                    display: none;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .image-block {
                    margin-top: 9.167vw;
                    width: 49.375vw;
                    padding-bottom: 3.333vw;
                    padding-top: 2.5vw;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .image-block .images {
                    width: 200%;
                    right: 32%;
                    height: 25vw;
                }
                }
                @media only screen and (min-width: 575px) and (max-width: 1100px) {
                .is-mobile .hero-banner-1 .image-block .images .img {
                    height: 28vw;
                }
                }

                .hero-banner-2 {
                width: 100vw;
                background: radial-gradient(103.95% 102.72% at 53.02% 10.62%, rgba(255, 255, 255, 0.66) 0%, #F57A35 29.07%, #913908 83.9%, #FDAF84 100%), #FF5C00;
                padding: 8.33vw 1.25vw 0 !important;
                text-align: center;
                height: 50vw;
                overflow: hidden;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 {
                    height: 100vh;
                    padding-top: 36vw !important;
                }
                }
                @media (max-width: 767px) {
                .hero-banner-2 {
                    padding-top: 50vw !important;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 {
                    padding-top: 70% !important;
                }
                }
                .hero-banner-2 .content {
                width: 100%;
                position: relative;
                }
                .hero-banner-2 .content .title-block {
                height: 5.9375vw;
                overflow: hidden;
                }
                @media (max-width: 1199px) {
                .hero-banner-2 .content .title-block {
                    height: 7.65vw;
                }
                }
                @media (max-width: 991px) {
                .hero-banner-2 .content .title-block {
                    height: 9.65vw;
                }
                }
                @media (max-width: 767px) {
                .hero-banner-2 .content .title-block {
                    height: 11.65vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .title-block {
                    height: 18.5vw;
                }
                }
                .hero-banner-2 .content .title-block .banner-title {
                font-family: "Oregano", "cursive";
                font-weight: 400;
                transform: scale(0.5);
                }
                .hero-banner-2 .content .title-block .banner-title.title-1 {
                transform: translateY(0px) scale(1);
                }
                .hero-banner-2 .content p {
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content p {
                    padding: 0 20px;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content p br {
                    display: none;
                }
                }
                .hero-banner-2 .content .elements .element {
                filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.12));
                position: absolute;
                }
                .hero-banner-2 .content .elements .element.el-1 {
                top: 1.09vw;
                left: 1.04vw;
                width: 12.604vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-1 {
                    top: 24.09vw;
                    left: 5.04vw;
                    width: 17vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-1 {
                    top: 50.09vw;
                    left: 5.04vw;
                    width: 17vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-2 {
                top: 0.3125vw;
                right: -0.78125vw;
                width: 20.729vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-2 {
                    top: -15.3125vw;
                    right: 0vw;
                    width: 24vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-2 {
                    top: -30.3125vw;
                    right: 0vw;
                    width: 24vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-3 {
                top: 5vw;
                left: -0.78125vw;
                width: 19.375vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-3 {
                    top: 40.3125vw;
                    left: 1.78125vw;
                    width: 23vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-3 {
                    top: 60.3125vw;
                    left: 1.78125vw;
                    width: 23vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-4 {
                top: -0.46875vw;
                right: 1.5625vw;
                width: 18.906vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-4 {
                    top: -15vw;
                    right: 2vw;
                    width: 22vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-4 {
                    top: -30vw;
                    right: 2vw;
                    width: 22vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-5 {
                top: 4.2708333333vw;
                left: -1.25vw;
                width: 19.375vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-5 {
                    top: 35.3125vw;
                    left: 1.78125vw;
                    width: 24vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-5 {
                    top: 60.3125vw;
                    left: 1.78125vw;
                    width: 24vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-6 {
                top: -1.0416666667vw;
                right: -1.0416666667vw;
                width: 17.344vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-6 {
                    top: -15vw;
                    right: 0vw;
                    width: 21vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-6 {
                    top: -30vw;
                    right: 0vw;
                    width: 21vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-7 {
                top: 4.375vw;
                left: 0px;
                width: 18.802vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-7 {
                    top: 35.3125vw;
                    left: 5vw;
                    width: 22vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-7 {
                    top: 60.3125vw;
                    left: 5vw;
                    width: 22vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-8 {
                top: -1.40625vw;
                right: -18px;
                width: 16.927vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-8 {
                    top: -15vw;
                    right: 5vw;
                    width: 20vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-8 {
                    top: -30vw;
                    right: 5vw;
                    width: 20vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-9 {
                top: 8.5416666667vw;
                left: 1.40625vw;
                width: 18.906vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-9 {
                    top: 35.3125vw;
                    left: 5vw;
                    width: 20vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-9 {
                    top: 60.3125vw;
                    left: 5vw;
                    width: 20vw;
                }
                }
                .hero-banner-2 .content .elements .element.el-10 {
                top: -1.71875vw;
                right: -1.0416666667vw;
                width: 18.646vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .content .elements .element.el-10 {
                    top: -15vw;
                    right: 2vw;
                    width: 22vw;
                }
                }
                @media (max-width: 575px) {
                .hero-banner-2 .content .elements .element.el-10 {
                    top: -30vw;
                    right: 2vw;
                    width: 22vw;
                }
                }
                .hero-banner-2 .content .elements .element.elem-1 {
                opacity: 1;
                }
                .hero-banner-2 .content .elements .element.elem-2, .hero-banner-2 .content .elements .element.elem-3, .hero-banner-2 .content .elements .element.elem-4, .hero-banner-2 .content .elements .element.elem-5 {
                opacity: 0;
                }
                .hero-banner-2 .mb-100 {
                margin-bottom: 5.2083333333vw;
                }
                @media (max-width: 1025px) {
                .hero-banner-2 .clip-block {
                    transform: translateY(50%);
                }
                }
                .hero-banner-2 .dishes-component {
                width: 55.2083333333vw;
                height: 55.2083333333vw;
                padding: 3.1770833333vw;
                margin: 0 auto;
                padding: 3.1770833333vw;
                position: relative;
                }
                @media (max-width: 575px) {
                .hero-banner-2 .dishes-component {
                    width: 95vw;
                    height: 95vw;
                }
                }
                .hero-banner-2 .dishes-component .dishes-name {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 50%;
                }
                @media (max-width: 575px) {
                .hero-banner-2 .dishes-component .dishes-name {
                    display: none;
                }
                }
                .hero-banner-2 .dishes-component .dishes-name .center {
                text-align: center;
                margin-bottom: 0.3645833333vw;
                }
                .hero-banner-2 .dishes-component .dishes-name .center svg {
                transform: translateY(-2.5vw);
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .center svg {
                    transform: translateY(-3.5vw);
                }
                }
                .hero-banner-2 .dishes-component .dishes-name .half-between {
                width: 76%;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin: 0 auto;
                margin-bottom: 3.8020833333vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .half-between {
                    width: 81%;
                }
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .half-between svg {
                    transform: translateY(-0.9vw);
                }
                }
                .hero-banner-2 .dishes-component .dishes-name .half-between svg.lamb-chops {
                transform: translateY(-0.7vw);
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .half-between svg.lamb-chops {
                    transform: translateY(-0.9vw);
                }
                }
                .hero-banner-2 .dishes-component .dishes-name .between {
                width: 104%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 0 auto;
                margin-left: -2.5%;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .between {
                    width: 108%;
                    margin-left: -4.5%;
                }
                }
                .hero-banner-2 .dishes-component .dishes-name .chilli-chicken {
                width: 10.78125vw;
                height: 1.3541666667vw;
                }
                .hero-banner-2 .dishes-component .dishes-name .fish-soup {
                width: 6.1979166667vw;
                height: 4.8958333333vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .fish-soup {
                    transform: rotate(-5deg);
                }
                }
                .hero-banner-2 .dishes-component .dishes-name .lamb-chops {
                width: 7.4479166667vw;
                height: 6.3020833333vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .lamb-chops {
                    transform: rotate(5deg);
                }
                }
                .hero-banner-2 .dishes-component .dishes-name .mapo-tofu {
                width: 4.1666666667vw;
                height: 7.5vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .mapo-tofu {
                    transform: rotate(-5deg);
                }
                }
                .hero-banner-2 .dishes-component .dishes-name .vegetables {
                width: 3.75vw;
                height: 8.28125vw;
                }
                @media (max-width: 1024px) {
                .hero-banner-2 .dishes-component .dishes-name .vegetables {
                    transform: rotate(5deg);
                }
                }
                .hero-banner-2 .dishes-component .dotted {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                }
                @media (max-width: 575px) {
                .hero-banner-2 .dishes-component .dotted {
                    display: none;
                }
                }
                .hero-banner-2 .dishes-component .stroke-light {
                width: 100%;
                height: 100%;
                padding: 3.1770833333vw;
                border-radius: 50%;
                border: 1px solid rgba(252, 253, 253, 0.5);
                background: rgba(255, 92, 0, 0.1);
                }
                .hero-banner-2 .dishes-component .stroke-light .dish {
                position: relative;
                width: 100%;
                height: 100%;
                }
                .hero-banner-2 .dishes-component .stroke-light .dish img {
                position: absolute;
                left: 0;
                top: 0;
                filter: drop-shadow(0px -10px 30px rgba(40, 37, 37, 0.15));
                }
                .hero-banner-2 .dishes-component .stroke-light .dish img.img-3, .hero-banner-2 .dishes-component .stroke-light .dish img.img-4, .hero-banner-2 .dishes-component .stroke-light .dish img.img-5 {
                opacity: 0;
                }

                .spacer {
                width: 100vw;
                height: 100vh;
                }

                .cart-table thead tr th {
                padding: 32px 0 24px;
                }
                .cart-table thead tr th:first-child {
                padding-left: 24px;
                }
                .cart-table tbody tr:last-child td {
                border: none;
                }
                .cart-table tbody tr td {
                vertical-align: middle;
                padding: 24px 0;
                }
                .cart-table tbody tr td.product-block {
                padding-left: 24px;
                display: flex;
                gap: 24px;
                align-items: center;
                }
                .cart-table tbody tr td.product-block img {
                box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12);
                }
                .cart-table tbody tr td.product-block .remove-from-cart-btn {
                width: 40px;
                height: 40px;
                display: grid;
                align-content: center;
                text-align: center;
                background: #F0F0F0;
                border-radius: 5px;
                }
                .cart-table tbody tr td.product-block .remove-from-cart-btn i {
                font-size: 20px;
                }

                .cart-item-card {
                padding: 1.667vw 1.25vw;
                border-radius: 30px;
                background: url(../media/vector/doots-card.png);
                background-position: top center;
                background-repeat: no-repeat;
                background-size: cover;
                border: 1px solid #F0F0F0;
                box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.04), 6px 3px 14px 0px rgba(0, 0, 0, 0.04), 23px 12px 26px 0px rgba(0, 0, 0, 0.03), 53px 27px 35px 0px rgba(0, 0, 0, 0.02), 94px 48px 42px 0px rgba(0, 0, 0, 0.01);
                width: 100%;
                position: relative;
                }
                @media (max-width: 1599px) {
                .cart-item-card {
                    border-radius: 20px;
                }
                }
                @media (max-width: 991px) {
                .cart-item-card {
                    padding: 2vw;
                }
                }
                @media (max-width: 767px) {
                .cart-item-card {
                    padding: 3vw;
                }
                }
                @media (max-width: 575px) {
                .cart-item-card {
                    padding: 5vw 4.5vw;
                }
                }
                .cart-item-card .remove-from-cart-btn {
                position: absolute;
                top: 16px;
                right: 16px;
                z-index: 50;
                }
                .cart-item-card .remove-from-cart-btn i {
                color: #282525;
                font-size: 20px;
                }

                .cart-summary {
                padding: 1.667vw 1.25vw;
                border-radius: 30px;
                background: url(../media/vector/doots-card.png);
                background-position: top center;
                background-repeat: no-repeat;
                background-size: cover;
                border: 1px solid #F0F0F0;
                box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.04), 6px 3px 14px 0px rgba(0, 0, 0, 0.04), 23px 12px 26px 0px rgba(0, 0, 0, 0.03), 53px 27px 35px 0px rgba(0, 0, 0, 0.02), 94px 48px 42px 0px rgba(0, 0, 0, 0.01);
                width: 90%;
                }
                @media (max-width: 1599px) {
                .cart-summary {
                    border-radius: 20px;
                }
                }
                @media (max-width: 991px) {
                .cart-summary {
                    padding: 2vw;
                }
                }
                @media (max-width: 767px) {
                .cart-summary {
                    padding: 3vw;
                }
                }
                @media (max-width: 575px) {
                .cart-summary {
                    padding: 5vw 4vw;
                }
                }
                .cart-summary .title {
                border-bottom: 1px solid #F0F0F0;
                padding-bottom: 24px;
                }
                .cart-summary .cart-summary-detail {
                border-bottom: 1px solid #F0F0F0;
                }

                .payment-method {
                border-bottom: 1px solid #BDBCBC;
                }
                .payment-method ul li {
                padding: 24px 0;
                border-top: 1px solid #F0F0F0;
                }
                .payment-method label {
                color: #282525;
                }
                .payment-method label:has(input[type=radio]) {
                line-height: 1.1;
                display: grid;
                grid-template-columns: 1em auto;
                align-items: baseline;
                gap: 0.5em;
                cursor: pointer;
                }
                .payment-method label:has(input[type=radio]) > input[type=radio] {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background-color: transparent;
                margin: 0;
                font: inherit;
                color: currentColor;
                width: 20px;
                height: 20px;
                border: 2px solid #FF5C00;
                margin-top: 5px;
                border-radius: 50%;
                transform: translateY(-0.075em);
                display: grid;
                place-content: center;
                cursor: pointer;
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]::before {
                content: "";
                width: 0.51em;
                height: 0.5em;
                border-radius: 50%;
                transform: scale(0);
                transition: 120ms transform ease-in-out;
                background-color: #FF5C00;
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]::after {
                content: "";
                width: 2em;
                height: 2em;
                border-radius: 50%;
                background-color: #FF5C00;
                opacity: 0;
                position: absolute;
                z-index: -1;
                inset-block-start: 50%;
                inset-inline-start: 50%;
                transform: translate(-50%, -50%);
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]:is(:active):not(:checked)::after {
                background-color: #FF5C00;
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]:checked {
                border-color: #FF5C00;
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]:checked::after {
                opacity: 0;
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]:checked::before {
                transform: scale(1);
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]:checked:is(:hover, :focus)::after {
                background-color: #FF5C00;
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]:checked:is(:active)::after {
                background-color: #FF5C00;
                }
                .payment-method label:has(input[type=radio]) > input[type=radio]:focus {
                outline: unset;
                }

                .product-detail .img-block img {
                border-radius: 19.707px;
                box-shadow: 0px 9.853px 19.707px 0px rgba(151, 151, 151, 0.25);
                }
                .product-detail .content {
                padding-left: 48px;
                }
                @media (max-width: 1199px) {
                .product-detail .content {
                    padding-left: 0;
                }
                }
                .product-detail .content .abo-pro {
                display: flex;
                justify-content: space-between;
                align-items: center;
                }
                .product-detail .content .abo-pro .rating-review {
                display: flex;
                align-items: center;
                gap: 8px;
                }
                .product-detail .content .abo-pro .rating-review .rating {
                display: flex;
                align-items: center;
                gap: 4px;
                }
                @media (max-width: 575px) {
                .product-detail .content .abo-pro .rating-review .rating {
                    gap: 2px;
                }
                }
                .product-detail .content .abo-pro .rating-review .rating i {
                width: 24px;
                height: 24px;
                font-size: 18px;
                display: grid;
                justify-content: center;
                align-content: center;
                color: #FF5C00;
                }
                @media (max-width: 575px) {
                .product-detail .content .abo-pro .rating-review .rating i {
                    width: 18px;
                    height: 18px;
                    font-size: 13px;
                }
                }
                .product-detail .content .action-block {
                background: #FCFDFD;
                border-radius: 20px;
                box-shadow: 0px 9.853px 19.707px 0px rgba(151, 151, 151, 0.25);
                padding: 20px;
                width: fit-content;
                display: flex;
                gap: 12px;
                align-items: center;
                flex-wrap: wrap;
                }
                @media (max-width: 1199px) {
                .product-detail .content .action-block {
                    padding: 16px;
                }
                }
                @media (max-width: 767px) {
                .product-detail .content .action-block {
                    padding: 12px;
                }
                }
                .product-detail .content .product-badges li {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
                }
                .product-detail .content .product-badges li:last-child {
                margin-bottom: 0;
                }

                .inner-page-banner {
                position: relative;
                background: url(../media/bg/inner-page-banner-bg.png);
                background-position: top center;
                background-repeat: no-repeat;
                background-size: cover;
                }
                @media (max-width: 1024px) {
                .inner-page-banner {
                    background: url(../media/bg/inner-page-banner-bg-tab.png);
                    background-position: bottom center;
                    background-repeat: no-repeat;
                    background-size: cover;
                }
                }
                @media (max-width: 575px) {
                .inner-page-banner {
                    background: url(../media/bg/inner-page-banner-bg-mob.png);
                    background-position: bottom center;
                    background-repeat: no-repeat;
                    background-size: cover;
                }
                }
                .inner-page-banner .page-title {
                height: 12.5vw;
                display: grid;
                align-content: end;
                width: fit-content;
                margin: 0 auto;
                position: relative;
                }
                @media (max-width: 1024px) {
                .inner-page-banner .page-title {
                    height: 200px;
                }
                }
                @media (max-width: 400px) {
                .inner-page-banner .page-title {
                    height: 175px;
                }
                }
                .inner-page-banner .page-title::before {
                content: "";
                background: url(../media/vector/bottom-line-2.png);
                background-repeat: no-repeat;
                background-size: contain;
                position: absolute;
                width: 100%;
                height: 7px;
                left: 0;
                bottom: -7px;
                }

                .footer-main {
                position: relative;
                margin-top: -4.271vw;
                background: url(../media/bg/footer-bg.png) no-repeat;
                background-position: bottom center;
                background-size: cover;
                padding: 11.042vw 0 2.5vw;
                }
                @media (max-width: 1199px) {
                .footer-main {
                    margin-top: -15.271vw;
                    padding: 30.042vw 0 3.5vw;
                }
                }
                @media (max-width: 992px) {
                .footer-main {
                    margin-top: -23.271vw;
                    padding: 40.042vw 0 4.5vw;
                }
                }
                @media (max-width: 767px) {
                .footer-main {
                    margin-top: -30.271vw;
                    padding: 50.042vw 0 5.5vw;
                }
                }
                @media (max-width: 492px) {
                .footer-main {
                    margin-top: -40.271vw;
                    padding: 60.042vw 0 5.5vw;
                }
                }
                @media (max-width: 400px) {
                .footer-main {
                    margin-top: -45.271vw;
                    padding: 70.042vw 0 5.5vw;
                }
                }
                .footer-main .footer-nav {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 32px;
                }
                @media (max-width: 492px) {
                .footer-main .footer-nav {
                    gap: 16px;
                }
                }
                .footer-main .footer-nav li a {
                color: #FCFDFD;
                }
                .footer-main .footer-nav li a:hover {
                color: #FCFDFD;
                }
                .footer-main .social-icons-list {
                display: flex;
                justify-content: center;
                }

                .footer-bottom .bottom-row {
                display: flex;
                justify-content: space-between;
                padding: 1.8vw 0;
                align-items: center;
                }
                @media (max-width: 767px) {
                .footer-bottom .bottom-row {
                    flex-direction: column;
                    justify-content: center;
                    padding: 2.8vw 0;
                    gap: 16px;
                }
                }
                .footer-bottom .bottom-row .right-block {
                display: flex;
                gap: 16px;
                }

            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header -->
                <section class="inner-page-banner">
                    <header>
                        <div style="text-align:center;">
                            <img src="cid:logo_cid" alt="Wrapking Logo" style="max-width:150px;">
                        </div>
                    </header>

                    $bodyHTML

                    <!-- Footer -->
                    <footer style="margin-top:40px;text-align:center;color:#999;">
                        <p>If you have any questions, contact us at info@wrapking.net.</p>
                        <p>&copy; 2025 Wrapking. All rights reserved.</p>
                        <a href="https://wrapking.net/unsubscribe.html?subID=">unsubscribe</a>
                    </footer>
                </section>
            </div>
        </body>
        </html>
        HTML;

    // Set email content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $htmlContent;

    // Send email
    if ($mail->send()) {
        echo "Email sent successfully.";
    } else {
        echo "Failed to send email.";
    }
} catch (Exception $e) {
    echo "Error sending email: {$mail->ErrorInfo}";
}

?>
