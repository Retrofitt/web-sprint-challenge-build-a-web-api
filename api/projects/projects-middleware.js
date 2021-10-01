// add middlewares here related to projects


const Projects = require('./projects-model')

async function validateId(req, res, next){
    try{
        const project = await Projects.get(req.params.id)
        if(!project){
            res.status(404).json({
                message:"Project not found"
            })
        }else{
            req.project = project
            next()
        }
    }catch(err){
        res.status(500).json({
            message:"Problem validating ID"
        })
    }
}

function validateProject(req, res, next){
    const {name, description} = req.body
    if(!name || !name.trim() || !description ||!description.trim()){
        res.status(400).json({
            message:"Project requires name and description"
        })
    }else{
        req.name = name.trim()
        req.desc = description.trim()
        next()
    }
}

function validateComplete(req, res, next){
    const {completed} = req.body
    if(!completed){
        res.status(400).json({
            message:"Project requires completion status"
        })
    }else{
        req.completed = completed
        next()
    }
}




module.exports = {
    validateId,
    validateProject,
    validateComplete
}