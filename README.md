# Smart Home Control Dashboard 🏠

A web-based IoT dashboard for controlling smart home devices (lights, appliances, garage doors, etc.) in real-time. Built with **HTML/JS** and **Firebase Realtime Database**, featuring secure user authentication via **Google Sign-In**.

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **🔐 Secure Authentication:** Login via Email/Password or **Google Sign-In**.
- **⚡ Real-time Control:** Toggling a switch updates the database instantly (<100ms latency).
- **📱 Responsive Design:** Works seamlessly on mobile, tablet, and desktop.
- **🔄 Live Sync:** Multiple devices stay in sync (if you turn a light on from your phone, your laptop updates instantly).
- **🎛️ Master Control:** "Turn All On" and "Turn All Off" buttons for quick management.
- **⚙️ Activity Log:** View a local history of actions performed during the session.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript (ES6 Modules)
- **Backend:** Firebase Realtime Database
- **Authentication:** Firebase Auth (Email & Google Provider)
- **Icons:** Heroicons (SVG)

## 🚀 Getting Started

### Prerequisites
- A Google Account (for Firebase setup)
- A code editor (VS Code recommended)
- A local server (e.g., Live Server extension for VS Code)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name
