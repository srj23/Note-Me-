const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
}

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    fs.readdir(filesDir, function(err, files) {
        res.render('index', { files: files || [] });
    });
});

app.post('/create', function(req, res) {
    const filename = `${req.body.title.split(' ').join('')}.txt`;
    fs.writeFile(path.join(filesDir, filename), req.body.details, function(err) {
        res.redirect('/');
    });
});

app.get('/file/:filename', function(req, res) {
    fs.readFile(path.join(filesDir, req.params.filename), 'utf-8', function(err, filedata) {
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function(req, res) {
    res.render('edit', { filename: req.params.filename });
});

app.post('/edit', function(req, res) {
    fs.rename(path.join(filesDir, req.body.previous), path.join(filesDir, req.body.new), function(err) {
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});
