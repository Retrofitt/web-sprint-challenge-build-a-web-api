// add middlewares here related to actions
const Actions = require('./actions-model')

async function validateActionId(req, res, next){
    try{
        const actions = await Actions.get(req.params.id)
        if(!actions){
            res.status(404).json({
                message:"Actions not found"
            })
        }else{
            req.action = actions
            next()
        }
    }catch(err){
        res.status(500).json({
            message:"Problem validating ID"
        })
    }
}

function validateAction(req, res, next){
    const {project_id, description, notes} = req.body
    if(!project_id || !description || !notes){
        res.status(400).json({
            message:"Project requires project_id, description, & notes"
        })
    }else{
        req.project_id = project_id
        req.desc = description.trim()
        req.notes = notes.trim()
        next()
    }
}


module.exports = {
    validateActionId,
    validateAction
}