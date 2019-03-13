const router = new require('express').Router();
const User = require('../models/user');
const auth = require('../middlewares/auth');
const multer = require('multer');
const sharp = require('sharp');

const allowedExts = /\.(jpg|jpeg|png)$/;

const upload = multer({
    // dest: 'avatars', //images are not save but passed as buffer to the next middleware
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        console.log(file.mimetype);
        if (!file.originalname.match(allowedExts))
            return cb(new Error('Only jpg,jpeg and png imag file is accepted'));
        cb(undefined, true);
    }
});

router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.set('Authorization', 'Bearer ' + token);
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

// router.get('/', auth, async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// });

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

// router.get('/:id', auth, async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user)
//             return res.status(404).send();

//         res.send(user);

//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

router.patch('/', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!' });

    try {
        //Bypasses mongodb's middleware
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // });

        // const user = await User.findById(req.user._id);
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();

        // if (!user)
        //     return res.status(404).send();

        res.send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);

        // if (!user)
        //     return res.status(404).send();

        await req.user.remove();
        res.send(req.user);
    } catch (err) {
        res.status(400).send();
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.set('Authorization', 'Bearer ' + token);
        res.send({ user, token });

    } catch (err) {
        res.status(401).send(err.message);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token);
        
        await req.user.save();

        res.send();
    } catch(err) {
        res.status(401).send(err);
    }
});

router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.send();

    } catch(err) {
        res.status(500).send(err);
    }
});

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
    // req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer();

    req.user.avatar = buffer;

    await req.user.save()
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({
        error: err.message
    });
});

router.delete('/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/avatar', auth, async (req, res) => {

});

router.get('/avatar/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar)
            throw new Error();

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch(err) {
        res.status(404).send();
    }
});

module.exports = router;