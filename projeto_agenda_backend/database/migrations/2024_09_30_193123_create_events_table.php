<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('start');
            $table->dateTime('end');
            $table->date('date');
            $table->integer('duration')->nullable();
            $table->string('category')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relacionamento com usuários
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
}
