const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const dataPath = path.join(__dirname, 'data.json');

app.post('/redeem', (req, res) => {
  const code = req.body.code?.trim().toUpperCase();
  if (!code) return res.json({ success: false, msg: 'Kode tidak boleh kosong.' });

  const data = JSON.parse(fs.readFileSync(dataPath));
  if (!data[code]) return res.json({ success: false, msg: 'Kode tidak valid.' });
  if (data[code].used) return res.json({ success: false, msg: 'Kode sudah pernah digunakan.' });

  data[code].used = true;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  return res.json({ success: true, link: data[code].link });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server berjalan di port ${port}`));
