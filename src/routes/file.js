const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const dir = './uploads';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now());
  },
});
const limits = {
  fileSize: 1024 * 1028 * 2,
};

const upload = multer({ storage, limits });

router.post('/', upload.single('img'), async (req, res) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const registerInfo = req.body;
  res.send(JSON.stringify(registerInfo));
});

module.exports = router;
