// Write your "projects" router here!
const express = require('express')
const Projects = require('./projects-model')
const { validateId, validateProject } = require('./projects-middleware')
const router = express.Router()



router.get('/', (req, res, next)=>{
    Projects.get()
        .then(project =>{
            res.status(200).json(project)
        })
        .catch(next)
})

router.get('/:id', validateId, (req, res, next)=>{
    res.status(200).json(req.project)
})

router.post('/', validateProject, (req, res, next)=>{
    Projects.insert({name: req.name, description: req.desc, completed: req.body.completed}) 
        .then(newProject=>{
            res.status(201).json(newProject)
        })
        .catch(next)
})

router.put('/:id', validateId, validateProject, (req, res, next)=>{
    const completed = req.body.completed
    if(completed === undefined){
        res.status(400).json({
            message:"Project requires completion status"
        })
    }else{
        Projects.update(req.params.id, {
            name: req.name,
            description: req.desc,
            completed: completed
        })
        .then(()=>{
            return Projects.get(req.params.id)
        })
        .then(updatedProject=>{
            res.json(updatedProject)
        })
        .catch(next)
    }
})

router.delete('/:id', validateId, async(req, res, next)=>{
    try{
        await Projects.remove(req.params.id)
        res.json(req.project)
    }catch(err){
        next(err)
    }
})

router.get('/:id/actions', validateId, async(req, res, next)=>{
    try{
        const projectActions = await Projects.getProjectActions(req.params.id)
        res.status(200).json(projectActions)
    }catch(err){
        next(err)
    }
})

router.use((err, req, res, next)=>{ 
    res.status(err.status || 500).json({
        customMessage:"some error has occurred",
        message: err.message,
        stack: err.stack
    })
})

module.exports = router


