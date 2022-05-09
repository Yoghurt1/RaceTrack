from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/route')
def route():
  return jsonify({'test': 'data'})

app.run(host='0.0.0.0', port=3001)