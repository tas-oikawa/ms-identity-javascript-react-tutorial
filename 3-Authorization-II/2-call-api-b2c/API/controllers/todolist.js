const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./data/db.json');
const db = lowdb(adapter);
const { hasRequiredDelegatedPermissions } = require('../auth/permissionUtils');
const { validateIdToken } = require('../common/tokenValidator')

const authConfig = require('../authConfig');
const httpContext = require('express-http-context');

exports.getTodo = (req, res, next) => {
    const token = httpContext.get("decodedToken");
    if (token) {
        try {
            const id = req.params.id;
            const todo = db.get('todos').find({ id: id }).value();
            res.status(200).send(todo);
        } catch (error) {
            next(error);
        }
    } else {
        next(new Error('User does not have the required permissions'));
    }
};

exports.getTodos = async (req, res, next) => {
    const token = httpContext.get("decodedToken");
    if (token) {
        try {
            const owner = token['sub'];
            const todos = db.get('todos').filter({ owner: owner }).value();
            res.status(200).send(todos);
        } catch (error) {
            console.log("error at getTodos");
            next(error);
        }
    } else {
        res.status(401).send();
    }
};

exports.postTodo = (req, res, next) => {
    const token = httpContext.get("decodedToken");
    if (token) {
        try {
            const owner = token['sub'];
            db.get('todos').push({...req.body, owner}).write();
            res.status(200).json({ message: 'success' });
        } catch (error) {
            next(error);
        }
    } else {
        next(new Error('User does not have the required permissions'));
    }
};

exports.updateTodo = (req, res, next) => {
    const token = httpContext.get("decodedToken");
    if (token) {
        try {
            const id = req.params.id;
            const owner = token['sub'];
            db.get('todos').filter({ owner: owner }).find({ id: id }).assign(req.body).write();

            res.status(200).json({ message: 'success' });
        } catch (error) {
            next(error);
        }
    } else {
        next(new Error('User does not have the required permissions'));
    }
};

exports.deleteTodo = (req, res, next) => {
    const token = httpContext.get("decodedToken");
    if (token) {
        try {
            const id = req.params.id;
            const owner = token['sub'];

            db.get('todos').remove({ owner: owner, id: id }).write();

            res.status(200).json({ message: 'success' });
        } catch (error) {
            next(error);
        }
    } else {
        next(new Error('User does not have the required permissions'));
    }
};
