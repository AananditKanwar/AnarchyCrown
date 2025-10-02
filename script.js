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

    getCardHtml() {
        return `
            <div class="card" data-post-id="${this.id}">
                <h3>${this.title}</h3>
                <p class="card-meta">By ${this.author} &bull; ${this.date}</p>
                <p class="card-snippet">${this.snippet}</p>
                <div class="card-read-more">
                    Read More &rarr; (${this.comments.length} comments)
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


// --- MAIN APPLICATION LOGIC ---
document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK JSON DATA FOR THE ENTIRE FEED ---
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
    
    const blogPosts = JSON.parse(blogFeedDataJSON).map(data => new Post(data));
    
    let currentPostId = null;

    // --- DOM Elements ---
    const feedView = document.getElementById('feed-view');
    const postView = document.getElementById('post-view');
    const blogFeedContainer = document.getElementById('blog-feed-container');
    const blogPostContainer = document.getElementById('blog-post-container');
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    const backToFeedBtn = document.getElementById('back-to-feed');

    const createView = document.getElementById('create-view');
    const createNewPostBtn = document.getElementById('create-new-post-btn');
    const createPostForm = document.getElementById('create-post-form');
    const cancelPostBtn = document.getElementById('cancel-post-btn');

    // --- VIEW MANAGEMENT ---
    const showFeedView = () => {
        window.scrollTo(0, 0);
        feedView.classList.remove('hidden');
        postView.classList.add('hidden');
        createView.classList.add('hidden');
        currentPostId = null;
    };

    const showPostView = (postId) => {
        window.scrollTo(0, 0);
        currentPostId = postId;
        feedView.classList.add('hidden');
        postView.classList.remove('hidden');
        createView.classList.add('hidden');
        renderPost(postId);
    };

    // --- RENDER FUNCTIONS ---
    const renderFeed = () => {
        blogFeedContainer.innerHTML = blogPosts.map(post => post.getCardHtml()).join('');
        
        document.querySelectorAll('[data-post-id]').forEach(card => {
            card.addEventListener('click', () => {
                showPostView(card.dataset.postId);
            });
        });
    };

    const showCreateView = () => {
        window.scrollTo(0, 0);
        feedView.classList.add('hidden');
        postView.classList.add('hidden');
        createView.classList.remove('hidden');
    };

    const renderPost = (postId) => {
        const post = blogPosts.find(p => p.id === postId);
        if (!post) return;

        blogPostContainer.innerHTML = `
            <h2>${post.title}</h2>
            <div class="post-meta">
                <span>By ${post.author}</span><span>&bull;</span><span>${post.date}</span>
            </div>
            <div class="content-wrapper">${post.content}</div>
        `;
        renderComments(post.comments);
    };

    const renderComments = (comments) => {
        if (comments.length === 0) {
            commentsList.innerHTML = '<p>No comments yet. Be the first to start the discussion!</p>';
            return;
        }
        commentsList.innerHTML = comments.map(comment => comment.getHtml()).join('');
    };

    // --- EVENT HANDLERS ---
    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const post = blogPosts.find(p => p.id === currentPostId);
        if (!post) return;

        const usernameInput = document.getElementById('username');
        const commentTextInput = document.getElementById('comment-text');

        post.addComment(usernameInput.value.trim(), commentTextInput.value.trim());

        renderComments(post.comments);
        renderFeed(); 
        
        commentForm.reset();
    };

    // --- Event handler for creating a post ---
    const handlePostSubmit = (event) => {
        event.preventDefault();

        // 1. Get data from the form
        const postData = {
            id: `post-${Date.now()}`, // Create a unique ID
            title: document.getElementById('post-title').value.trim(),
            author: document.getElementById('post-author').value.trim(),
            snippet: document.getElementById('post-snippet').value.trim(),
            content: document.getElementById('post-content').value.trim(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            }),
            comments: [] // New posts have no comments
        };

        // 2. Create a new Post instance
        const newPost = new Post(postData);

        // 3. Add the new post to the beginning of our data array
        blogPosts.unshift(newPost);
        
        // 4. Re-render the feed to show the new post
        renderFeed();

        // 5. Clean up and switch views
        createPostForm.reset();
        showFeedView();
    };

    // --- INITIALIZATION ---
    renderFeed();
    backToFeedBtn.addEventListener('click', showFeedView);
    commentForm.addEventListener('submit', handleCommentSubmit);
    createNewPostBtn.addEventListener('click', showCreateView);
    cancelPostBtn.addEventListener('click', showFeedView);
    createPostForm.addEventListener('submit', handlePostSubmit);
});