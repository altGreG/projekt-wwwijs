from flask import Blueprint, render_template, request, redirect, url_for
from flask_socketio import emit, join_room
from . import socketio

bp = Blueprint('main', __name__)

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

@bp.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form['username']
        room = request.form['room']
        return redirect(url_for('main.room', room=room, username=username))
    return render_template('index.html')

@bp.route('/room', methods=['POST'])
def room():
    username = request.form['username']
    room = request.form['room']
    return render_template('room.html', username=username, room=room)

@bp.route('/game/<room>/<username>', methods=['POST'])
def game(room, username):
    return render_template('game.html', username=username, room=room)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    
    if room not in rooms:
        rooms[room] = {}
    
    if len(rooms[room]) < 2:
        join_room(room)
        rooms[room][username] = None
        emit('message', {'msg': f'{username} has entered the room.'}, room=room)
    else:
        emit('message', {'msg': f'Room {room} is full. Cannot join.'})

@socketio.on('play')
def on_play(data):
    username = data['username']
    room = data['room']
    player_move = data['move']
    
    if room in rooms and username in rooms[room]:
        rooms[room][username] = player_move
        
        if len(rooms[room]) == 2 and all(move is not None for move in rooms[room].values()):
            players = list(rooms[room].keys())
            moves = list(rooms[room].values())
            result = determine_winner(moves[0], moves[1])
            
            emit('result', {
                'player1': players[0],
                'move1': moves[0],
                'player2': players[1],
                'move2': moves[1],
                'result': result
            }, room=room)
            
            rooms[room] = {player: None for player in rooms[room]}
    else:
        emit('message', {'msg': 'Unrecognized player or room.'})
