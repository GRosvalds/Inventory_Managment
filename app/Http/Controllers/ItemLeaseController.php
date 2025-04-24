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
            'lease_until' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lease = ItemLease::create($request->all());

        $item->quantity -= 1;
        $item->save();

        return response()->json($lease, 201);
    }

    public function update(Request $request, $id)
    {
        $lease = ItemLease::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'lease_until' => 'sometimes|required|date',
            'notes' => 'nullable|string|max:500'
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
}
