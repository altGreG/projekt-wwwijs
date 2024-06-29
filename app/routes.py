from flask import Blueprint, render_template, redirect, url_for, request

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/room', methods=['POST'])
def room():
    username = request.form['username']
    room = request.form['room']
    return redirect(url_for('main.game', username=username, room=room))

@bp.route('/game/<username>/<room>')
def game(username, room):
    return render_template('game.html', username=username, room=room)
