from flask import Flask, redirect, url_for, request
from flask_cors import CORS, cross_origin
from finder import get_results
from ranker import rank_media

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
      links, redditlinks = get_results(query)
      result = rank_media(links, query)
      return {"status":"OK","title":"Title","descrpition":"Description","result":result} , 200
   if request.method == 'GET':
      query = request.args.get('query')
      query = query.split("-")
      result = rank_media(get_results(query), query)
      return {"status":"OK","title":"Title","descrpition":"Description","result":result} , 200

if __name__ == '__main__':
   app.run(host='localhost', port=1212)