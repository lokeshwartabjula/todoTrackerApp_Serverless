from flask import Flask, request, jsonify
import csv
import os
import requests

app = Flask(__name__)

@app.route('/api/books', methods=['GET'])
def books():
    return 'something',200




@app.route('/calculate', methods=['POST'])
def calculate():
    current_directory = os.getcwd()
    print(current_directory)

    parent_directory = os.path.dirname(current_directory)
    print(parent_directory)
    data = request.get_json()

    # Checking if file attribute is present in the input
    if 'file' not in data:
        return jsonify({'file': None, 'error': 'Invalid JSON input.'}), 400
    

    #Checking if the value of file attribute is not empty or null
    if data['file'] is None or data['file'] == '':
        return jsonify({'file': None, 'error': 'Invalid JSON input.'}), 400
    
    # csv_file_path = os.path.join(parent_directory, data['file'])
    # csv_file_path="/Users/lokeshwartabjula/Documents/Term2_Macs/Cloud_5409/Assignments/A1/trial2Py/image_1/"+data['file']
    csv_file_path="/volume_dir/"+data['file']

    #Checking if the file exists in the mounted disk volume
    if not os.path.exists(csv_file_path):
        return jsonify({'file': data['file'], 'error': 'File not found.'}), 404
    #Checking if the file is not empty
    if os.stat(csv_file_path).st_size == 0:
        return jsonify({'file': data['file'], 'error': 'Input file not in CSV format.'}), 400

    #Checking if the product attribute is present in the input
    if 'product' not in data:
        return jsonify({'file': data['file'], 'error': 'Invalid JSON input.'}), 400
    #Checking if the value of product attribute is not empty or null
    if data['product'] is None or data['product'] == '':
        return jsonify({'file': data['file'], 'error': 'Invalid JSON input.'}), 400
    else:
        response = requests.post('http://container_2:8080/validate', json=data)
        return jsonify(response.json()), response.status_code
    
    

    

    

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=6000)
