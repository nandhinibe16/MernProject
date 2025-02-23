# E-Commerce Application (MERN Stack)

Introduction

This project is a fully functional e-commerce application built using the MERN stack (MongoDB, Express.js, React, and Node.js). It includes user authentication, product management, cart functionality, payment gateway integration (Razorpay), history and analytics.

# Features

User authentication (Login, Registration)

Product listing and search functionality

Shopping cart management

Secure payment gateway integration using Razorpay

Order placement

Admin panel for product management

Responsive UI design

# Technologies Used

MERN Stack

MongoDB: NoSQL database for storing user data, product details, and orders

Express.js: Backend framework for handling API requests and routing

React.js: Frontend library for building the user interface

Node.js: JavaScript runtime for server-side logic

Other Technologies

Razorpay: Payment gateway integration

JWT (JSON Web Token): Secure user authentication

Bcrypt.js: Password hashing for secure authentication

Redux: State management for frontend

Bootstrap: UI styling framework

CORS: Cross-Origin Resource Sharing handled in backend to allow API calls

GitHub: Version control and project collaboration

# Installation Guide

Prerequisites

Node.js (Latest version)

MongoDB installed and running

Git

Steps to Run the Application

Clone the repository:

git clone https://github.com/nandhinibe16/MernProject

Install dependencies:

cd ../backend
npm install
cd ../frontend
npm install

Set up environment variables:
Create a .env file in the backend directory and add the following:

JWT_SECRET=MyJWTSecretKeyForApiEndPoints
RAZORPAY_KEY_ID=razorpay_key_id
RAZORPAY_KEY_SECRET=razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret_value

Start the backend server:

cd ../backend
npm run dev

Start the frontend application:

cd ../frontend
npm run start