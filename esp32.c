#include <WiFi.h>
#include <FirebaseESP32.h>

#define WIFI_SSID "YOUR_WIFI_NAME"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

#define API_KEY "AIzaSyCeaYRq2zOyb-YtJGJ3So4xwyoot21X6oY"
#define DATABASE_URL "https://home-automation-ded78-default-rtdb.europe-west1.firebasedatabase.app/"

#define USER_EMAIL "email@example.com"
#define USER_PASSWORD "password123"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

const int relayPins[8] = {23, 22, 21, 19, 18, 5, 4, 2};

void setup() {
  Serial.begin(115200);

  for(int i=0; i<8; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], LOW);
  }

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Firebase.ready() && (WiFi.status() == WL_CONNECTED)) {
    for (int i = 1; i <= 8; i++) {
      String path = "/relay" + String(i);
      if (Firebase.getBool(fbdo, path)) {
        bool isOn = fbdo.boolData();
        int pinIndex = i - 1;
        
        if (isOn) {
           digitalWrite(relayPins[pinIndex], HIGH);
        } else {
           digitalWrite(relayPins[pinIndex], LOW);
        }
      }
    }
  }
  delay(200);
}
