<?php

namespace App\Traits;

use Exception;
use Illuminate\Support\Facades\DB;

trait ErrorResponseTrait
{
    protected function handleException(Exception $ex, $message, $status)
    {
        DB::rollback();
        return response()->json([
            'result'  => false,
            'data'    => [],
            'raw'     => $ex->getMessage(),
            'message' => $message,
            'debug'   => [
                'file'  => $ex->getFile(),
                'line'  => $ex->getLine(),
                'trace' => $ex->getTrace(),
            ],
        ], $status, [], JSON_PRETTY_PRINT);
    }

    
}