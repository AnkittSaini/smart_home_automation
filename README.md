# Smart Home Control Dashboard 🏠

A web-based IoT dashboard for controlling smart home devices (lights, appliances, garage doors, etc.) in real-time. Built with **HTML/JS** and **Firebase Realtime Database**, featuring secure user authentication via **Google Sign-In** and hardware integration with **ESP32**.

![Project Status](https://img.shields.io/badge/status-active-success)

## 🔗 Live Demo
[View Live Dashboard](https://AnkittSaini.github.io/smart_home_automation/)

## 🔌 Hardware Integration (ESP32 + Relay Module)

This project is a complete **end-to-end Smart Home Automation system**, integrating a web-based dashboard with real hardware using cloud communication.

### ⚙️ System Architecture

- Smart home devices are connected to the home Wi-Fi network.
- The web dashboard communicates with **Firebase Realtime Database**.
- An **ESP32 microcontroller** is connected to the same Firebase project and listens for real-time updates.
- Appliances are controlled using **relay modules** interfaced with the ESP32.

### 🔄 Data Flow

1. User presses a control button (e.g., Light ON/OFF) on the dashboard.
2. The dashboard writes a boolean value (`true` / `false`) to Firebase Realtime Database.
3. ESP32 continuously monitors Firebase for value changes.
4. Based on the received value:
   - `true` → GPIO HIGH → Relay ON → Appliance ON
   - `false` → GPIO LOW → Relay OFF → Appliance OFF
5. The relay physically switches the connected home appliance.

## ✨ Features

- **🔐 Secure Authentication:** Login via Email/Password or **Google Sign-In**.
- **⚡ Real-time Control:** Toggling a switch updates the database instantly (<100ms latency).
- **📱 Responsive Design:** Works seamlessly on mobile, tablet, and desktop.
- **🔄 Live Sync:** Multiple devices stay in sync (if you turn a light on from your phone, your laptop updates instantly).
- **🎛️ Master Control:** "Turn All On" and "Turn All Off" buttons for quick management.
- **⚙️ Activity Log:** View a local history of actions performed during the session.

## 🛠️ Tech Stack

**Web Dashboard:**
- **Frontend:** HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript (ES6 Modules)
- **Backend:** Firebase Realtime Database
- **Authentication:** Firebase Auth (Email & Google Provider)

**Hardware:**
- **Microcontroller:** ESP32 Development Board
- **Actuators:** 8-Channel 5V Relay Module
- **Language:** C++ (Arduino IDE)
- **Library:** Firebase ESP32 Client

## 🚀 Getting Started

### 1. Web Dashboard Setup

**Setup Firebase:**
1. Create a new project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Realtime Database** (start in test mode) and **Authentication** (enable Google and Email/Password providers).
3. Copy your Firebase config object (API Key, Auth Domain, etc.) into your JavaScript configuration file.

**Run Locally:**
1. Clone the repository:
   ```bash
   git clone [https://github.com/Ankit1576734/smart_home_automation.git](https://github.com/Ankit1576734/smart_home_automation.git)

2. Open the folder in VS Code.

3. Use the Live Server extension to launch index.html.

## 📡 Firmware Setup (ESP32)
To connect your hardware to the dashboard, upload the following code to your ESP32.

1. Wiring Guide (GPIO Mapping)
   - Connect your Relay Module pins to the ESP32 as defined below:
   | Relay Channel | ESP32 GPIO Pin |
   | :--- | :--- |
   | **Relay 1** | GPIO 23 |
   | **Relay 2** | GPIO 22 |
   | **Relay 3** | GPIO 21 |
   | **Relay 4** | GPIO 19 |
   | **Relay 5** | GPIO 18 |
   | **Relay 6** | GPIO 5 |
   | **Relay 7** | GPIO 4 |
   | **Relay 8** | GPIO 2 |
2. Arduino IDE Setup
- Open Arduino IDE and install the ESP32 Board Manager.
- Go to Sketch > Include Library > Manage Libraries.
- Search for and install "Firebase ESP32 Client" by Mobizt.
- Select your board (e.g., DOIT ESP32 DEVKIT V1) and upload the code below.

