<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'tag',
        'type',
        'tagline',
        'description',
        'rating',
        'reviewsCount',
        'baseWeight',
        'prices',
        'nutrition',
        'ingredients',
        'reviews',
        'image',
        'color',
        'bgGradient'
    ];

    protected $casts = [
        'prices' => 'array',
        'nutrition' => 'array',
        'ingredients' => 'array',
        'reviews' => 'array',
        'rating' => 'float',
        'reviewsCount' => 'integer'
    ];
}
