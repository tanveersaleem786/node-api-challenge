const express = require('express')

const projectModel = require('../data/helpers/projectModel.js')
const actionModel = require('../data/helpers/actionModel.js')

const router = express.Router()

// Get All Projects
router.get('/', (req, res, next) => {
   
    projectModel.get()
       .then((projects) => {
           res.status(200).json(projects)
       })
       .catch((error) => next(error))

})

// Get Project By ID
router.get('/:id', validateProjectID(), (req, res) => {   
     res.status(200).json(req.project)
})


// Get Actions By Project ID
router.get('/:id/actions', validateProjectID(), (req, res) => {   
    projectModel.getProjectActions(req.params.id)
       .then((actions) => {
           res.status(200).json(actions)
       })
       .catch((error) => next(error))

})


// Create Project
router.post('/', validateProject(), (req, res, next) => {
     
      projectModel.insert(req.body)
        .then((project) => {            
           res.status(201).json(project)            
        })
        .catch((error) => next(error))

})


// Update Project
router.put('/:id', validateProject(), validateProjectID(), (req, res, next) => {

      projectModel.update(req.params.id,req.body)
        .then((project) => {
           res.status(200).json(project)
        })
        .catch(next)  // or
        //.catch((error) => next(error))

})


// Delete Project
router.delete('/:id', validateProjectID(), (req, res, next) => {
    
    projectModel.remove(req.params.id)
      .then((project) => {
          res.status(200).json(project) 
      })
      .catch(next)

})


// Create Action By Project ID
router.post('/:id/actions', validateAction(), validateProjectID(), (req, res, next) => {
    // const { text } = req.body;
    // const { id: user_id } = req.params;
    // insert({ text, user_id })
    req.body = {...req.body, "project_id": req.params.id}
    actionModel.insert(req.body)
    .then((action) => {            
       res.status(201).json(action)            
    })
    .catch((error) => next(error))
     
})


// Middleware
function validateProjectID() {

    return (req, res, next) => {
        if(!req.params.id) {
            res.status(404).json({message: "Project ID missing"})
        } else {
            projectModel.get(req.params.id)
              .then((project) => {
                    if(project)  {
                        req.project = project
                        next()
                    } else {
                        res.status(404).json({message: "Invalid Project ID"}) 
                    }                 
              }) 
              .catch((error) => {
                  next(error) 
              })
        } 

    }
}

function validateProject() {

     return (req, res, next) => {
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
             res.status(404).json({message: "missing project data"})
         }
        else if(!req.body.name || !req.body.description) {
             res.status(404).json({message: "missing name or description field"})
         } else {
             next()
         }
     }

}

function validateAction() {

    return (req, res, next) => {
       if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            res.status(404).json({message: "missing action data"})
        }
       else if(!req.body.description || !req.body.notes) {
            res.status(404).json({message: "missing description or notes field"})
        } else {
            next()
        }
    }

}


module.exports = router