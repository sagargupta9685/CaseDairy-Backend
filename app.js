const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const addcaseRoutes = require('./routes/addcaseRoute');
const landRoutes = require('./routes/landRoutes');
const miscellaneousRoutes = require('./routes/miscellaneousRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Ensure 'uploads' folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ CORS allowed origins
const allowedOrigins = [
  "https://case-diary.vercel.app", // deployed frontend
  "http://localhost:5173"          // local frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options("*", cors()); // ✅ preflight

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);       // includes hearing routes
app.use('/api/addcase', addcaseRoutes);
app.use('/api/land', landRoutes);
app.use('/api/other', miscellaneousRoutes);

// ✅ Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
