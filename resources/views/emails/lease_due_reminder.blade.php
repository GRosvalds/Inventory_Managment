<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lease Reminder</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f3f4f6; color: #374151;">
<table role="presentation" style="width:100%; border-collapse:collapse;">
    <tr>
        <td>
            <table role="presentation" style="width:100%; max-width:600px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                    <td style="background-color:#1e40af; padding:20px;">
                        <h1 style="color:#fff; margin:0; font-size:24px; display:flex; align-items:center;">
                            <span style="display:inline-block; margin-right:10px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:white;">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                            </span>
                            Lease Reminder
                        </h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px;">
                        <p>Hello,</p>
                        <p>This is a reminder that your lease for <strong>{{ $lease->item->name ?? 'an item' }}</strong> is approaching its due date.</p>
                        <ul>
                            <li><strong>Quantity:</strong> {{ $lease->quantity }}</li>
                            <li><strong>Lease Due Date:</strong> {{ \Carbon\Carbon::parse($lease->lease_until)->format('Y-m-d') }}</li>
                        </ul>
                        <p>Please ensure the item is returned by the due date or request an extension if needed.</p>
                        <p style="color: #b91c1c; background: #fef2f2; border-left: 4px solid #dc2626; padding: 10px; border-radius: 4px; margin-top: 16px;">
                            <strong>Important:</strong> The due date is <u>not</u> the last day to return the item. The last day to return it is the day <strong>before</strong> the due date.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px; background:#f9fafb; border-top:1px solid #e5e7eb; text-align:center;">
                        <p style="margin:0; font-size:14px; color:#6b7280;">
                            This is an automated message from the Inventory Management System.<br>
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
