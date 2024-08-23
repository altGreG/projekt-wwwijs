from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO(logger=True, engineio_logger=True)

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'secret!'

    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    socketio.init_app(app)
    return app
