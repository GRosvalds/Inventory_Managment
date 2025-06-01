<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lease Request Rejected</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f3f4f6; color: #374151;">
<table role="presentation" style="width:100%; border-collapse:collapse;">
    <tr>
        <td>
            <table role="presentation" style="width:100%; max-width:600px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                    <td style="background-color:#b91c1c; padding:20px;">
                        <h1 style="color:#fff; margin:0; font-size:24px; display:flex; align-items:center;">
                            <span style="display:inline-block; margin-right:10px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:white;">
                                    <path d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                                </svg>
                            </span>
                            Lease Request Rejected
                        </h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px;">
                        <p>Hello,</p>
                        <p>Unfortunately, your request to lease <strong>{{ $leaseRequest->inventoryItem->name ?? 'an item' }}</strong> was rejected.</p>
                        <p>If you have questions, please contact support.</p>
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
