const express = require('express')

const projectModel = require('../data/helpers/projectModel.js')
const actionModel = require('../data/helpers/actionModel.js')

const router = express.Router()

// Get All Actions
router.get('/', (req, res, next) => {
   
    actionModel.get()
       .then((actions) => {
           res.status(200).json(actions)
       })
       .catch((error) => next(error))

})

// Get Action By ID
router.get('/:id', validateActionID(), (req, res) => {   
     res.status(200).json(req.action)
})


// Update Action By ID
router.put('/:id', validateAction(), validateActionID(), validateProjectID(), (req, res, next) => {
    
    actionModel.update(req.params.id,req.body)
      .then((action) => {
         res.status(200).json(action)
      })
      .catch(next)  
})

// Delete Action
router.delete('/:id', validateActionID(), (req, res, next) => {
    
    actionModel.remove(req.params.id)
      .then((action) => {
          res.status(200).json(action) 
      })
      .catch(next)

})

// Meddleware
function validateActionID() {

    return (req, res, next) => {
        if(!req.params.id) {
            res.status(404).json({message: "Action ID missing"})
        } else {
            actionModel.get(req.params.id)
              .then((action) => {
                    if(action)  {
                        req.action = action
                        next()
                    } else {
                        res.status(404).json({message: "Invalid Action ID"}) 
                    }                 
              }) 
              .catch((error) => {
                  next(error) 
              })
        } 

    }
}


function validateAction() {

    return (req, res, next) => {
       if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            res.status(404).json({message: "missing action data"})
        }
       else if(!req.body.description || !req.body.notes || !req.body.project_id) {
            res.status(404).json({message: "missing description, notes or project  field"})
        } else {
            next()
        }
    }

}

function validateProjectID() {

    return (req, res, next) => {
        const project_id = req.body.project_id;
        if(!project_id) {
            res.status(404).json({message: "Project ID missing"})
        } else {
            projectModel.get(project_id)
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





module.exports = router