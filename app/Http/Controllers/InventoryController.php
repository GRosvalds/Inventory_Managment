<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\ItemLease;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::query();
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
        $item->update($validatedData);
        return response()->json($item);
    }

    public function destroy($id)
    {
        InventoryItem::destroy($id);
        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function getUserLeasedItems(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $leasedItems = ItemLease::where('user_id', $user->id)->with('item');
        $perPage = $request->query('perPage', 12);

        return response()->json($leasedItems->paginate($perPage));
    }
}
