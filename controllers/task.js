const Task = require("../models/task");

async function createTask(req, res){
    // Creamos una nueva tarea
    const task = new Task();
    // Obtenemos los parámetros
    const params = req.body;

    // Asignamos los nuevos valores de la tarea
    task.title = params.title;
    task.description = params.description;

    try {
        // Guardamos la nueva tarea en la base de datos
        const taskStore = await task.save();

        // Comprobamos si se ha guardado correctamente
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
        // Buscamos todas las tareas de la base de datos
        const tasks = await Task.find();
        
        // Comprobamos si encontro tareas o no
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
        // Obtenemos el id pasado por los parámetros
        const idTask = req.params.id;
        // Buscamos la tarea con el id
        const task = await Task.findById(idTask);

        // Comprobamos si se encontro la tarea o no
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
    // Obtenemos el id de la tarea pasado por parámetro
    const idTask = req.params.id;
    // Obtenemos el body
    const params = req.body;

    try {
        // Buscamos que haya una tarea con ese id y se actualiza con los nuevos datos
        const task = await Task.findByIdAndUpdate(idTask, params);

        // Comprobamos si se actualiza la tarea o no
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
    // Obtenemos el id de la tarea pasada por parámetro
    const idTask = req.params.id;

    try {
        // Buscamos que haya una tarea con ese id y eliminamos la tarea
        const task = await Task.findByIdAndDelete(idTask);

        // Comprobamos si se pudo eliminar la tarea
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