const router = new require('express').Router();
const Task = require('../models/task');
const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch(err) {
        res.status(400).send(err);
    }
});

//[completed=boolean]&[limit=n]&[skip=n]&[sortBy=completed:(a/de)sc]
router.get('/', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({
        //     user: req.user._id
        // }).populate('user');
        // res.send(tasks);

        const match = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        const sort = {};
        if (req.query.sortBy) {
            const [field, order] = req.query.sortBy.split(':');
            sort[field] = order === 'asc'? 1 : -1;
        }
        console.log(sort);
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch(err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findById(req.params.id);
        const task  = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task)
            return res.status(404).send();

        res.send(task);

    } catch(err) {
        res.status(400).send(err);
    }
});

router.patch('/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = Object.keys(req.body).every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation)
        return res.status(400).send({error: 'Invalid updates!'});

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // });

        const task = await Task.findOneAndUpdate({
            _id: req.params.id,
            user: req.user._id
        }, req.body, {
            new: true,
            runValidators: true
        });

        if (!task)
            return res.status(404).send();
        
        res.send(task);
    } catch(err) {
        res.status(400).send(err);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) 
            return res.status(404).send();

        res.send(task);
    } catch(err) {
        res.status(400).send(err);
    }
});

module.exports = router;