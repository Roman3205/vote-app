let express = require(`express`);
let app = express();
let port = 3005;

app.listen(port, function() {
    console.log(`http://localhost:${port}`);
})


// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/vote-app');

// Схемы
let votesSchema = new mongoose.Schema({
    title: String,
    description: String,
    positive: Number,
    negative: Number
});

let Vote = mongoose.model('vote', votesSchema);

// Раздача статики
app.use(express.static(`public`));
app.use(express.json())

// Роуты API

app.get(`/votes/all`, async function(req, res) {
    let votes = await Vote.find()
    res.send(votes)
})

app.post(`/votes/create`, async function(req, res) {
    let title = req.body.title
    let description = req.body.description
    let vote = new Vote({
        title: title,
        description: description,
        positive: 0,
        negative: 0
    })
    await vote.save()
    res.send(vote)
})

app.post(`/votes/remove`, async function(req, res) {
    let id = req.body.id

    await Vote.deleteOne({ _id: id })

    res.send(200)
})

app.post(`/votes/positive`, async function(req, res) {
    let id = req.body.id
    let vote = await Vote.findOne({ _id: id })

    if (!vote) {
        res.sendStatus(404);
        return;
    }

    vote.positive += 1;
    await vote.save()

    res.send(vote)
})

app.post(`/votes/negative`, async function(req, res) {
    let id = req.body.id
    let vote = await Vote.findOne({ _id: id })

    if (!vote) {
        res.sendStatus(404)
        return
    }
    vote.negative += 1
    await vote.save()

    res.send(vote)
})