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
    
    if room in rooms and username in rooms[room]:
        rooms[room][username] = player_move  # Zapisanie ruchu gracza
        
        # Logowanie ruchu gracza
        print(f'Player {username} in room {room} played {player_move}')
        
        # Sprawdzanie, czy obaj gracze wykonali ruch
        if len(rooms[room]) == 2 and all(move is not None for move in rooms[room].values()):
            players = list(rooms[room].keys())
            moves = list(rooms[room].values())
            result = determine_winner(moves[0], moves[1])
            
            # Logowanie wyniku gry
            print(f'Result: {players[0]} played {moves[0]}, {players[1]} played {moves[1]} - {result}')
            
            # Wysłanie wyniku do obu graczy w pokoju
            emit('result', {
                'player1': players[0], 
                'move1': moves[0], 
                'player2': players[1], 
                'move2': moves[1], 
                'result': result
            }, room=room)
            
            # Resetowanie ruchów w pokoju po zakończeniu gry
            rooms[room] = {player: None for player in rooms[room]}
    else:
        emit('message', {'msg': 'Unrecognized player or room.'})

if __name__ == '__main__':
    socketio.run(app, debug=True)
