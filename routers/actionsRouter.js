const express = require('express');
const actionsDb = require('../data/helpers/actionModel');
const projectsDb = require('../data/helpers/projectModel');
const actionsServer = express.Router();

module.exports = actionsServer;

const validateProjectId = (req, res, next) => {

   projectsDb.get(req.body.project_id)
   .then(rep => {
      if (rep === null) {
         res.status(400).json({
            message: `Could not find project with the ID of ${req.params.id}`
         });
      } else {
         next();
      };
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

};

const validateActionId = (req, res, next) => {

   actionsDb.get(req.params.id)
   .then(rep => {
      if (rep === null) {
         res.status(400).json({
            message: `Could not find action with the ID of ${req.params.id}`
         });
      } else {
         next();
      };
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

};

const validateAction = (req, res, next) => {

   if(!req.body.project_id || !req.body.description || !req.body.notes) {
      res.status(400).json({
         message: `Please include the project ID, description, and notes to create a new action.`
      });
   } else if (req.body.description.length > 128) {
      res.status(400).json({
         message: `Your description may only be 128 characters long, but is ${req.body.description.length} characters.`
      });
   } else {
      actionsDb.get(req.params.id)
      .then(rep => {
         if (rep === null) {
            res.status(400).json({
               message: `Could not find project with the ID of ${req.params.id}`
            });
         } else {
            next();
         };
      })
      .catch(err => {
         res.status(500).json({
            message: `Server error. ${err}`
         });
      });
   }

};

actionsServer.get('/', (req, res) => {

   actionsDb.get()
   .then(rep => {
      res.status(200).json(rep)
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});

actionsServer.get('/:id', validateActionId, (req, res) => {

   actionsDb.get(req.params.id)
   .then(rep => {
      res.status(200).json(rep)
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});

actionsServer.post('/', validateAction, validateProjectId, (req, res) => {

   actionsDb.insert(req.body)
   .then(rep => {
      res.status(201).json(rep)
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});

actionsServer.put('/:id', (req, res) => {

   if (!req.body) {
      res.status(400).json({
         message: `Please include your changes.`
      });
   } else {
      actionsDb.update(req.params.id, req.body)
      .then(rep => {
         res.status(200).json(rep)
      })
      .catch(err => {
         res.status(500).json({
            message: `Server error. ${err}`
         });
      });
   }

});

actionsServer.delete('/:id', validateActionId, (req, res) => {

   actionsDb.remove(req.params.id)
   .then(count => {
      res.status(200).json({
         message: `${count} action(s) deleted.`
      })
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});