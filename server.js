// server.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API base url: ${process.env.BASE_URL || 'http://localhost:3000/api/v1'}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
