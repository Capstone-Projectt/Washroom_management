#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESPmDNS.h>
#include <ArduinoJson.h>

// Wi-Fi credentials
const char* ssid = "Vaibhav";
const char* password = "vaibhav@123";

// Global variable for Flask server URL
String flaskServerUrl;


// Custom I2C Pins for OLED
#define I2C_SDA 18  // GPIO16 for SDA
#define I2C_SCL 19  // GPIO17 for SCL

// OLED display setup
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// GPIO pins for reed switches and relays
const int reedSwitch1Pin = 4;  // Reed Switch 1 on GPIO 4
const int reedSwitch2Pin = 5;  // Reed Switch 2 on GPIO 5
const int relay1Pin = 23;      // Relay for Washroom 1
const int relay2Pin = 22;      // Relay for Washroom 2

// Web server setup
WebServer server(80);

// Variables to track washroom usage counts and status
int washroom1Count = 0;
int washroom2Count = 0;
bool washroom1Enabled = true;  // Tracking whether counting is enabled for Washroom 1
bool washroom2Enabled = true;  // Tracking whether counting is enabled for Washroom 2

// Function to initialize OLED display
void initOLED() {
    if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("SSD1306 allocation failed"));
        for(;;);
    }
    display.clearDisplay();
    display.setTextSize(2);
    display.setTextColor(SSD1306_WHITE);
    display.display();
}

// Function to update OLED display
void updateOLED(const char* line1, const char* line2) {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.print(line1);
    display.setCursor(0, 20);
    display.print(line2);
    display.display();
}

#include <ArduinoJson.h>

// Lock door handler
void handleLock() {
    String body = server.arg("plain"); // Get the raw JSON body

    // Create a JSON document
    DynamicJsonDocument doc(1024);

    // Deserialize JSON payload
    DeserializationError error = deserializeJson(doc, body);
    if (error) {
        server.send(400, "application/json", "{\"error\": \"Invalid JSON\"}");
        return;
    }

    // Extract washroomId from JSON
    int washroomId = doc["washroomId"];
    if (washroomId == 1) {
        digitalWrite(relay1Pin, HIGH);
        updateOLED("Washroom 1", "Not for use");
        washroom1Enabled = false;
    } else if (washroomId == 2) {
        digitalWrite(relay2Pin, HIGH);
        updateOLED("Washroom 2", "Not for use");
        washroom2Enabled = false;
    }

    server.send(200, "application/json", "{\"status\": \"Door locked\"}");
}

// Unlock door handler
void handleUnlock() {
    String body = server.arg("plain"); // Get the raw JSON body

    // Create a JSON document
    DynamicJsonDocument doc(1024);

    // Deserialize JSON payload
    DeserializationError error = deserializeJson(doc, body);
    if (error) {
        server.send(400, "application/json", "{\"error\": \"Invalid JSON\"}");
        return;
    }

    // Extract washroomId from JSON
    int washroomId = doc["washroomId"];
    if (washroomId == 1) {
        digitalWrite(relay1Pin, LOW);
        updateOLED("Washroom 1", "Ready for use");
        washroom1Enabled = true;
        washroom1Count = 0;
    } else if (washroomId == 2) {
        digitalWrite(relay2Pin, LOW);
        updateOLED("Washroom 2", "Ready for use");
        washroom2Enabled = true;
        washroom2Count = 0;
    }

    server.send(200, "application/json", "{\"status\": \"Door unlocked\"}");
}

void setup() {
    Serial.begin(115200);

    // Initialize I2C with custom pins
    Wire.begin(I2C_SDA, I2C_SCL);//display pins

    // Initialize GPIO pins
    pinMode(reedSwitch1Pin, INPUT_PULLUP); //sensors pins
    pinMode(reedSwitch2Pin, INPUT_PULLUP);
    pinMode(relay1Pin, OUTPUT);//
    pinMode(relay2Pin, OUTPUT);

    digitalWrite(relay1Pin, LOW);
    digitalWrite(relay2Pin, LOW);

    // Initialize OLED display
    initOLED();
    updateOLED("System Ready", "");

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP());

    // Start mDNS
    if (!MDNS.begin("esp32")) {
        Serial.println("Error starting mDNS");
        return;
    }
    Serial.println("mDNS started");

    // Resolve Flask server hostname via mDNS
    IPAddress flaskIP = MDNS.queryHost("flask-server");
    if (flaskIP) {
        flaskServerUrl = "http://" + flaskIP.toString() + ":5000/api/update_usage_count";
        Serial.print("Flask Server URL: ");
        Serial.println(flaskServerUrl);
    } else {
        Serial.println("Failed to resolve Flask server hostname");
    }

    // Start web server and define endpoints
    server.on("/lock", HTTP_POST, handleLock);
    server.on("/unlock", HTTP_POST, handleUnlock);
    server.begin();

    // Print webserver started message
    Serial.print("Webserver started with IP: ");
    Serial.println(WiFi.localIP());
}

void loop() {
    server.handleClient();

    static int lastState1 = HIGH;
    static int lastState2 = HIGH;

    int currentState1 = digitalRead(reedSwitch1Pin);
    int currentState2 = digitalRead(reedSwitch2Pin);

    if (washroom1Enabled && currentState1 == LOW && lastState1 == HIGH) {
        washroom1Count++;
        Serial.println("Washroom 1 used");
        Serial.println(washroom1Count);
        sendUsageUpdate(1, washroom1Count);

        if (washroom1Count >= 30) {
            Serial.println("Washroom 1 limit reached. Disabling usage.");
            washroom1Enabled = false;
            updateOLED("Washroom 1", "Not for Use");
        }
        delay(100);
    }

    if (washroom2Enabled && currentState2 == LOW && lastState2 == HIGH) {
        washroom2Count++;
        Serial.println("Washroom 2 used");
        Serial.println(washroom2Count);
        sendUsageUpdate(2, washroom2Count);

        if (washroom2Count >= 30) {
            Serial.println("Washroom 2 limit reached. Disabling usage.");
            washroom2Enabled = false;
            updateOLED("Washroom 2", "Not for Use");
        }
        delay(100);
    }

    lastState1 = currentState1;
    lastState2 = currentState2;
}

// Function to send usage count updates to Flask API
void sendUsageUpdate(int washroomId, int count) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(flaskServerUrl);
        http.addHeader("Content-Type", "application/json");

        String jsonPayload = "{\"washroom_id\": " + String(washroomId) + ", \"count\": " + String(count) + "}";
        int httpResponseCode = http.POST(jsonPayload);

        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println("HTTP Response Code: " + String(httpResponseCode));
            Serial.println("Response: " + response);
        } else {
            Serial.println("Error on sending POST: " + String(httpResponseCode));
        }

        http.end();
    } else {
        Serial.println("Error: WiFi not connected");
    }
}