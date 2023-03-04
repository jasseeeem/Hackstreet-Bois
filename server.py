import eventlet
eventlet.monkey_patch()

from flask import Flask, request,jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS
import time
from summarize import writeSummary


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app,cors_allowed_origins="*")

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("connect",{"data":f"id: {request.sid} is connected"})

@socketio.on("paras")
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ",str(data))
    for i in range(3):
        result = writeSummary(rank_media(links, query))
        emit('paras', {'para': result})
        print('Message ' + str(i))
        time.sleep(30)

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=False,port=5001)