# ChatApp Frontend

A modern real-time chat application built with **React**, combining familiar messaging and social features inspired by applications like WhatsApp and Instagram. The application provides a responsive and interactive user experience with real-time messaging, friend management, authentication, WebRTC-based calling, and seamless communication across desktop and mobile devices.

## Features

* JWT-based user authentication
* Real-time messaging using WebSocket (STOMP)
* WebRTC support for peer-to-peer audio/video calling
* Friend requests and friend management
* User blocking functionality
* Online / Offline status and typing indicators
* online indicator management
* Unread message count
* Chat deletion support
* dark/light UI themes
* Profile picture support
* customization management
* Activation and deactivation of account management
* Account deletion support
* Responsive design for desktop and mobile

## Technologies Used

* React
* JavaScript (ES6+)
* HTML5
* CSS3
* STOMP.js
* SockJS
* WebRTC
* Axios
* JWT Authentication

## Backend

The frontend communicates with a Spring Boot backend that provides:

* Authentication APIs
* User management
* Friend management
* Real-time messaging
* WebSocket endpoints
* Media upload support
* PostgreSQL database integration

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

The application will run at:

```
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the project root.

```
REACT_APP_BACKEND_URL=http://localhost:8080
```

For production deployments, configure the same environment variable in your hosting platform (such as Vercel).

## Project Highlights

* Real-time communication using WebSockets.
* Peer-to-peer calling implemented with WebRTC.
* Providing friends management and account management.
* Secure communication using JWT authentication.
* Responsive UI designed for multiple screen sizes.

## License

This project is intended for learning and portfolio purposes.

