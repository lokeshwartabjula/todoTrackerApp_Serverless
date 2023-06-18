import os
import csv
import requests
from flask import Flask, request, jsonify

 

app = Flask(__name__)

 

@app.route('/store-file', methods=['POST'])
def store_file():
    data = request.json
    file = data.get('file')
    file_data = data.get('data')

 

    if not file or not file_data:
        return jsonify({'file': None, 'error': 'Invalid JSON input.'}), 400

 

    file_path = os.path.join('/lokeshwar_PV_dir', file)

 

    try:
        with open(file_path, 'w') as f:
            f.write(file_data)
        return jsonify({'file': file, 'message': 'Success.'}), 200
    except:
        return jsonify({'file': file, 'error': 'Error while storing the file to the storage.'}), 500

 

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    file = data.get('file')
    product = data.get('product')

 

    if not file:
        return jsonify({'file': None, 'error': 'Invalid JSON input.'}), 400

 

    try:
        response = requests.post('http://ks-service2-b00936909:7002/calculate', json={'file': file, 'product': product})
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'file': file, 'error': 'Error communicating with Container 2.'}), 500

 

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5002)