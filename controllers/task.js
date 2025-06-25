const Task = require("../models/task");

async function createTask(req, res){
    const task = new Task();
    const params = req.body;

    task.title = params.title;
    task.description = params.description;

    try {
        const taskStore = await task.save();

        if(!taskStore){
            res.status(400).send({ msg: "No se ha guardado la tarea" });
        }else{
            res.status(200).send({ task: taskStore });
        }

    } catch (error) {
        res.status(500).send(error);
    }
}


async function getAllTasks(req, res){
    try {
        const tasks = await Task.find();
        
        if(!tasks){
            res.status(400).send({ msg: "Error al obtener las tareas"});
        }else{
            res.status(200).send(tasks);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getTaskById(req, res){
    try {
        const idTask = req.params.id;
        const task = await Task.findById(idTask);

        if(!task){
            res.status(400).send({msg: "Error al obtener la tarea indicada"});
        }else{
            res.status(200).send(task);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

async function updateTask(req, res) {
    const idTask = req.params.id;
    const params = req.body;

    try {
        const task = await Task.findByIdAndUpdate(idTask, params);

        if(!task){
            res.status(400).send({msg: "No se ha podido actualizar la tarea"});
        }else{
            res.status(200).send({msg: "Tarea actualizada completada"});
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

async function deleteTask(req, res) {
    const idTask = req.params.id;

    try {
        const task = await Task.findByIdAndDelete(idTask);

        if(!task){
            res.status(400).send({msg: "No se ha podido eliminar la tarea"});
        }else{
            res.status(200).send({msg: "Tarea eliminada correctamente"});
        }

    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
}