import eventlet
eventlet.monkey_patch()

from flask import Flask, request,jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS
import time
from summarize import writeSummary,init_summarizer
from ranker import rank_media,rank_media_yt
from finder import get_results

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app,cors_allowed_origins="*")

summarizer = None
device = None

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("connect",{"data":f"id: {request.sid} is connected"})

@socketio.on("paras")
def handle_message(data):
    """event listener when client types a message"""
    for val in data:
        data=data[val]
    articlelinks, redditlinks, youtubelinks = get_results(data)
    links = [x[1] for x in articlelinks]
    ytlink= rank_media_yt(youtubelinks, data)
    result = writeSummary(summarizer,device,rank_media(links, data))
    emit('paras', {'para': result,"youtubelinks":ytlink, "redditlinks": redditlinks,"articlelinks":articlelinks})

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

if __name__ == '__main__':
    summarizer,device =init_summarizer()
    socketio.run(app, debug=False,port=5001)
