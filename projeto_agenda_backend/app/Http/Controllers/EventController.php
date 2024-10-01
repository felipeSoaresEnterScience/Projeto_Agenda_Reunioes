<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\EventService;
use App\Traits\ErrorResponseTrait;
use Exception;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    protected $eventService;

    use ErrorResponseTrait;

    public function store(Request $request)
    {


        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'start'       => 'required|date',
            'end'         => 'required|date',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'duration'    => 'nullable|integer',
            'category'    => 'nullable|string',
            'participants' => 'nullable|array',  // Lista de IDs de usuários participantes
        ]);

        try {
            $event = $this->eventService->createEvent($validatedData);

            return response()->json([
                'result' => true,
                'data'   => $event,
            ], 201);
        } catch (Exception $ex) {
            return $this->handleException($ex, 'Erro ao criar o evento', 501);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'start'       => 'required|date',
            'end'         => 'required|date',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'duration'    => 'nullable|integer',
            'category'    => 'nullable|string',
            'participants' => 'nullable|array',  
        ]);

        try {
            $event = $this->eventService->updateEvent(Auth::user()->id, $id, $validatedData);

            return response()->json([
                'result' => true,
                'data'   => $event,
            ], 200);
        } catch (Exception $ex) {
            return $this->handleException($ex, 'Erro ao atualizar o evento', 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->eventService->deleteEvent(Auth::user()->id, $id);

            return response()->json([
                'result' => true,
                'message' => 'Evento deletado com sucesso',
            ], 200);
        } catch (Exception $ex) {
            return $this->handleException($ex, 'Erro ao deletar o evento', 500);
        }
    }

    public function index()
    {
        try {
            $events = $this->eventService->listEvents(Auth::user()->id);

            return response()->json([
                'result' => true,
                'data'   => $events,
            ], 200);
        } catch (Exception $ex) {
            return $this->handleException($ex, 'Erro ao listar os eventos', 500);
        }
    }


    public function show($id)
    {
        try {
            $event = $this->eventService->getEvent(Auth::user()->id, $id);

            return response()->json([
                'result' => true,
                'data'   => $event,
            ], 200);
        } catch (Exception $ex) {
            return $this->handleException($ex, 'Erro ao buscar o evento', 500);
        }
    }

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

}
