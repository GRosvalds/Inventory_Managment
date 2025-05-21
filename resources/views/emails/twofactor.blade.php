<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Authentication Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6; color: #374151;">
<table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
        <td style="padding: 0;">
            <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px;">
                <tr>
                    <td style="background-color: #1e40af; padding: 20px; text-align: left;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="vertical-align: middle;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; display: flex; align-items: center;">
                                            <span style="display: inline-block; margin-right: 10px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                </svg>
                                            </span>
                                        Two-Factor Authentication
                                    </h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 30px;">
                        <p style="margin-top: 0; margin-bottom: 20px; font-size: 16px; line-height: 24px; color: #374151;">
                            To complete your sign-in, please use the following verification code:
                        </p>

                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
                            <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0; color: #1e40af;">
                                {{ $code }}
                            </p>
                            <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
                                This code will expire in <strong>10 minutes</strong>
                            </p>
                        </div>

                        <p style="margin: 0; font-size: 16px; line-height: 24px; color: #374151;">
                            If you didn't request this code, please ignore this email or contact support if you have concerns about your account security.
                        </p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">
                            This is an automated message, please do not reply.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
