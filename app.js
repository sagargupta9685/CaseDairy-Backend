const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const addcaseRoutes = require('./routes/addcaseRoute');
const hearingRoutes = require('./routes/caseRoutes');
const landRoutes = require('./routes/landRoutes');
const miscellaneousRoutes = require('./routes/miscellaneousRoutes');
 

const fs = require('fs');
const path = require('path');

// Ensure 'uploads' folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// Ensure this is the correct path

//require('./scheduler');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
 

// ✅ Serve static files from uploads folder



app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
 app.use('/api/addcase', addcaseRoutes); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/hearings', hearingRoutes);
app.use('/api/other',miscellaneousRoutes);

app.use('/api/land', landRoutes);
// Ensure this is the correct path
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
