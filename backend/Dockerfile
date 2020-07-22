FROM rasa/rasa:1.10.8
USER root
#RUN  pip install gtts
#RUN pip install deepspeech
USER 1001
WORKDIR /app
COPY . /app

RUN  rasa train

#VOLUME /app
#VOLUME /app/data
#VOLUME /app/models

USER root
CMD [ "run","-m","/app/models","--enable-api","--cors","*","--debug" ]
#CMD [ "run","-m","/app/models","--enable-api","--cors","*","--debug", "--ssl-certificate","cert.pem", "--ssl-keyfile", "key.pem", "--ssl-password", "password" ]

