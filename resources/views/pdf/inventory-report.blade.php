@php use Carbon\Carbon; @endphp<!DOCTYPE html>
<html>
<head>
    <title>Inventory Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f4f6fa;
            color: #22223b;
            margin: 0;
            padding: 0;
        }
        .header {
            background: #1e40af;
            color: #fff;
            padding: 24px 0 16px 0;
            text-align: center;
            border-bottom: 4px solid #2563eb;
        }
        .logo {
            display: inline-block;
            vertical-align: middle;
            margin-right: 12px;
        }
        .title {
            font-size: 2rem;
            font-weight: bold;
            letter-spacing: 1px;
            display: inline-block;
            vertical-align: middle;
        }
        .container {
            max-width: 900px;
            margin: 32px auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(30,64,175,0.08);
            padding: 32px;
        }
        h2 {
            color: #1e40af;
            margin-bottom: 24px;
            font-size: 1.5rem;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
            background: #f9fafb;
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 10px 8px;
            text-align: left;
        }
        th {
            background: #1e40af;
            color: #fff;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background: #f1f5f9;
        }
        .lease-table {
            margin-top: 8px;
            margin-bottom: 8px;
            width: 98%;
            font-size: 0.95em;
        }
        .lease-table th, .lease-table td {
            border: 1px solid #cbd5e1;
            padding: 5px 6px;
        }
        .lease-table th {
            background: #2563eb;
            color: #fff;
        }
        .no-leases {
            color: #b91c1c;
            font-style: italic;
            font-size: 0.95em;
        }
        .lease-blocks {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .lease-block {
            background: #f3f4f6;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 8px 10px;
            margin-bottom: 2px;
            font-size: 0.97em;
        }
        .lease-block strong {
            color: #1e40af;
        }
    </style>
</head>
<body>
<div class="header">
    <span class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
    </span>
    <span class="title">Inventory Management System</span>
</div>
<div class="container">
    <h2>Inventory Discrepancy Report</h2>
    <table>
        <thead>
        <tr>
            <th>Item</th>
            <th>Initial Qty</th>
            <th>Current Qty</th>
            <th>Total Leased</th>
            <th>Missing</th>
            <th>Missing Lease Holders</th>
        </tr>
        </thead>
        <tbody>
        @foreach($items as $item)
            @php
                $missing = $item->initial_quantity - $item->quantity;
                $now = Carbon::now();
                $activeLeases = $item->leases->filter(function($lease) use ($now) {
                    return $lease->lease_until && $now->lessThanOrEqualTo($lease->lease_until);
                });
                $leased = $activeLeases->sum('quantity');
                $overdueLeases = $item->leases->filter(function($lease) use ($now) {
                    return $lease->lease_until && $now->greaterThan($lease->lease_until);
                });
            @endphp
            <tr>
                <td>{{ $item->name }}</td>
                <td>{{ $item->initial_quantity }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ $leased }}</td>
                <td>{{ $missing }}</td>
                <td>
                    @if($overdueLeases->count())
                        <div class="lease-blocks">
                            @foreach($overdueLeases as $lease)
                                <div class="lease-block">
                                    <strong>User:</strong> {{ $lease->user->name ?? 'N/A' }}<br>
                                    <strong>Email:</strong> {{ $lease->user->email ?? 'N/A' }}<br>
                                    <strong>Phone:</strong> {{ $lease->user->phone ?? 'N/A' }}<br>
                                    <strong>Qty:</strong> {{ $lease->quantity }}<br>
                                    <strong>Due Date:</strong> {{ Carbon::parse($lease->lease_until)->format('Y-m-d') }}
                                </div>
                            @endforeach
                        </div>
                    @else
                        <span class="no-leases">No missing lease holders</span>
                    @endif
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
</body>
</html>
