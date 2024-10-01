<?php

namespace App\Services;

use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Exception;

class EventService
{
    public function createEvent(array $data)
    {
        DB::beginTransaction();
        try {
            $event = Event::create([
                'title'       => $data['title'],
                'description' => $data['description'] ?? null,
                'start'       => $data['start'],
                'end'         => $data['end'],
                'date'        => $data['date'],
                'duration'    => $data['duration'] ?? null,
                'category'    => $data['category'] ?? null,
                'user_id'     => \Illuminate\Support\Facades\Auth::id(),
            ]);

            // Se houver participantes, associe ao evento
            if (!empty($data['participants'])) {
                $event->participants()->sync($data['participants']);
            }

            DB::commit();

            return $event;
        } catch (Exception $ex) {
            DB::rollback();
            throw $ex;
        }
    }

    public function updateEvent($userId, $eventId, array $data)
    {
        DB::beginTransaction();
        try {
            // Verifica se o evento pertence ao usuário
            $event = $this->getUserEventById($userId, $eventId);

            // Atualiza os dados do evento
            $event->update([
                'title'       => $data['title'],
                'description' => $data['description'] ?? null,
                'start'       => $data['start'],
                'end'         => $data['end'],
                'date'        => $data['date'],
                'duration'    => $data['duration'] ?? null,
                'category'    => $data['category'] ?? null,
            ]);

            // Se houver participantes, atualize a lista de participantes
            if (isset($data['participants'])) {
                $event->participants()->sync($data['participants']);
            }

            DB::commit();

            return $event;
        } catch (Exception $ex) {
            DB::rollback();
            throw $ex;
        }
    }

    public function deleteEvent($userId, $eventId)
    {
        DB::beginTransaction();
        try {
            // Verifica se o evento pertence ao usuário
            $event = $this->getUserEventById($userId, $eventId);

            // Exclui o evento
            $event->delete();

            DB::commit();
        } catch (Exception $ex) {
            DB::rollback();
            throw $ex;
        }
    }

    public function listEvents($userId)
    {
        try {
            return Event::where('user_id', $userId)->get();
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    public function getEvent($userId, $eventId)
    {
        try {
            return $this->getUserEventById($userId, $eventId);
        } catch (Exception $ex) {
            throw $ex;
        }
    }

    protected function getUserEventById($userId, $eventId)
    {
        $event = Event::where('id', $eventId)->where('user_id', $userId)->first();

        if (!$event) {
            throw new Exception("Evento não encontrado ou você não tem permissão para acessá-lo.");
        }

        return $event;
    }
}
