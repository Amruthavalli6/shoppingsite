require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');
const path = require('path');
const userModelPath = path.join(__dirname, '../models/User.js');
console.log('Loading User model from:', userModelPath);
const User = require(userModelPath);
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/shopverse';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const username = await ask('Enter admin username: ');
  const email = await ask('Enter admin email: ');
  const password = await ask('Enter admin password: ');

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User with this email already exists.');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new User({
    username,
    email,
    password: hashedPassword,
    role: 'admin'
  });
  await admin.save();
  console.log('Admin user created successfully!');
  mongoose.disconnect();
  rl.close();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect();
  rl.close();
}); 