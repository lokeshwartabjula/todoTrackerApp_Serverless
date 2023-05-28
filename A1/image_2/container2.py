from flask import Flask, request, jsonify
import csv
import os
import requests

app = Flask(__name__)

@app.route('/validate', methods=['POST'])
def validate():
    data = request.get_json()
    file_name = data['file']
    product = data['product']
    current_directory = os.getcwd()
    parent_directory = os.path.dirname(current_directory)
    # creating csv pathe
    # csv_file_path = os.path.join(parent_directory, file_name)
    csv_file_path="/volume_dir/"+data['file']

    if not validate_file(csv_file_path):
        return jsonify({'file': file_name, 'error': 'Input file not in CSV format.'}), 400
    try:
        total_sum = 0
        with open(csv_file_path, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['product'] == data.get('product', ''):
                    total_sum += int(row['amount'])

        response = {'file': file_name, 'sum': total_sum}
        return jsonify(response), 200

    except csv.Error:
        return jsonify({'file': file_name, 'error': 'Input file not in CSV format.'}), 400


#write a function to validate if the csv file is in correct format or not by using regex
def validate_file(csv_file_path):
    with open(csv_file_path, newline='') as csvfile:
        csv_reader = csv.reader(csvfile, delimiter=',')
        header = next(csv_reader)
        if header != ['product', 'amount']:
            return False
        for row in csv_reader:
            if len(row) != 2:
                return False
            try:
                int(row[1])
            except ValueError:
                return False
        return True



if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080)
