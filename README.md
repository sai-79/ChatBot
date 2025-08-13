# My Nhost SupaPace

A user authentication system built with React and Nhost. This project demonstrates how to create a simple sign-up and sign-in flow with protected routes.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

- **User Authentication:** Secure sign-up and sign-in using Nhost.
- **Protected Routes:** Restrict access to certain pages (e.g., the dashboard) to authenticated users only.
- **Email Verification:** Users are prompted to verify their email after signing up.
- **Client-Side Routing:** Fast and seamless navigation using `react-router-dom`.

## Technologies Used

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[Nhost](https://nhost.io/)**: An open-source backend for building web and mobile apps, providing authentication, a database, and storage.
- **[React Router DOM](https://reactrouter.com/)**: A standard library for routing in React.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher) and npm installed on your machine.
- An Nhost account and an application set up. You'll need the `NHOST_SUBDOMAIN` and `NHOST_REGION` from your Nhost app settings.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sai-79/ChatBot.git](https://github.com/sai-79/ChatBot.git)
    cd my_nhost_supapace
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the root of your project, create a file named `.env` and add your Nhost configuration:
    ```
    REACT_APP_NHOST_SUBDOMAIN="your-nhost-subdomain"
    REACT_APP_NHOST_REGION="your-nhost-region"
    ```
    Replace the placeholder values with your actual Nhost app details.

4.  **Run the application:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## Project Structure