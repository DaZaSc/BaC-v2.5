// BaC-v2.5 - Local Express Server

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.post('/save-memory', (req, res) => {
    const memoryData = JSON.stringify(req.body, null, 2);
    const fileName = `BaC_UserData/memory_${Date.now()}.json`;
    fs.writeFile(path.join(__dirname, fileName), memoryData, (err) => {
        if (err) {
            console.error('Error saving memory:', err);
            res.status(500).send('Failed to save memory.');
        } else {
            res.send('Memory saved successfully.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`BaC-v2.5 Server running at http://localhost:3000`);
});
