# import os
# import csv
# from flask import Flask, request, jsonify

 

# app = Flask(__name__)

 

# @app.route('/calculate', methods=['POST'])
# def calculate():
#     data = request.json
#     file = data.get('file')
#     product = data.get('product')

 

#     if not file:
#         return jsonify({'file': None, 'error': 'Invalid JSON input.'}), 400

 

#     file_path = os.path.join('/lokeshwar_PV_dir', file)

 

#     if not os.path.exists(file_path):
#         return jsonify({'file': file, 'error': 'File not found.'}), 404

 

#     header_found = False
#     file_error = False
#     rows = []

 

#     with open(file_path, 'r') as f:
#         csv_reader = csv.DictReader(f)
#         for row in csv_reader:
#             if not header_found:
#                 if not row.get('product') or not row.get('amount'):
#                     header_found = True
#                     file_error = True
#                 header_found = True
#             else:
#                 if not row.get('product') or not row.get('amount'):
#                     file_error = True
#             rows.append(row)

 

#     if not header_found or file_error:
#         return jsonify({'file': file, 'error': 'Input file not in CSV format.'}), 200

 

#     total_sum = sum(int(row['amount']) for row in rows if row['product'] == product)

 

#     return jsonify({'file': file, 'sum': str(total_sum)}), 200

 

# if __name__ == '__main__':
#     app.run(host='0.0.0.0',port=7002)
import os
import csv
from flask import Flask, request, jsonify

 

app = Flask(__name__)

 

@app.route('/calculate', methods=['POST'])
def calculate():
    
    data = request.json
    file = data.get('file')
    product = data.get('product')

    if not file:
        return jsonify({'file': None, 'error': 'Invalid JSON input.'}), 400
    file_path = os.path.join('/lokeshwar_PV_dir', file)

    if not os.path.exists(file_path):
        return jsonify({'file': file, 'error': 'File not found.'}), 404

    try:
        with open(file_path, 'r') as f:
            # reader = csv.reader(f, dialect='strict')
            reader = csv.reader(f)
            next(reader)  # Skip the header row
            total = sum(int(row[1]) for row in reader if row[0] == product)
        if(total==0):
            return jsonify({'file': file, 'error': 'Input file not in CSV format.'}), 200
        else:
            return jsonify({'file': file, 'sum': str(total)}), 200
    except csv.Error:
        return jsonify({'file': file, 'error': 'Input file not in CSV format.'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=7002)