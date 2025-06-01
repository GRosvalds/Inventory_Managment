<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lease Request</title>
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
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </span>
                            New Lease Request
                        </h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:30px;">
                        <p style="font-size:16px; color:#374151;">
                            <strong>{{ $user->name }}</strong> ({{ $user->email }}) has requested to lease an item.
                        </p>
                        <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:20px; margin-bottom:24px;">
                            <p style="margin:0 0 10px 0; font-size:16px; color:#4b5563;">
                                <strong>Item:</strong> {{ $leaseRequest->inventoryItem->name ?? 'N/A' }}<br>
                                <strong>Quantity:</strong> {{ $leaseRequest->quantity }}<br>
                                <strong>Requested Until:</strong> {{ \Carbon\Carbon::parse($leaseRequest->requested_until)->format('Y-m-d') }}<br>
                                <strong>Purpose:</strong> {{ $leaseRequest->purpose ?? 'N/A' }}
                            </p>
                        </div>
                        <p style="font-size:16px; color:#374151;">
                            Please review and approve or reject this request in the admin panel.
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
