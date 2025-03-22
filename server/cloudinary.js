const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

cloudinary.config({
  cloud_name: "dlpty7kky",
  api_key: 542262963872576,
  api_secret: "BQvg71mVP7FaCyw1KMSZubKrsf0",
  secure: true, // Ensures HTTPS
});

module.exports = cloudinary;
//
