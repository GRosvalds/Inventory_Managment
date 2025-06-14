<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\IpHelper;
use App\Mail\LeaseRequestApprovedMail;
use App\Mail\LeaseRequestNotificationMail;
use App\Mail\LeaseRequestRejectedMail;
use App\Models\ActivityLog;
use App\Models\InventoryItem;
use App\Models\ItemLease;
use App\Models\LeaseRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LeaseRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $leaseRequests = LeaseRequest::with(['user', 'inventoryItem', 'approver'])
            ->orderBy('created_at', 'desc');
        $perPage = $request->query('perPage', 12);

        return response()->json($leaseRequests->paginate($perPage));
    }

    public function create(): JsonResponse
    {
        $items = InventoryItem::where('quantity', '>', 0)->get();
        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'inventory_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|integer|min:1',
            'requested_until' => 'required|date|after_or_equal:today',
            'purpose' => 'nullable|string|max:500',
        ]);

        $item = InventoryItem::findOrFail($validated['inventory_id']);
        if ($item->quantity <= 0) {
            return response()->json([
                'error' => 'No items available'
            ], Response::HTTP_BAD_REQUEST);
        }

        $leaseRequest = new LeaseRequest();
        $leaseRequest->user_id = $validated['user_id'];
        $leaseRequest->inventory_id = $validated['inventory_id'];
        $leaseRequest->quantity = $validated['quantity'];
        $leaseRequest->requested_until = $validated['requested_until'];
        $leaseRequest->purpose = $validated['purpose'] ?? null;
        $leaseRequest->status_id = LeaseRequest::PENDING;
        $leaseRequest->save();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'create',
            'description' => "Created lease request for item: ID-$item->id $item->name",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);

        $moderators = User::whereHas('roles', function($q) {
            $q->where('name', 'moderator');
        })->get();

        $requestingUser = User::find($validated['user_id']);

        foreach ($moderators as $moderator) {
            Mail::to($moderator->email)->send(
                new LeaseRequestNotificationMail($leaseRequest, $requestingUser)
            );
        }

        return response()->json([
            'success' => 'Lease request submitted successfully',
            'lease_request' => $leaseRequest
        ], Response::HTTP_CREATED);
    }

    public function show(LeaseRequest $leaseRequest): JsonResponse
    {
        $leaseRequest->load(['user', 'inventoryItem', 'approver']);
        return response()->json($leaseRequest);
    }

    public function approve(Request $request, LeaseRequest $leaseRequest): JsonResponse
    {
        $item = InventoryItem::findOrFail($leaseRequest->inventory_id);

        if ($item->quantity <= 0) {
            return response()->json([
                'error' => 'No items available to approve this request'
            ], Response::HTTP_BAD_REQUEST);
        }

        $leaseRequest->status_id = LeaseRequest::APPROVED;
        $leaseRequest->approved_at = now();
        $leaseRequest->approved_by = Auth::id();
        $leaseRequest->save();

        ItemLease::create([
            'user_id' => $leaseRequest->user_id,
            'inventory_item_id' => $leaseRequest->inventory_id,
            'lease_until' => $leaseRequest->requested_until,
            'quantity' => $leaseRequest->quantity,
        ]);

        $item->quantity -= $leaseRequest->quantity;
        $item->save();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'create',
            'description' => "Approved lease request for item: ID-$item->id $item->name, to user ID-$leaseRequest->user_id",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);

        Mail::to($leaseRequest->user->email)->send(new LeaseRequestApprovedMail($leaseRequest));

        return response()->json(['success' => 'Lease request approved successfully']);
    }

    public function reject(Request $request, LeaseRequest $leaseRequest): JsonResponse
    {
        $leaseRequest->status_id = LeaseRequest::REJECTED;
        $leaseRequest->save();

        $item = InventoryItem::findOrFail($leaseRequest->inventory_id);

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'create',
            'description' => "Rejected lease request for item: ID-$item->id $item->name, to user ID-$leaseRequest->user_id",
            'ip_address' => IpHelper::getClientIp($request),
            'user_agent' => $request->header('User-Agent'),
        ]);

        Mail::to($leaseRequest->user->email)->send(new LeaseRequestRejectedMail($leaseRequest));

        return response()->json(['success' => 'Lease request rejected']);
    }

    public function myRequests(): JsonResponse
    {
        $leaseRequests = LeaseRequest::with(['inventoryItem'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($leaseRequests);
    }

    public function destroy(int $id): JsonResponse
    {
        $leaseRequest = LeaseRequest::findOrFail($id);

        $leaseRequest->delete();

        $userId = Auth::id();

        ActivityLog::create([
            'user_id' => $userId,
            'action' => 'delete',
            'description' => "Deleted lease request ID-$leaseRequest->id",
            'ip_address' => IpHelper::getClientIp(request()),
            'user_agent' => request()->header('User-Agent'),
        ]);

        return response()->json(['success' => 'Lease request deleted successfully'], Response::HTTP_NO_CONTENT);
    }
}
