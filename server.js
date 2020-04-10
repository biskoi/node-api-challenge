const express = require('express');
const projectsServer = require('./routers/projectsRouter')
const actionsServer = require('./routers/actionsRouter')
const server = express();


const logger = (req, res, next) => {
   console.log(`${req.method} to ${req.originalUrl} with query ${JSON.stringify(req.query)}`);
   next();
};

server.use(logger);
server.use(express.json());
server.use('/api/projects', projectsServer);
server.use('/api/actions', actionsServer);

server.get('/', (req, res) => {
   res.status(200).json({
      message: 'Welcome to my server!'
   })
});

module.exports = server;