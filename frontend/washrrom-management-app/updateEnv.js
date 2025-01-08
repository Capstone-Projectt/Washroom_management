const os = require('os');
const fs = require('fs');
const path = require('path');

// Function to get Wi-Fi IPv4 address
const getWiFiIPv4 = () => {
    const interfaces = os.networkInterfaces();
    console.log(interfaces); // Log all network interfaces for debugging

    // Look for the 'Wi-Fi' interface
    const wifiInterface = interfaces['Wi-Fi 2'];
    if (wifiInterface) {
        for (const config of wifiInterface) {
            if (config.family === 'IPv4' && !config.internal) {
                return config.address; // Return the Wi-Fi IPv4 address
            }
        }
    }

    return '127.0.0.1'; // Fallback to localhost if no Wi-Fi IPv4 is found
};

// Get the Wi-Fi IP and update .env file
const wifiIP = getWiFiIPv4();
const envPath = path.resolve(__dirname, '.env');
const envContent = `REACT_APP_BASE_URL=http://${wifiIP}:5000/`;//start frontend in wifi address

fs.writeFileSync(envPath, envContent, { encoding: 'utf8' });
console.log(`Updated .env with REACT_APP_BASE_URL: ${envContent}`);