FROM python:3.8-slim-buster

RUN mkdir -p /usr/src/lokeshwar_PV_dir
WORKDIR /usr/src/lokeshwar_PV_dir

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . /usr/src/lokeshwar_PV_dir

ENV FLASK_APP=container1.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5002

EXPOSE 5002

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]