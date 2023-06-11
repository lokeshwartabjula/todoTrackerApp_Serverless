import grpc
from concurrent import futures
from computeandstorage_pb2 import StoreReply, AppendReply, DeleteReply
from computeandstorage_pb2_grpc import add_EC2OperationsServicer_to_server, EC2OperationsServicer
import boto3

# Define the server class
class EC2OperationsServicer(EC2OperationsServicer):
    def __init__(self):
        self.s3_client = boto3.client('s3')
        self.bucket_name = 'grpc-bucket-b00936909'

    def StoreData(self, request, context):
        file_key = 'data_file.txt'
        self.s3_client.put_object(Body=request.data, Bucket=self.bucket_name, Key=file_key)

        url = "https://"+self.bucket_name+".s3.amazonaws.com/"+file_key

        return StoreReply(s3uri=url)

    def AppendData(self, request, context):
        file_key = 'data_file.txt'
        response = self.s3_client.get_object(Bucket=self.bucket_name, Key=file_key)
        existing_data = response['Body'].read().decode('utf-8')
        appended_data = existing_data + request.data
        self.s3_client.put_object(Body=appended_data, Bucket=self.bucket_name, Key=file_key)
        return AppendReply()

    def DeleteFile(self, request, context):
        url_parts = request.s3uri.split('/')
        file_key = url_parts[-1]
        self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_key)

        return DeleteReply()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor())
    add_EC2OperationsServicer_to_server(EC2OperationsServicer(), server)
    server.add_insecure_port('[::]:50051')
    print("Starting server. Listening on port 50051.")
    server.start()
    print("Server started. Listening on port 50051.")
    server.wait_for_termination()
    print("Server terminated.")

if __name__ == '__main__':
    serve()
