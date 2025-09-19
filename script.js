class Post {
    constructor(postData) {
        this.id = postData.id;
        this.title = postData.title;
        this.author = postData.author;
        this.date = postData.date;
        this.snippet = postData.snippet;
        this.content = postData.content;
        this.comments = postData.comments.map(commentData => new Comment(commentData));
    }

    getCardHTML() {
        return `
            <div class="card" data-post-id="${this.id}">
                <h3>${this.title}</h3>
                <p class="card-meta">By ${this.author} &bull; ${this.date}</p>
                <p class="card-snippet">${this.snippet}</p>
                <div class="card-read-more">
                    Read More; (${this.comments.length} comments)
                </div>
            </div>
        `;
    }

    addComment(user, text) {
        const newComment = new Comment({ user, text });
        this.comments.push(newComment);
    }
}

class Comment {
    constructor(commentData) {
        this.user = commentData.user;
        this.text = commentData.text;
    }

    getHtml() {
        const initial = this.user.charAt(0).toUpperCase();
        return `
            <div class="comment">
                <div class="comment-avatar">
                    <span>${initial}</span>
                </div>
                <div class="comment-body">
                    <p class="comment-user">${this.user}</p>
                    <p class="comment-text">${this.text}</p>
                </div>
            </div>
        `;
    }
}

// Main app logic
document.addEventListener('DOMContentLoaded', () => {
    const blogFeedDataJSON = `
    [
        {
            "id": "post-001",
            "title": "Building Interactive UIs with Just JavaScript",
            "author": "Alex Doe",
            "date": "September 02, 2025",
            "snippet": "In an era dominated by frameworks, it's easy to forget the power of vanilla JavaScript. Let's explore the advantages of building directly with DOM APIs.",
            "content": "<p>In an era dominated by frameworks like React, Angular, and Vue, it's easy to forget the power and simplicity of vanilla JavaScript. While frameworks offer structure and scalability, they can sometimes be overkill for smaller projects or for developers who want to stay closer to the metal of the web platform.<\\/p><img src=\\"https://placehold.co/800x400/6366f1/ffffff?text=JavaScript+Power\\" alt=\\"JavaScript Code\\"><h3>The Advantages of Going Vanilla<\\/h3><p>Building directly with the DOM APIs gives you a deeper understanding of how the browser works. There's no magic, no hidden abstractions—just you and the platform. This leads to lighter, faster applications because you only ship the code you need, without the overhead of a framework's runtime.<\\/p>",
            "comments": [
                { "user": "Jane Smith", "text": "Great point! I've been using vanilla JS for a few small projects lately and it feels very empowering." }
            ]
        },
        {
            "id": "post-002",
            "title": "A Deep Dive into Modern CSS",
            "author": "Brenda Moe",
            "date": "September 01, 2025",
            "snippet": "CSS has evolved far beyond colors and borders. We'll look at Flexbox, Grid, and custom properties that have revolutionized web layout.",
            "content": "<p>CSS has evolved far beyond colors and borders. We'll look at Flexbox, Grid, and custom properties that have revolutionized web layout. These tools provide robust and flexible ways to create complex layouts with cleaner and more maintainable code.<\\/p><img src=\\"https://placehold.co/800x400/34d399/ffffff?text=Modern+CSS\\" alt=\\"CSS Code\\"><h3>Flexbox vs. Grid<\\/h3><p>While Flexbox is designed for one-dimensional layouts (either a row or a column), Grid is designed for two-dimensional layouts (rows and columns). Understanding when to use each is key to mastering modern CSS.<\\/p>",
            "comments": [
                { "user": "Chris Lee", "text": "I finally understand the difference between Flexbox and Grid. Thanks!" },
                { "user": "Pat Kim", "text": "Custom properties are a game changer for theming." }
            ]
        },
        {
            "id": "post-003",
            "title": "The Rise of Static Site Generators",
            "author": "Sam Roe",
            "date": "August 28, 2025",
            "snippet": "Why are developers moving back to static sites? Discover the benefits of performance, security, and simplicity offered by tools like Astro, Eleventy, and Hugo.",
            "content": "<p>Why are developers moving back to static sites? Discover the benefits of performance, security, and simplicity offered by tools like Astro, Eleventy, and Hugo. These generators take your content, apply templates, and generate a set of static HTML files that can be served incredibly fast.<\\/p><img src=\\"https://placehold.co/800x400/fbbf24/ffffff?text=Static+Sites\\" alt=\\"Static Site Architecture\\"><h3>Key Benefits<\\/h3><p>Static sites are inherently more secure because there's no database or server-side processing to exploit. They are also blazing fast, as they are just plain HTML files served from a CDN.<\\/p>",
            "comments": []
        }
    ]
    `;

    const blogPosts = JSOM.parse(blogFeedDataJSON).map(data => new Post(data));
    let currentPostID = null;

    // DOM Elements
    const feedView = document.getElementById('feed-view');
    const postview = document.getElementById('post-view');
    const blogFeedContainer = document.getElementById('blog-feed-container');
    const blogPostContainer = document.getElementById('blog-post-container');
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    const commentUserInput = document.getElementById('comment-user');
    const commentTextInput = document.getElementById('comment-text');
    const backToFeedButton = document.getElementById('back-to-feed');

    // view toggling
    function showFeedView() {
        window.scrollTo(0, 0);
        feedView.classList.remove('hidden');
        postview.classList.add('hidden');
        currentPostID = null;
    }

    const showPostView = (postId) => {
        window.scrollTo(0, 0);
        currentPostId = postId;
        feedView.classList.add('hidden');
        postView.classList.remove('hidden');
        renderPost(postId);
    };

    // render function
    const renderFeed = () => {
        blogFeedContainer.innerHTML = blogPosts.map(post => post.getCardHTML()).join('');
        
    }
});

