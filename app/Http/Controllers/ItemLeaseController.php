<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\IpHelper;
use App\Mail\LeaseReturnedNotificationMail;
use App\Models\ActivityLog;
use App\Models\ItemLease;
use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ItemLeaseController extends Controller
{
    public function index(Request $request)
    {
        $leases = ItemLease::with(['user', 'item']);
        $perPage = $request->query('perPage', 12);

        return response()->json($leases->paginate($perPage));
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

        $item->quantity -= $lease->quantity;
        $item->save();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'create',
            'description' => "Leased inventory item: ID-{$lease->id} {$item->name} to user ID-{$lease->user_id}",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);

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

        $originalValues = $lease->toArray();

        $lease->update($request->all());

        $changes = [];
        foreach ($request->all() as $key => $newValue) {
            if (isset($originalValues[$key]) && $originalValues[$key] != $newValue) {
                if ($key === 'lease_until') {
                    $oldDate = date('Y-m-d', strtotime($originalValues[$key]));
                    $newDate = date('Y-m-d', strtotime($newValue));
                    $changes[] = "$key: '$oldDate' → '$newDate'";
                } else {
                    $changes[] = "$key: '{$originalValues[$key]}' → '$newValue'";
                }
            }
        }

        $changeLog = !empty($changes) ? " Changes: " . implode(", ", $changes) : "";

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'update',
            'description' => "Updated lease: ID-{$lease->id} for item {$item->name}.$changeLog",
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent'),
        ]);

        return response()->json($lease);
    }

    public function destroy(Request $request, $id)
    {
        $lease = ItemLease::findOrFail($id);
        $lease->delete();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'delete',
            'description' => "Deleted lease: ID-$lease->id",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);

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

    public function returnLeasedItem(Request $request, int $id)
    {
        $lease = ItemLease::findOrFail($id);
        $item = InventoryItem::findOrFail($lease->inventory_item_id);

        $item->quantity += $lease->quantity;
        $item->save();

        $lease->delete();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'delete',
            'description' => "Deleted/Returned lease: ID-$lease->id",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);

        $moderators = User::whereHas('roles', function($q) {
            $q->where('name', 'moderator');
        })->get();

        $returningUser = User::find($userId);

        foreach ($moderators as $moderator) {
            Mail::to($moderator->email)->send(
                new LeaseReturnedNotificationMail($item, $lease, $returningUser)
            );
        }

        return response()->json(null, 204);
    }
}
