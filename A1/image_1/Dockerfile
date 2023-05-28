FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP=container1.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=6000

EXPOSE 6000

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]