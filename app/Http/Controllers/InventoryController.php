<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\IpHelper;
use App\Models\ActivityLog;
use App\Models\InventoryItem;
use App\Models\ItemLease;
use App\Models\LeaseRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::query()->whereNull('deleted_at');
        $perPage = $request->query('perPage', 12);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%')
                    ->orWhere('quantity', 'like', '%' . $search . '%')
                    ->orWhere('category', 'like', '%' . $search . '%')
                    ->orWhere('estimated_price', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort);
        }

        return response()->json($query->paginate($perPage));
    }

    public function createItem(Request $request): Response
    {
        // Tiek pievienota validācija
        $validatedData = $request->validate([
            InventoryItem::NAME => 'required|string|max:255',
            InventoryItem::DESCRIPTION => 'nullable|string',
            InventoryItem::INITIAL_QUANTITY => 'required|integer',
            InventoryItem::QUANTITY => 'required|integer',
            InventoryItem::CATEGORY => 'nullable|string|max:255',
            InventoryItem::ESTIMATED_PRICE => 'nullable|numeric',
        ]);

        // Tiek izveidots inventory item
        $item = InventoryItem::create($validatedData);

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'create',
            'description' => 'created inventory item: ID-' . $item->id . ' Item Name: ' . $item->name,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json($item, Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'category' => 'nullable|string|max:255',
            'estimated_price' => 'nullable|numeric',
        ]);

        $item = InventoryItem::findOrFail($id);

        $originalValues = $item->toArray();

        $item->update($validatedData);

        $changes = [];
        foreach ($validatedData as $key => $newValue) {
            $oldValue = $originalValues[$key];
            if ($oldValue != $newValue) {
                $changes[] = "$key: '$oldValue' → '$newValue'";
            }
        }

        $changeLog = !empty($changes) ? " Changes: " . implode(", ", $changes) : "";

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'update',
            'description' => "Updated inventory item: ID-{$item->id} {$item->name}.$changeLog",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json($item);
    }

    public function destroy(Request $request, $id)
    {
        $item = InventoryItem::findOrFail($id);
        $item->deleted_at = now();
        $item->save();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'delete',
            'description' => "Deleted inventory item: ID-$item->id $item->name",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);
        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function getUserLeasedItems(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $leasedItems = ItemLease::where('user_id', $user->id)->with('item');
        $perPage = $request->query('perPage', 12);

        return response()->json($leasedItems->paginate($perPage));
    }

    public function getUserPendingLeases(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $pendingLeases = LeaseRequest::where('user_id', $user->id)
            ->where('status_id', '=', 1)
            ->with('inventoryItem');
        $perPage = $request->query('perPage', 12);

        return response()->json($pendingLeases->paginate($perPage));
    }
}
