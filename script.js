class Post {
    constructor(postData) {
        this.id = postData.id;
        this.title = postData.title;
        this.author = postData.author;
        this.date = postData.date;
        this.imageUrl = postData.imageUrl; 
        this.snippet = postData.snippet;
        this.content = postData.content;
        // MODIFIED: Ensure comments are created as Comment instances
        this.comments = postData.comments.map(commentData => new Comment(commentData));
    }

    // MODIFIED: Now accepts 'isAdmin' to conditionally show buttons
    getCardHtml(isAdmin) {
        return `
            <div class="card" data-post-id="${this.id}">
                <img src="${this.imageUrl}" alt="" class="card-image">
                <div class="card-content">
                    <h3>${this.title}</h3>
                    <p class="card-meta">By ${this.author} &bull; ${this.date}</p>
                    <p class="card-snippet">${this.snippet}</p>
                    <div class="card-read-more">
                        Read More &rarr; (${this.comments.length} comments)
                    </div>
                </div>
                ${isAdmin ? `
                <div class="card-actions">
                    <button class="btn btn-edit-post" data-post-id="${this.id}">Edit</button>
                    <button class="btn btn-delete-post" data-post-id="${this.id}">Delete</button>
                </div>
                ` : ''}
            </div>
        `;
    }

    addComment(user, text) {
        // MODIFIED: Add a unique ID to each comment
        const newComment = new Comment({ id: `comment-${Date.now()}`, user, text });
        this.comments.push(newComment);
    }
}

class Comment {
    constructor(commentData) {
        // MODIFIED: Store the comment ID
        this.id = commentData.id || `comment-legacy-${Math.random()}`; // Handle old comments
        this.user = commentData.user;
        this.text = commentData.text;
    }

    // MODIFIED: Now accepts 'isAdmin' and 'postId'
    getHtml(isAdmin, postId) {
        const initial = this.user.charAt(0).toUpperCase();
        return `
            <div class="comment">
                <div class="comment-avatar">
                    <span>${initial}</span>
                </div>
                <div class="comment-body">
                    <p class="comment-user">${this.user}</p>
                    <p class="comment-text">${this.text}</p>
                    ${isAdmin ? `
                    <button class="btn-delete-comment" data-comment-id="${this.id}" data-post-id="${postId}">Delete</button>
                    ` : ''}
                </div>
            </div>
        `;
    }
}


// --- MAIN APPLICATION LOGIC ---
document.addEventListener('DOMContentLoaded', () => {

    // --- !! IMPORTANT: SET YOUR ADMIN KEY HERE !! ---
    // This key will be hidden from GitHub because script.js is in .gitignore
    const ADMIN_KEY = 'wars-of-the-roses-1455'; 

    // --- STATE VARIABLES ---
    let blogPosts = [];
    let currentPostId = null;
    let isAdmin = false;        // Tracks admin status for the session
    let editingPostId = null;   // Tracks which post is being edited
    
    // --- LOCALSTORAGE FUNCTIONS ---
    const savePosts = (posts) => {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    };

    const loadPosts = () => {
        // Paste your full mock data string here
        const blogFeedDataJSON = `
        [
            {
                "id": "post-001",
                "title": "The Seeds of Discontent: Origins of the Wars of the Roses",
                "author": "Eleanor of Cambridge",
                "date": "October 07, 2025",
                "snippet": "The Wars of the Roses did not erupt overnight. They were the culmination of decades of political instability, military defeats in France, and the personal failings of a weak king, Henry VI.",
                "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Choosing_the_Red_and_White_Roses.jpg?20191003083734",
                "content": "<h3>A Kingdom in Crisis<\\/h3><p>To understand the Wars of the Roses, one must first look at the state of England in the mid-15th century. The disastrous end of the Hundred Years' War left the English nobility humiliated and financially ruined. At the center of this storm was King Henry VI of the House of Lancaster. Pious and gentle, he was wholly unsuited for the cutthroat politics of his time, suffering from recurring bouts of mental illness that left a power vacuum at the heart of government.<\\/p><p>This vacuum was eagerly filled by ambitious nobles, most notably Richard, Duke of York. As the wealthiest man in England with a strong claim to the throne himself, York positioned himself as a reformer against the corruption of the court, particularly the influence of the Queen, Margaret of Anjou. The clash between these two factions set the stage for civil war.<\\/p>",
                "comments": [
                    { "id": "comment-1", "user": "Thomas P.", "text": "An excellent summary. The loss in France is often understated as a primary cause." },
                    { "id": "comment-2", "user": "Anne V.", "text": "Henry VI was truly a tragic figure, born into the wrong era." }
                ]
            },
            {
                "id": "post-002",
                "title": "Warwick the Kingmaker: The Ultimate Power Broker",
                "author": "Arthur Polydore",
                "date": "October 06, 2025",
                "snippet": "No single figure better embodies the shifting allegiances and raw ambition of the era than Richard Neville, Earl of Warwick. His immense wealth and political cunning allowed him to place kings on the throne—and remove them.",
                "imageUrl": "https://www.factinate.com/storage/app/media/factinate/2019/01/Screenshot_5-1.jpg",
                "content": "<h3>The Kingmaker's Game<\\/h3><p>Richard Neville, 16th Earl of Warwick, was known as the 'Kingmaker' for a reason. His vast estates and network of retainers gave him power comparable to the crown itself. Initially a staunch supporter of the Yorkist cause, his military and political backing were instrumental in deposing Henry VI and placing Edward IV on the throne in 1461.<\\/p><p>However, Warwick's relationship with the new king soured. Feeling betrayed, Warwick did the unthinkable: he switched sides, allied with his former nemesis Margaret of Anjou, and led a rebellion that briefly restored Henry VI to the throne. This audacious move ultimately led to his downfall and death at the Battle of Barnet.<\\/p>",
                "comments": [
                    { "id": "comment-3", "user": "Yorkist_Standard", "text": "Warwick was a traitor to the Yorkist cause. He let his pride get the better of him." },
                    { "id": "comment-4", "user": "Cecily N.", "text": "You can't deny his genius, though. To successfully switch sides at that level is incredible." }
                ]
            }
        ]
        `; 
        // NOTE: Make sure to paste your *full* mock data list back in here.
        // I also added "id" fields to the comments in the mock data.

        const postsFromStorage = localStorage.getItem('blogPosts');
        if (postsFromStorage) {
            const plainObjects = JSON.parse(postsFromStorage);
            return plainObjects.map(data => new Post(data));
        } else {
            const initialPosts = JSON.parse(blogFeedDataJSON).map(data => new Post(data));
            savePosts(initialPosts);
            return initialPosts;
        }
    };

    // Load initial posts
    blogPosts = loadPosts();

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

    const showCreateView = () => {
        window.scrollTo(0, 0);
        feedView.classList.add('hidden');
        postView.classList.add('hidden');
        createView.classList.remove('hidden');
    };

    // --- RENDER FUNCTIONS (MODIFIED) ---
    const renderFeed = () => {
        // Pass 'isAdmin' to getCardHtml to show/hide buttons
        blogFeedContainer.innerHTML = blogPosts.map(post => post.getCardHtml(isAdmin)).join('');
        
        // Main card click listener
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                // IMPORTANT: Don't open post if admin button was clicked
                if (!e.target.closest('.card-actions')) {
                    showPostView(card.dataset.postId);
                }
            });
        });

        // NEW: Add listeners for admin buttons
        if (isAdmin) {
            document.querySelectorAll('.btn-edit-post').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop card click
                    handleEditPost(e.target.dataset.postId);
                });
            });
            document.querySelectorAll('.btn-delete-post').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop card click
                    handleDeletePost(e.target.dataset.postId);
                });
            });
        }
    };

    const renderPost = (postId) => {
        const post = blogPosts.find(p => p.id === postId);
        if (!post) {
            showFeedView(); // Post might have been deleted, go back to feed
            return;
        }
        blogPostContainer.innerHTML = `
            <img src="${post.imageUrl}" alt="" class="post-image">
            <h2>${post.title}</h2>
            <div class="post-meta">
                <span>By ${post.author}</span><span>&bull;</span><span>${post.date}</span>
            </div>
            <div class="content-wrapper">${post.content}</div>
        `;
        renderComments(post.comments, post.id); // Pass post.id
    };

    const renderComments = (comments, postId) => {
        if (comments.length === 0) {
            commentsList.innerHTML = '<p>No comments yet. Be the first to start the discussion!</p>';
            return;
        }
        // Pass 'isAdmin' and 'postId' to getHtml
        commentsList.innerHTML = comments.map(comment => comment.getHtml(isAdmin, postId)).join('');

        // NEW: Add listeners for admin delete comment buttons
        if (isAdmin) {
            document.querySelectorAll('.btn-delete-comment').forEach(button => {
                button.addEventListener('click', (e) => {
                    handleDeleteComment(e.target.dataset.commentId, e.target.dataset.postId);
                });
            });
        }
    };

    // --- EVENT HANDLERS ---
    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const post = blogPosts.find(p => p.id === currentPostId);
        if (!post) return;

        const usernameInput = document.getElementById('username');
        const commentTextInput = document.getElementById('comment-text');

        post.addComment(usernameInput.value.trim(), commentTextInput.value.trim());

        savePosts(blogPosts);
        renderComments(post.comments, post.id); // Pass post.id
        renderFeed(); 
        
        commentForm.reset();
    };

    // MODIFIED: Now handles BOTH Create and Update
    const handlePostSubmit = (event) => {
        event.preventDefault();

        if (editingPostId) {
            // --- UPDATE LOGIC ---
            const post = blogPosts.find(p => p.id === editingPostId);
            post.title = document.getElementById('post-title').value.trim();
            post.author = document.getElementById('post-author').value.trim();
            post.snippet = document.getElementById('post-snippet').value.trim();
            post.content = document.getElementById('post-content').value.trim();
            post.imageUrl = document.getElementById('post-image-url').value.trim();
        } else {
            // --- CREATE LOGIC (your existing code) ---
            const postData = {
                id: `post-${Date.now()}`,
                title: document.getElementById('post-title').value.trim(),
                author: document.getElementById('post-author').value.trim(),
                snippet: document.getElementById('post-snippet').value.trim(),
                content: document.getElementById('post-content').value.trim(),
                imageUrl: document.getElementById('post-image-url').value.trim(),
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                comments: []
            };
            const newPost = new Post(postData);
            blogPosts.unshift(newPost);
        }

        savePosts(blogPosts);
        renderFeed();
        createPostForm.reset();
        showFeedView();
        
        // Reset form to "Create" state
        editingPostId = null;
        document.querySelector('#create-view h2').textContent = 'Create a New Post';
        document.querySelector('#create-post-form button[type="submit"]').textContent = 'Publish Post';
    };

    // --- NEW: Admin CRUD Functions ---
    const handleEditPost = (postId) => {
        const post = blogPosts.find(p => p.id === postId);
        if (!post) return;

        editingPostId = postId;

        // Populate the form with the post's data
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-author').value = post.author;
        document.getElementById('post-image-url').value = post.imageUrl;
        document.getElementById('post-snippet').value = post.snippet;
        document.getElementById('post-content').value = post.content;
        
        // Change form title and button text
        document.querySelector('#create-view h2').textContent = 'Edit Post';
        document.querySelector('#create-post-form button[type="submit"]').textContent = 'Save Changes';
        
        showCreateView();
    };

    const handleDeletePost = (postId) => {
        if (confirm('Are you sure you want to permanently delete this post?')) {
            blogPosts = blogPosts.filter(post => post.id !== postId);
            savePosts(blogPosts);
            
            // If we deleted the post we were viewing, go back to feed
            if (currentPostId === postId) {
                showFeedView();
            }
            renderFeed();
        }
    };

    const handleDeleteComment = (commentId, postId) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            const post = blogPosts.find(p => p.id === postId);
            if (!post) return;
            
            post.comments = post.comments.filter(comment => comment.id !== commentId);
            savePosts(blogPosts);
            
            // Re-render just the comments and the feed (for comment count)
            renderComments(post.comments, post.id);
            renderFeed();
        }
    };

    // --- INITIALIZATION ---
    const initializeApp = () => {
        // All event listeners that don't depend on admin status
        backToFeedBtn.addEventListener('click', showFeedView);
        commentForm.addEventListener('submit', handleCommentSubmit);
        cancelPostBtn.addEventListener('click', showFeedView);
        createPostForm.addEventListener('submit', handlePostSubmit);
        
        createNewPostBtn.addEventListener('click', () => {
            // Reset state in case we were editing
            editingPostId = null; 
            document.querySelector('#create-view h2').textContent = 'Create a New Post';
            document.querySelector('#create-post-form button[type="submit"]').textContent = 'Publish Post';
            createPostForm.reset();
            showCreateView();
        });
        
        // Render the feed based on admin status
        renderFeed();
    };

    // --- NEW: Admin Login Prompt ---
    // Check if admin status is already in the session (e.g., from a refresh)
    if (sessionStorage.getItem('isAdmin') === 'true') {
        isAdmin = true;
        initializeApp();
    } else {
        // If no session, prompt the user
        const mode = prompt('Welcome! Are you a (1) User or (2) Admin?', '1');
        if (mode === '2') {
            const key = prompt('Please enter the Admin Key:');
            if (key === ADMIN_KEY) {
                alert('Admin Mode Activated.');
                isAdmin = true;
                sessionStorage.setItem('isAdmin', 'true'); // Save for session
            } else {
                alert('Incorrect key. Entering User Mode.');
                isAdmin = false;
            }
        } else {
            isAdmin = false;
        }
        initializeApp();
    }
});