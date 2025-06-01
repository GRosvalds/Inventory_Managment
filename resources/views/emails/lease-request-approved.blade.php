<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lease Request Approved</title>
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
                                    <path d="M12 20l9-5-9-5-9 5 9 5z"/>
                                    <polyline points="12 12 12 20"/>
                                    <polyline points="12 4 12 8"/>
                                </svg>
                            </span>
                            Lease Request Approved
                        </h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px;">
                        <p>Hello,</p>
                        <p>Your request to lease <strong>{{ $leaseRequest->inventoryItem->name ?? 'an item' }}</strong> has been approved.</p>
                        <ul>
                            <li><strong>Quantity:</strong> {{ $leaseRequest->quantity }}</li>
                            <li><strong>Lease Until:</strong> {{ \Carbon\Carbon::parse($leaseRequest->requested_until)->format('Y-m-d') }}</li>
                        </ul>
                        <p>You may now collect your item as per the agreement.</p>
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
