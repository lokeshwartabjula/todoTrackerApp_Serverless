from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL database configuration
db_host = "b00936909-db1.ct57imt4ho76.us-east-1.rds.amazonaws.com"
db_port = 3306
db_user = "admin"
db_password = "root1234"
db_name = "mydbname"

# Connect to MySQL database
def connect_to_database():
    print('inside connect to database')
    try:
        conn = mysql.connector.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name
        )
        return conn
    except mysql.connector.Error as err:
        print("Error connecting to MySQL database:", err)
        return None

# Create database if not exists
def create_database():
    print('inside create database')
    conn = connect_to_database()
    if conn:
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS {}".format(db_name))
        cursor.close()
        conn.close()

# Create products table if not exists
def create_products_table():
    print('inside create products table')
    conn = connect_to_database()
    if conn:
        cursor = conn.cursor()
        cursor.execute("USE {}".format(db_name))
        cursor.execute("CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price DECIMAL(10, 2), availability BOOLEAN)")
        cursor.close()
        conn.close()

# POST API to store products
@app.route('/store-products', methods=['POST'])
def store_products():
    print('inside store products function')
    data = request.json
    products = data.get('products', [])

    conn = connect_to_database()
    if conn:
        cursor = conn.cursor()

        try:
            cursor.execute("USE {}".format(db_name))
            for product in products:
                name = product.get('name', '')
                price = product.get('price', 0)
                availability = product.get('availability', False)

                query = "INSERT INTO products (name, price, availability) VALUES (%s, %s, %s)"
                cursor.execute(query, (name, price, availability))

            conn.commit()
            cursor.close()
            conn.close()

            response = {"message": "Success."}
            return jsonify(response), 200

        except mysql.connector.Error as err:
            print("Error inserting records into products table:", err)
            cursor.close()
            conn.close()

    return "Error storing products.", 500

# GET API to list products
@app.route('/list-products', methods=['GET'])
def list_products():
    conn = connect_to_database()
    if conn:
        cursor = conn.cursor()

        try:
            cursor.execute("USE {}".format(db_name))
            query = "SELECT name, price, availability FROM products"
            cursor.execute(query)
            rows = cursor.fetchall()

            products = []
            for row in rows:
                name, price, availability = row
                product = {
                    "name": name,
                    "price": str(int(price)),
                    "availability": bool(availability)
                }
                products.append(product)

            cursor.close()
            conn.close()

            response = {"products": products}
            return jsonify(response), 200

        except mysql.connector.Error as err:
            print("Error retrieving products from database:", err)
            cursor.close()
            conn.close()

    return "Error listing products.", 500

if __name__ == '__main__':
    create_database()
    create_products_table()
    app.run(host='0.0.0.0', port=80)
