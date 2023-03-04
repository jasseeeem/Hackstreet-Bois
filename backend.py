from flask import Flask, redirect, url_for, request
from flask_cors import CORS, cross_origin
from finder import get_results
from ranker import rank_media
from summarize import writeSummary

app = Flask(__name__)
CORS(app)

@app.route('/success/<name>')
def success(name):
   return 'welcome %s' % name

@app.route('/getresult',methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
      query = request.form['query']
      query = query.split(",")
      links, redditlinks, youtubelinks = get_results(query)
      result = writeSummary(rank_media(links, query))
      ytlink= rank_media(youtubelinks, query)
      return {"status":"OK","title":"Title","description":"Description","result":result,"youtubelink":ytlink, "redditlink": redditlinks} , 200

if __name__ == '__main__':
   app.run(host='localhost', port=1212)