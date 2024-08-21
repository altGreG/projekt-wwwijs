from flask import render_template, request
from flask_socketio import SocketIO, emit, join_room

socketio = SocketIO( logger=True, engineio_logger=True)


rooms = {}

def determine_winner(player1_choice, player2_choice):
    outcomes = {
        'rock': 'scissors',
        'scissors': 'paper',
        'paper': 'rock'
    }
    if player1_choice == player2_choice:
        return 'Draw'
    elif outcomes[player1_choice] == player2_choice:
        return 'Player 1 wins'
    else:
        return 'Player 2 wins'

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    
    if room not in rooms:
        rooms[room] = {}
    
    if len(rooms[room]) < 2:
        join_room(room)
        rooms[room][username] = None  # Rejestracja gracza w pokoju, ale bez ruchu
        emit('message', {'msg': f'{username} has entered the room.'}, room=room)
    else:
        emit('message', {'msg': f'Room {room} is full. Cannot join.'})

@socketio.on('play')
def on_play(data):
    username = data['username']
    room = data['room']
    player_move = data['move']
    
    if room in rooms and username in rooms[room]["players"]:
        rooms[room]["players"][username] = player_move
        
        # Sprawdź, czy oba ruchy są gotowe
        if len(rooms[room]["players"]) == 2 and all(move is not None for move in rooms[room]["players"].values()):
            players = list(rooms[room]["players"].keys())
            moves = list(rooms[room]["players"].values())
            result_text, winner = determine_winner(players[0], moves[0], players[1], moves[1])

            # Aktualizacja wyników
            if winner == players[0]:
                rooms[room]["scores"][players[0]] += 1
            elif winner == players[1]:
                rooms[room]["scores"][players[1]] += 1

            # Emitowanie bieżących wyników
            emit('result', {
                'player1': players[0],
                'move1': moves[0],
                'player2': players[1],
                'move2': moves[1],
                'result': result_text,
                'score1': rooms[room]["scores"][players[0]],
                'score2': rooms[room]["scores"][players[1]],
                'game_over': False
            }, room=room)

            # Sprawdzenie, czy któryś z graczy wygrał
            if rooms[room]["scores"][players[0]] == 3:
                final_result = f'{players[0]} wins the game!'
                emit('result', {
                    'player1': players[0],
                    'move1': moves[0],
                    'player2': players[1],
                    'move2': moves[1],
                    'result': final_result,
                    'score1': rooms[room]["scores"][players[0]],
                    'score2': rooms[room]["scores"][players[1]],
                    'game_over': True
                }, room=room)
                reset_room(room)
            elif rooms[room]["scores"][players[1]] == 3:
                final_result = f'{players[1]} wins the game!'
                emit('result', {
                    'player1': players[0],
                    'move1': moves[0],
                    'player2': players[1],
                    'move2': moves[1],
                    'result': final_result,
                    'score1': rooms[room]["scores"][players[0]],
                    'score2': rooms[room]["scores"][players[1]],
                    'game_over': True
                }, room=room)
                reset_room(room)
            else:
                # Reset ruchów dla kolejnej rundy
                rooms[room]["players"] = {player: None for player in rooms[room]["players"]}
    else:
        emit('message', {'msg': 'Unrecognized player or room.'})

if __name__ == '__main__':
    socketio.run(app, debug=True)
