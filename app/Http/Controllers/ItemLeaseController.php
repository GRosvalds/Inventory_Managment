<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\ItemLease;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ItemLeaseController extends Controller
{
    public function index()
    {
        $leases = ItemLease::with(['user', 'item'])->get();

        return response()->json($leases);
    }

    public function show($id)
    {
        $lease = ItemLease::with(['user', 'item'])->findOrFail($id);

        return response()->json($lease);
    }

    public function store(Request $request)
    {
        $item = InventoryItem::findOrFail($request->inventory_item_id);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|integer|min:1|max:' . $item->quantity,
            'lease_until' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lease = ItemLease::create($request->all());

        $item->quantity -= $item->quantity;
        $item->save();

        return response()->json($lease, 201);
    }

    public function update(Request $request, $id)
    {
        $lease = ItemLease::findOrFail($id);
        $item = InventoryItem::findOrFail($request->inventory_item_id);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|integer|min:1|' . $item->quantity,
            'lease_until' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lease->update($request->all());

        return response()->json($lease);
    }

    public function destroy($id)
    {
        $lease = ItemLease::findOrFail($id);
        $lease->delete();

        return response()->json(null, 204);
    }

    public function userLeases($userId)
    {
        $leases = ItemLease::with('item')
            ->where('user_id', $userId)
            ->get();

        return response()->json($leases);
    }

    public function itemLeases($itemId)
    {
        $leases = ItemLease::with('user')
            ->where('inventory_item_id', $itemId)
            ->get();

        return response()->json($leases);
    }

    public function returnLeasedItem(int $id)
    {
        $lease = ItemLease::findOrFail($id);
        $item = InventoryItem::findOrFail($lease->inventory_item_id);

        $item->quantity += $lease->quantity;
        $item->save();

        $lease->delete();

        return response()->json(null, 204);
    }
}
