# configure https 
First, please check nginx service in docker-compose.yaml file.
Replace certification key files from cert folder.

Second, please check backend folder.
Replace certification key files.
for instance, cert.pem, key.pem

Third, please check Dockerfile in backend folder. 
Change key files with your key file names this line following:
CMD [ "run","-m","/app/models","--enable-api","--cors","*","--debug", "--ssl-certificate","cert.pem", "--ssl-keyfile", "key.pem", "--ssl-password", "password" ]

  
# Run
docker-compose up -d
