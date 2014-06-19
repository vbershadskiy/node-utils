generic pool and jdbc
===

make sure to grant privileges to 127.0.0.1 or you wont be able to connect

GRANT ALL PRIVILEGES ON *.* TO node @'127.0.0.1' IDENTIFIED BY 'pass';

npm install

node test.js
