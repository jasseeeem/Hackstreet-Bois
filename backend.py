from flask import Flask, redirect, url_for, request
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app)

@app.route('/success/<name>')
def success(name):
   return 'welcome %s' % name

@app.route('/getresult',methods = ['POST', 'GET'])
def login():
   if request.method == 'POST':
      query = request.form['query']
      return {"status":"OK","title":"Title","descrpition":"Description","result":"OK<BR><BR>Recived query : "+query} , 200

if __name__ == '__main__':
   app.run(host='localhost', port=1212)