git clone https://github.com/Jeffreyjacob/nodeTest.git

npm install
#Create a .env file in the root directory and add your environment variables.
#here is your environmental veriable, you need to define
MONGODB_URI="mongo-url"
NODE_ENV=development
PORT=5000 #port you want your node server to be hosted on your local machine
REDIS_URI="redis_url"

#run your server with this command
npm run dev

#url
#nodejs server url
http://localhost:${PORT}
#graphl server url
http://localhost:${PORT}/graphql
