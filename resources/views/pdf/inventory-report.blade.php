<!DOCTYPE html>
<html>
<head>
    <title>Inventory Report</title>
    <style>
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 5px; }
    </style>
</head>
<body>
<h2>Inventory Report</h2>
<table>
    <thead>
    <tr>
        <th>Item</th>
        <th>Initial Quantity</th>
        <th>Current Quantity</th>
        <th>Total Leased</th>
        <th>Missing</th>
    </tr>
    </thead>
    <tbody>
    @foreach($items as $item)
        @php
            $missing = $item->initial_quantity - $item->quantity;
            $leased = $item->leases->sum('quantity');
        @endphp
        <tr>
            <td>{{ $item->name }}</td>
            <td>{{ $item->initial_quantity }}</td>
            <td>{{ $item->quantity }}</td>
            <td>{{ $leased }}</td>
            <td>{{ $missing }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
