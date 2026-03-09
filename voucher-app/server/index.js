const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the parent directory (where index.html is)
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
    console.log(`Voucher app is running at http://localhost:${PORT}`);
});
