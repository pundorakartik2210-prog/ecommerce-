<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'email',
        'phone',
        'cart',
        'total',
        'statusStep',
        'payment_method',
        'payment_id'
    ];

    protected $casts = [
        'cart' => 'array',
        'total' => 'float',
        'statusStep' => 'integer'
    ];
}
