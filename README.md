# AnarchyCrown - Wars of the Roses Blog

A single-page application blog focused on discussions about the Wars of the Roses. Built entirely with HTML, CSS, and vanilla JavaScript, using `localStorage` for persistence.



---

## Description

AnarchyCrown provides a platform for history enthusiasts to read, discuss, and contribute blog posts specifically about the Wars of the Roses period in English history. The application runs entirely in the browser, saving posts and comments locally. It also features a simple admin mode to allow for content moderation (editing and deleting).

---

## Features

* **View Posts:** Browse a feed of blog posts with images, titles, snippets, and author details.
* **Read Full Posts:** Click on a post card to view the full content and discussion section.
* **Create Posts:** Add new blog posts via a dedicated form, including title, author, image URL, snippet, and content.
* **Post Comments:** Engage in discussions by adding comments to individual posts.
* **Local Persistence:** All posts and comments are saved in the browser's `localStorage`, so they persist across sessions.
* **Admin Mode:**
    * Accessed via a secret key upon loading the site.
    * Allows editing of existing post content.
    * Allows deletion of any post.
    * Allows deletion of any comment.
* **Responsive Design:** Adapts to various screen sizes, including tablets and smartphones.

---

## Tech Stack

* **HTML5:** For the structure and content.
* **CSS3:** For styling, layout (including responsiveness using Media Queries), and theme.
* **Vanilla JavaScript (ES6+):** For all application logic, including:
    * DOM manipulation
    * Event handling
    * View routing (showing/hiding sections)
    * Data management (using JavaScript classes)
    * Saving/Loading data with `localStorage`
    * Admin mode logic using `sessionStorage`

---

## Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AananditKanwar/AnarchyCrown.git
    cd <repository-folder>
    ```
2.  **Open `index.html`:** Simply open the `index.html` file directly in your web browser. No special server setup is required as the application is entirely client-side.

---

## Admin Mode

This project includes a simulated admin mode for content moderation.

1.  **Access:** When you first load the `index.html` page (or after clearing `sessionStorage`), you will be prompted to choose between **User (1)** or **Admin (2)** mode. Enter `2`.
2.  **Key:** You will then be prompted for the Admin Key. The key is hardcoded inside the `script.js` file.
    *(**Note:** In a real application, this key would be handled securely on a backend server. This method is for prototype purposes only.)*
3.  **Functionality:** Once logged in as Admin, you will see "Edit" and "Delete" buttons appear on all post cards and a "Delete" button on all comments.

---
