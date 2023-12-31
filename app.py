from flask import Flask, request, render_template, jsonify
from mysql_conn import *

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# @app.route('/api/todos', methods=['POST'])
# def insert_todos():
#     data = request.get_json()
#     insert_data(data)
#     return data

@app.route('/api/todos', methods=['POST'])
def insert_todos():
    data = request.get_json()
    last_insertion_id = insert_data(data)
    return jsonify({"last_inserted_id": last_insertion_id})

@app.route('/api/todos', methods=['GET'])
def get_todos():
    data = get_data()
    return jsonify(data)

@app.route('/api/todos/<int:task_id>', methods=['DELETE'])
def delete_todo(task_id):
    delete_data(task_id)
    return jsonify({'message': 'Task deleted successfully'})

@app.route('/api/todos/<int:task_id>', methods=['PUT'])
def toggle_todo(task_id):
    data = request.get_json()
    toggle_data(data, task_id)
    return data

app.run(host='localhost', port=81)



