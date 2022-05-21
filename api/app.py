from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/events')
def events():
  return jsonify()

app.run(host='0.0.0.0', port=3001)