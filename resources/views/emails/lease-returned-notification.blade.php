<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lease Returned Notification</title>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                                                <path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2 2 2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z"/>
                                                <polyline points="16 13 12 17 8 13"/>
                                                <line x1="12" y1="17" x2="12" y2="9"/>
                                            </svg>
                                        </span>
                                        Lease Returned
                                    </h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px;">
                        <p style="font-size: 16px; color: #374151;">
                            <strong>{{ $user->name }}</strong> ({{ $user->email }}) has returned the following item:
                        </p>
                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 16px;">
                                <li><strong>Item:</strong> {{ $item->name }}</li>
                                <li><strong>Quantity Returned:</strong> {{ $lease->quantity }}</li>
                                <li><strong>Lease ID:</strong> {{ $lease->id }}</li>
                                <li><strong>Returned At:</strong> {{ now()->format('Y-m-d H:i') }}</li>
                            </ul>
                        </div>
                        <p style="font-size: 16px; color: #374151;">
                            Please review the inventory for confirmation.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">
                            This is an automated message from the Inventory Management System.
                        </p>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">
                            Please do not reply to this email.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
