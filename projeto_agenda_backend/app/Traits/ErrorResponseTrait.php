<?php

namespace App\Traits;

use Exception;
use Illuminate\Support\Facades\DB;

trait ErrorResponseTrait
{
    /**
     * Handles exceptions by rolling back the database transaction and returning a JSON response.
     *
     * @param Exception $ex The exception that was thrown.
     * @param string $message A custom message to include in the response.
     * @param int $status The HTTP status code to return.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the error details.
     */
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