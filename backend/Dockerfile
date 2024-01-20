FROM python:3.9.7-slim-buster

WORKDIR /app

# install mysql client
RUN apt-get update && apt-get install -y default-libmysqlclient-dev
RUN apt-get install -y default-mysql-client 
RUN apt-get install -y iputils-ping

COPY ./requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]