const express = require('express');
const projectsDb = require('../data/helpers/projectModel');
const projectsServer = express.Router();

// - [ ] Perform CRUD operations on _projects_ and _actions_. When adding an action, make sure the `project_id` provided belongs to an existing `project`. If you try to add an action with an `id` of 3 and there is no project with that `id` the database will return an error.
// - [ ] Retrieve the list of actions for a project.

const validateProject = (req, res, next) => {

   if(!req.body.name || !req.body.description) {
      res.status(400).json({
         message: `Please include both the name and description of the new project.`
      });
   } else {
      next();
   }

};

const validateProjectId = (req, res, next) => {

   projectsDb.get(req.params.id)
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

projectsServer.get('/', (req, res) => {
   
   projectsDb.get()
   .then(rep => {
      res.status(200).json(rep);
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });
   
});

projectsServer.get('/:id', (req, res) => {

   projectsDb.get(req.params.id)
   .then(rep => {
      res.status(200).json(rep);
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});

projectsServer.get('/:id/actions', validateProjectId, (req, res) =>{

   projectsDb.getProjectActions(req.params.id)
   .then(rep => {
      res.status(200).json(rep);
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});

projectsServer.post('/', validateProject, (req, res) => {

   console.log(req.body);

   projectsDb.insert(req.body)
   .then(rep => {
      res.status(201).json(rep)
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});

projectsServer.put('/:id', (req, res) => {

   projectsDb.update(req.params.id, req.body)
   .then(rep => {

      if (rep === null) {
         res.status(400).json({
            message: `Could not find project with the ID of ${req.params.id}`
         });
      } else {
         res.status(200).json(rep)
      };

   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});

projectsServer.delete('/:id', validateProjectId, (req, res) => {

   projectsDb.remove(req.params.id)
   .then(count => {
      res.status(200).json({
         message: `${count} project(s) deleted.`
      })
   })
   .catch(err => {
      res.status(500).json({
         message: `Server error. ${err}`
      });
   });

});

module.exports = projectsServer;