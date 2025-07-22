# 🌍 Where in the world? - Interactive Countries App

## Project Overview

A responsive web application built with HTML, CSS, and JavaScript, consuming the REST Countries API. Developed as a coding challenge, it demonstrates UI interpretation, data fetching, and dynamic content rendering.

## Key Features

* **Country Listing:** Displays all countries alphabetically in a responsive card layout.
* **Search & Filter:** Allows searching countries by name and filtering by region.
* **Detail View:** Clicking a country shows a dedicated detail page with comprehensive information.
* **Border Navigation:** Clickable border country tags navigate to their respective detail pages.
* **Theme Toggle:** Switches between light and dark modes, saving preference in local storage.
* **Responsive Design:** Adapts fluidly to desktop (4 columns), tablet (2 columns), and mobile (1 column).
* **Clean Architecture:** Modular JavaScript (ES Modules) with clear separation of concerns (App, Models).

## Technologies Used

* **HTML5**
* **CSS3** (Flexbox, Grid, Media Queries)
* **JavaScript (ES6+)**
* **REST Countries API v3.1**
* **Font Awesome**
* **Google Fonts (Poppins)**

## How to Run Locally

This application uses ES Modules and requires a local web server to run due to browser security policies (CORS).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pedrokeilerbatistarojo/country-app.git
    cd country-app
    ```
2.  **Install `http-server` globally** (requires Node.js & npm):
    ```bash
    npm install -g http-server
    ```
3.  **Start the server** from the project root:
    ```bash
    http-server
    ```
4.  **Open in browser:** Navigate to `http://localhost:8080` (or the port shown in your terminal).
5.  **Stop server:** Press `CTRL + C` in the terminal.

## Learnings

This project reinforced skills in API integration, DOM manipulation, modular JavaScript development, and advanced responsive design techniques.