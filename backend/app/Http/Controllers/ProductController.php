<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(): JsonResponse
    {
        $products = Product::all();
        return response()->json($products, 200);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:products,id',
            'name' => 'required|string|max:255',
            'tag' => 'nullable|string',
            'type' => 'required|string',
            'tagline' => 'required|string',
            'description' => 'required|string',
            'rating' => 'numeric|min:0|max:5',
            'reviewsCount' => 'integer|min:0',
            'baseWeight' => 'required|string',
            'prices' => 'required|array',
            'nutrition' => 'required|array',
            'ingredients' => 'required|array',
            'reviews' => 'array',
            'image' => 'required|string',
            'color' => 'required|string',
            'bgGradient' => 'required|string',
        ]);

        $product = Product::create([
            'id' => $validated['id'],
            'name' => $validated['name'],
            'tag' => $validated['tag'] ?? null,
            'type' => $validated['type'],
            'tagline' => $validated['tagline'],
            'description' => $validated['description'],
            'rating' => $validated['rating'] ?? 5.0,
            'reviewsCount' => $validated['reviewsCount'] ?? 0,
            'baseWeight' => $validated['baseWeight'],
            'prices' => $validated['prices'],
            'nutrition' => $validated['nutrition'],
            'ingredients' => $validated['ingredients'],
            'reviews' => $validated['reviews'] ?? [],
            'image' => $validated['image'],
            'color' => $validated['color'],
            'bgGradient' => $validated['bgGradient'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully!',
            'product' => $product
        ], 201);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'tag' => 'nullable|string',
            'type' => 'sometimes|required|string',
            'tagline' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'rating' => 'numeric|min:0|max:5',
            'reviewsCount' => 'integer|min:0',
            'baseWeight' => 'sometimes|required|string',
            'prices' => 'sometimes|required|array',
            'nutrition' => 'sometimes|required|array',
            'ingredients' => 'sometimes|required|array',
            'reviews' => 'array',
            'image' => 'sometimes|required|string',
            'color' => 'sometimes|required|string',
            'bgGradient' => 'sometimes|required|string',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully!',
            'product' => $product
        ], 200);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully!'
        ], 200);
    }
}
