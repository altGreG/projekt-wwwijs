from flask_socketio import emit, join_room, leave_room
from . import socketio

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
    join_room(room)
    if room not in rooms:
        rooms[room] = {}
    rooms[room][username] = None
    emit('message', {'msg': f'{username} has entered the room.'}, room=room)

@socketio.on('play')
def on_play(data):
    room = data['room']
    username = data['username']
    player_move = data['move']
    
    print(f'{username} in room {room} played {player_move}')
    
    rooms[room][username] = player_move
    emit('play', {'username': username, 'move': player_move}, room=room)

    if len(rooms[room]) == 2 and all(move is not None for move in rooms[room].values()):
        players = list(rooms[room].keys())
        moves = list(rooms[room].values())
        result = determine_winner(moves[0], moves[1])
        print(f'Game result in room {room}: {players[0]} played {moves[0]}, {players[1]} played {moves[1]}. Result: {result}')
        emit('result', {
            'player1': players[0], 
            'move1': moves[0], 
            'player2': players[1], 
            'move2': moves[1], 
            'result': result
        }, room=room)
        rooms[room] = {player: None for player in rooms[room]}
