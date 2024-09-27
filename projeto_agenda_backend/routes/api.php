<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;


Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/recoverpassword', [UserController::class, 'recoverPassword']);

// Rota privada para verificar o token e confirmar informações do usuário
Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/verify', [UserController::class, 'verifyUser']);

});

