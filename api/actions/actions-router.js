// Write your "actions" router here!
const express = require('express')
const Actions = require('./actions-model')
const {validateActionId, validateAction} = require('./actions-middlware')
const router = express.Router()




router.get('/', (req, res, next)=>{
    Actions.get()
        .then(action=>{
            res.status(200).json(action)
        })
        .catch(next)
})

router.get('/:id', validateActionId, (req, res, next)=>{
    res.status(200).json(req.action)
})

router.post('/', validateAction, (req, res, next)=>{
    Actions.insert({project_id:req.project_id, description:req.desc, notes:req.notes})
        .then(newAction=>{
            res.status(201).json(newAction)
        })
        .catch(next)
})

router.put('/:id', validateActionId, (req, res, next)=>{
    const completed = req.body.completed
    if(completed === undefined){
        res.status(400).json({
            message:"Actions requires completion status"
        })
    }else{
        Actions.update(req.params.id, {
            project_id:req.project_id,
            description: req.desc,
            notes:req.notes,
            completed: completed
        })
        .then(()=>{
            return Actions.get(req.params.id)
        })
        .then(updatedAction=>{
            res.json(updatedAction)
        })
        .catch(next)
    }
})

router.delete('/:id', validateActionId, async(req, res, next)=>{
    try{
        await Actions.remove(req.params.id)
        res.json(req.action)
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