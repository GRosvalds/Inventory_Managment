<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::query();

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

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'category' => 'nullable|string|max:255',
            'estimated_price' => 'nullable|numeric',
        ]);

        $item = InventoryItem::create($validatedData);
        return response()->json($item, 201);
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
        $item->update($validatedData);
        return response()->json($item);
    }

    public function destroy($id)
    {
        InventoryItem::destroy($id);
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function lease(Request $request, $id)
    {
        $validatedData = $request->validate([
            'userId' => 'required|exists:users,id',
            'leaseDuration' => 'required|date',
        ]);

        $item = InventoryItem::findOrFail($id);
        $item->users()->attach($validatedData['userId'], ['lease_until' => $validatedData['leaseDuration']]);

        return response()->json($item);
    }

    public function getUserLeasedItems($id)
    {
        $user = User::findOrFail($id);
        $leasedItems = $user->inventoryItems()->withPivot('lease_until')->get();

        return response()->json($leasedItems);
    }
}
