<?php

// app/Models/Event.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'start',
        'end',
        'date',
        'duration',
        'category',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'event_participant');
    }
}
