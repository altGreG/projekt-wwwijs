from flask import Blueprint, render_template, request, redirect, url_for
from flask_socketio import emit, join_room
from flask import json
from . import socketio
from flask_cors import CORS, cross_origin

bp = Blueprint('main', __name__)

# Lista możliwych wyborów
CHOICES = [
    "rock", "fire", "scissors", "snake", "human", "tree", "wolf", "sponge", 
    "paper", "air", "water", "dragon", "devil", "lightning", "gun"
]

# Definicje wyników (kto wygrywa z kim)
WINNING_RELATIONS = {
    "rock": ["scissors", "snake", "human", "tree", "wolf", "sponge"],
    "fire": ["scissors", "paper", "snake", "human", "tree", "wolf"],
    "scissors": ["paper", "snake", "human", "tree", "wolf", "sponge"],
    "snake": ["human", "tree", "wolf", "sponge", "paper", "water"],
    "human": ["tree", "wolf", "sponge", "paper", "air", "water"],
    "tree": ["wolf", "sponge", "paper", "air", "water", "dragon"],
    "wolf": ["sponge", "paper", "air", "water", "dragon", "devil"],
    "sponge": ["paper", "air", "water", "dragon", "devil", "lightning"],
    "paper": ["air", "water", "dragon", "devil", "lightning", "gun"],
    "air": ["water", "dragon", "devil", "lightning", "gun", "rock"],
    "water": ["dragon", "devil", "lightning", "gun", "rock", "fire"],
    "dragon": ["devil", "lightning", "gun", "rock", "fire", "scissors"],
    "devil": ["lightning", "gun", "rock", "fire", "scissors", "snake"],
    "lightning": ["gun", "rock", "fire", "scissors", "snake", "human"],
    "gun": ["rock", "fire", "scissors", "snake", "human", "tree"]
}

# TODO: Zrobilić listę gdzie sprawdzamy czy użytkownik już w którymś pokoju może być poprzez liste users, 
# do której dopisujemy go, gdy gracza przypiszey do numeru pokoju w liście rooms,
#  ew. można sprawdzać w samym rooms, ale tak będzie łatwiej
users = []

rooms = {}

rounds = {}

def determine_winner(player1_name, player1_choice, player2_name, player2_choice):
    if player1_choice == player2_choice:
        return 'Draw', None
    elif player2_choice in WINNING_RELATIONS[player1_choice]:
        return f'{player1_name}', player1_name
    else:
        return f'{player2_name}', player2_name


# @bp.route('/', methods=['GET', 'POST'])
# # @cross_origin(origin='*')
# def index():
#     if request.method == 'POST':
#         username = request.form['username']
#         room = request.form['room']
#         return redirect(url_for('main.room', room=room, username=username))
#     return render_template('index.html')

@bp.route('/room', methods=['POST'])
# @cross_origin(origin='*')
# def room():
#     username = request.form['username']
#     room = request.form['room']
#     return render_template('room.html', username=username, room=room)

#TODO: Dane przyjmujemy w postaci jsona i w takiej również zwracamy, zwracamy:
#   - czy utworzono pokój, jeśli nie to dlatego że gracz o tym nicku już jest przypisany
#   - nick gracza
#   - numer pokoju, wygenerowany losowo przez serwer lub wpisany przez samego użytkownika, ja bym wolał by serwer przydzielał
def room():
    username = request.json['username']
    room = request.json['room']
    notexists=True
    if room in rooms:
        notexists=False
    if (notexists):
        rooms[room] = {"players": {}, "scores": {}}
        rounds[room] = 0
    response = json.jsonify({'roomCreated': notexists,
                             'username': username,
                             'room': room})
    response.headers.add('Access-Control-Allow-Origin', '*')
    

    # TODO: Jeśli użytkownik nie jest przypisany zwracamy response powyżej, dodajemy go do list users, rooms, wraz 
    # z wygenerowanym numerem pokoju
    #  w przeciwnym wypadku roomCreated ma wartość false

    # Trochę napisane ale nie działa, zmienne nie chce odczytać, nie ma generowania
    # if username not in users {
    #     users.append()
    #     return response
    # }else {
    #        response = json.jsonify({'roomCreated': 'false',
    #                        'username': username,
    #                       'room': room})
    #     response.headers.add('Access-Control-Allow-Origin', '*')
    #     return response;
    # }

    return response

# @bp.route('/game/<room>/<username>', methods=['POST'])
# def game(room, username):
#     return render_template('game.html', username=username, room=room)

@socketio.on('join')
# @cross_origin(origin='*')
def on_join(data):
    username = data['username']
    room = data['room']
    exists=False
    if room in rooms:
        exists=True
    """
        rooms[room] = {"players": {}, "scores": {}}
        rounds["room"] = 0
    """
    if (exists):
        if len(rooms[room]["players"]) == 2:
            emit('error', {'msg': f'Room {room} is full. You cannot join.'}, to=request.sid)
        if len(rooms[room]["players"]) < 2:
            
            join_room(room)
            rooms[room]["players"][username] = None
            rooms[room]["scores"][username] = 0
            emit('message', {'msg': f'{username} has entered the room.'}, room=room)

            if len(rooms[room]["players"]) == 2:

                for i, (key, value) in enumerate(rooms[room]["players"].items()):
                    if i == 0:
                        player1 = key
                    elif i == 1:
                        player2 = key
                emit('secondPlayer', {'player1': player1, 'player2': player2}, room=room)
    else:
        emit('error', {'msg': f'Room {room} doesn\'t exist.'}, to=request.sid)




@socketio.on('on_play')
def on_play(data):
    username = data['username']
    room = data['room']
    player_move = data['playerMove']
    
    if room in rooms and username in rooms[room]["players"]:
        rooms[room]["players"][username] = player_move
        
        if len(rooms[room]["players"]) == 2 and all(move is not None for move in rooms[room]["players"].values()):
            players = list(rooms[room]["players"].keys())
            moves = list(rooms[room]["players"].values())
            result_text, winner = determine_winner(players[0], moves[0], players[1], moves[1])
            rounds[room] = rounds[room] + 1
            print (room + " rund  " )
            print ( rounds[room])
            print (rounds)
            if winner == players[0]:
                rooms[room]["scores"][players[0]] += 1
            elif winner == players[1]:
                rooms[room]["scores"][players[1]] += 1

            # Emitowanie wyników
            emit('result', {
                'player1': players[0],
                'move1': moves[0],
                'player2': players[1],
                'move2': moves[1],
                'winner': result_text,
                'score1': rooms[room]["scores"][players[0]],
                'score2': rooms[room]["scores"][players[1]],
                'game_over': False,
                'round_number': rounds[room]
            }, room=room)

            # Sprawdzenie, czy któryś z graczy wygrał
            if rooms[room]["scores"][players[0]] == 3:
                final_result = f'{players[0]}'
                emit('result', {
                    'player1': players[0],
                    'move1': moves[0],
                    'player2': players[1],
                    'move2': moves[1],
                    'result': final_result,
                    'score1': rooms[room]["scores"][players[0]],
                    'score2': rooms[room]["scores"][players[1]],
                    'game_over': True,
                    'round_number': rounds[room]
                }, room=room)
                reset_room(room)
            elif rooms[room]["scores"][players[1]] == 3:
                final_result = f'{players[1]}'
                emit('result', {
                    'player1': players[0],
                    'move1': moves[0],
                    'player2': players[1],
                    'move2': moves[1],
                    'result': final_result,
                    'score1': rooms[room]["scores"][players[0]],
                    'score2': rooms[room]["scores"][players[1]],
                    'game_over': True,
                    'round_number': rounds[room]
                }, room=room)
                reset_room(room)
            else:
                rooms[room]["players"] = {player: None for player in rooms[room]["players"]}
    else:
        emit('result', {'msg': 'Unrecognized player or room.'})

def reset_room(room):
    if room in rooms:
        rooms[room]["players"] = {}
        rooms[room]["scores"] = {}
