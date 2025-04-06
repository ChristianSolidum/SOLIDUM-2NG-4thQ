// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express application
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

// Set up handlebars as the template engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // Updated path for views

// Initialize users.json if it doesn't exist
const usersFilePath = path.join(__dirname, 'data', 'clubmembers.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  console.log('Creating data directory...');
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(usersFilePath)) {
  console.log('Creating clubmembers.json file...');
  fs.writeFileSync(usersFilePath, '{}');
}

// Load club data
let clubData, clubArray;
try { // this is to handle error in case clubs.json does not exist
  console.log('Loading clubs data...');
  clubData = require('./data/clubs.json'); // the club iformation
  console.log('clubs data loaded successfully');
  // convert the clubData object to an array of object with
  //     name and description as its properties for club name and its descriptio
  clubArray = Object.entries(clubData).map(([name, description]) => ({ name, description }));
  console.log(clubArray);
} catch (error) {
  console.error('Error loading club data:', error);
  process.exit(1);
}

// Routes
// to get index.hbs as the first page to display
app.get('/', (req, res) => {
  try {
    const clubMembers = JSON.parse(fs.readFileSync(usersFilePath));
    const clubM = clubMembers.students; // read the array of students sign-ups
    console.log('Users loaded:', clubM);
    // console.log("userList is", userList);
     res.render('index.hbs', {clubArray, clubM});
  } catch (error) {
    console.error('Error reading users file:', error);
    res.status(500).send('Error loading user data');
  }
});




// enable web service
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});