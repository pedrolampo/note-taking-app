# Note Taking App

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Setup and Installation](#setup-and-installation)
5. [Usage](#usage)
6. [Firebase Configuration](#firebase-configuration)
7. [Available Scripts](#available-scripts)
8. [Contributing](#contributing)
9. [License](#license)
10. [Live Demo](#live-demo)

## Project Overview

Note Taking App is a responsive web application for creating, managing, and organizing notes and/or documentation. Built with React, it offers a user-friendly interface and robust functionality for personal and professional use.

## Features

- **Note Management**: Create, edit, and delete notes.
- **Categorization**: Organize notes by categories.
- **Teamspaces**: Create workspaces to share private notes with colleagues.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Architecture

The app follows a modern web development architecture, utilizing a React frontend with Firebase as backend. The design is based on a component-based architecture for scalability and maintainability.

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```sh
git clone https://github.com/pedrolampo/note-taking-app.git
cd note-taking-app
npm install
```

## Usage

To start the development server:

```sh
npm start
```

Access the app at http://localhost:3000.

## Firebase Configuration

This project uses Firebase for the backend services, specifically Firestore Database and Authentication. To configure Firebase, follow these steps:

### 1. Set Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In your project, navigate to **Project Settings** and find your Firebase configuration under **Your Apps**.

### 2. Configure Environment Variables

For security reasons, sensitive information like API keys should not be hardcoded in your codebase. Instead, use a `.env` file to store these values.

Create a `.env` file in the root of your project and add the following environment variables with your Firebase configuration:

```
REACT_APP_apiKey=YOUR_API_KEY
REACT_APP_authDomain=YOUR_AUTH_DOMAIN
REACT_APP_projectId=YOUR_PROJECT_ID
REACT_APP_storageBucket=YOUR_STORAGE_BUCKET
REACT_APP_messagingSenderId=YOUR_MESSAGING_SENDER_ID
REACT_APP_appId=YOUR_APP_ID
REACT_APP_passId=YOUR_PASS_ID
```

Replace `YOUR_*` with the corresponding values from your Firebase project settings.

### 3. Initialize Firebase in the Project

The project comes with the configutarion of Firebase and built-in functions within the `src/services/firestore/firebase.js` file.

This includes the following functions:

- getNotes
- getTags
- serachTagsId
- getTodos (deprecated at the moment)
- searchUsers
- getTeamspaces
- getPass
- getPowerUsers

### 4. Firestore Database Structure

The Firestore Database is structured with the following collections:

- data: Collection for storing general data.
- notes: Collection for storing user notes.
- tags: Collection for storing the created tags.
- teamspaces: Collection for storing teamspaces data.
- users: Collection for storing user profiles and information.

### 5. Authentication Setup

Use Firebase Authentication to manage user sign-in and sign-up. You can configure various authentication methods (email/password, Google, etc.) through the Firebase Console.

## Available Scripts

- npm start: Starts the development server.
- npm test: Launches the test runner.
- npm run build: Builds the app for production.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/pedrolampo/note-taking-app/blob/main/LICENSE) file for details.

## Live Demo

Check out the live demo [here](https://peters-notes.vercel.app/).
