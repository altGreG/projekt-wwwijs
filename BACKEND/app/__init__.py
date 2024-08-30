from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS, cross_origin

socketio = SocketIO(logger=True, engineio_logger=True, cors_allowed_origins='*', cors_credentials=False)

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'secret!'

    CORS(app)
    


    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)

    socketio.init_app(app)
    return app
