import json
import bcrypt
import requests

def lambda_handler(event, context):
    print(event)
    # request_body = event['input']
    # action = request_body['action']
    value = event['value']

    salt = bcrypt.gensalt()
    hashed_value = bcrypt.hashpw(value.encode(), salt).decode()

    response = {
        "banner": "B00936909",
        "result": hashed_value,
        "arn": context.invoked_function_arn,
        "action": "bcrypt",
        "value": value
    }

    post_url = "https://v7qaxwoyrb.execute-api.us-east-1.amazonaws.com/default/end"
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(post_url, data=json.dumps(response), headers=headers)
        response.raise_for_status()
        return {
            "statusCode": 200,
            "body": "POST request successful"
        }
    except requests.exceptions.RequestException as e:
        return {
            "statusCode": 500,
            "body": f"POST request failed: {str(e)}"
        }
