var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
require('dotenv').config();
const multer = require('multer');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage }).single('upfile');


app.post('/api/fileanalyse', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ error: err.message });
    } else if (err) {
      
      res.status(500).json({ error: 'An unknown error occurred' });
    } else {
    
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
      } else {
        res.json({ name: req.file.originalname, type: req.file.mimetype, size: req.file.size });
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
