class Post {
    constructor(postData) {
        this.id = postData.id;
        this.title = postData.title;
        this.author = postData.author;
        this.date = postData.date;
        this.imageUrl = postData.imageUrl; 
        this.snippet = postData.snippet;
        this.content = postData.content;
        this.comments = postData.comments.map(commentData => new Comment(commentData));
    }

    getCardHtml() {
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
            "title": "The Seeds of Discontent: Origins of the Wars of the Roses",
            "author": "Eleanor of Cambridge",
            "date": "October 07, 2025",
            "snippet": "The Wars of the Roses did not erupt overnight. They were the culmination of decades of political instability, military defeats in France, and the personal failings of a weak king, Henry VI.",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Choosing_the_Red_and_White_Roses.jpg?20191003083734",
            "content": "<h3>A Kingdom in Crisis<\\/h3><p>To understand the Wars of the Roses, one must first look at the state of England in the mid-15th century. The disastrous end of the Hundred Years' War left the English nobility humiliated and financially ruined. At the center of this storm was King Henry VI of the House of Lancaster. Pious and gentle, he was wholly unsuited for the cutthroat politics of his time, suffering from recurring bouts of mental illness that left a power vacuum at the heart of government.<\\/p><p>This vacuum was eagerly filled by ambitious nobles, most notably Richard, Duke of York. As the wealthiest man in England with a strong claim to the throne himself, York positioned himself as a reformer against the corruption of the court, particularly the influence of the Queen, Margaret of Anjou. The clash between these two factions set the stage for civil war.<\\/p>",
            "comments": [
                { "user": "Thomas P.", "text": "An excellent summary. The loss in France is often understated as a primary cause." },
                { "user": "Anne V.", "text": "Henry VI was truly a tragic figure, born into the wrong era." }
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
                { "user": "Yorkist_Standard", "text": "Warwick was a traitor to the Yorkist cause. He let his pride get the better of him." },
                { "user": "Cecily N.", "text": "You can't deny his genius, though. To successfully switch sides at that level is incredible." }
            ]
        },
        {
            "id": "post-003",
            "title": "The Battle of Towton: England's Bloodiest Day",
            "author": "Dr. Alistair Finch",
            "date": "October 05, 2025",
            "snippet": "Fought on Palm Sunday in 1461 amidst a blinding snowstorm, the Battle of Towton was the largest and bloodiest battle ever fought on English soil. It was a brutal, decisive clash that secured the throne for Edward IV.",
            "imageUrl": "https://sites.create-cdn.net/siteimages/15/9/4/159417/21/2/2/21227157/1000x863.jpg?1728552647",
            "content": "<h3>Slaughter in the Snow<\\/h3><p>The scale of the Battle of Towton is difficult to comprehend. With an estimated 50,000 to 60,000 soldiers clashing for hours in a blizzard, it was a battle of attrition fought with terrifying ferocity. The Yorkists, led by the young Edward IV, were outnumbered but held a crucial advantage thanks to the wind, which blew snow into the faces of the Lancastrian army.<\\/p><p>After hours of grueling hand-to-hand combat, the Lancastrian line broke. The retreat turned into a rout, and thousands were slaughtered as they fled, with the River Cock reportedly running red with blood. The victory was absolute, crushing Lancastrian power in the north and cementing Edward IV's claim as the rightful king.<\\/p>",
            "comments": [
                { "user": "William H.", "text": "The archaeological findings from the Towton mass graves are chilling. A truly brutal affair." }
            ]
        },
        {
            "id": "post-004",
            "title": "Margaret of Anjou: The She-Wolf of France",
            "author": "Isabelle d'Anvers",
            "date": "October 04, 2025",
            "snippet": "Fierce, proud, and utterly devoted to her husband and son, Margaret of Anjou was the unyielding heart of the Lancastrian cause. To her enemies, she was a foreign she-wolf; to her supporters, she was their queen.",
            "imageUrl": "https://www.thoughtco.com/thmb/-4waV3vVKt1ssXzXTqC5-Kl33w4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Margaret-of-Anjou-463969669x-58b74be75f9b588080559d02.jpg",
            "content": "<h3>A Queen at War<\\/h3><p>While Henry VI faltered, his French queen, Margaret of Anjou, became the de facto leader of the Lancastrian faction. She was a formidable political operator, tirelessly raising armies, forging alliances, and refusing to accept the disinheritance of her son, Edward of Westminster. Her perceived ruthlessness earned her a fearsome reputation among her Yorkist enemies, who used it as propaganda to paint her as an unnatural, vengeful woman.<\\/p><p>Despite her efforts, Margaret's cause was ultimately doomed. Her son was killed at the Battle of Tewkesbury and she was captured. Her story is one of tragedy, but also of incredible resilience and determination.<\\/p>",
            "comments": [
                { "user": "Lancaster_Loyalist", "text": "A true queen who fought for her son's birthright against traitors and usurpers." },
                { "user": "Gregory M.", "text": "Her refusal to compromise probably prolonged the war by years." }
            ]
        },
        {
            "id": "post-005",
            "title": "Richard III: Villain, Victim, or Something Else?",
            "author": "David More",
            "date": "October 03, 2025",
            "snippet": "Perhaps no English king is as controversial as Richard III. Immortalized by Shakespeare as a monstrous tyrant, modern historians are re-examining the man behind the myth.",
            "imageUrl": "https://www.studio88.co.uk/acatalog/large_richard_iii.jpg",
            "content": "<h3>The Man and the Myth<\\/h3><p>Richard, Duke of Gloucester, was by all accounts a loyal and capable brother to King Edward IV. Yet, upon Edward's death, he seized the throne from his young nephew, Edward V, declaring him illegitimate. The boy and his younger brother, the 'Princes in the Tower,' subsequently vanished, and Richard was crowned King Richard III.<\\/p><h3>Re-evaluating the Evidence<\\/h3><p>For centuries, the story crafted by Tudor historians—and perfected by Shakespeare—of Richard as a power-mad monster was accepted as fact. However, the 'Ricardian' movement argues that the evidence against him is largely circumstantial and written by his enemies. The discovery of his remains under a Leicester car park in 2012 reignited the debate, revealing he had severe scoliosis, not a hunchback, and died a warrior's death.<\\/p>",
            "comments": [
                { "user": "RicardianSociety", "text": "Loyalty until death! The Tudor smear campaign must be exposed." },
                { "user": "Henry_T", "text": "He usurped the throne from a child. His motivations are clear, regardless of propaganda." }
            ]
        },
        {
            "id": "post-006",
            "title": "Bosworth Field: The End of an Era",
            "author": "Dr. Alistair Finch",
            "date": "October 01, 2025",
            "snippet": "On August 22, 1485, a desperate gamble by an exiled Lancastrian claimant, Henry Tudor, led to a final, decisive battle. The death of Richard III at Bosworth Field ended the Plantagenet dynasty and ushered in the age of the Tudors.",
            "imageUrl": "https://warfarehistorynetwork.com/wp-content/uploads/2023/05/M-Bosworth-LEAD-Apr06-scaled.jpg",
            "content": "<h3>A Fateful Day<\\/h3><p>Henry Tudor's claim to the throne was tenuous, but he gathered a small force and landed in Wales. King Richard III met him with a superior army at Bosworth Field. The battle's turning point came from betrayal. The powerful Stanley family, who had feigned loyalty to Richard, finally intervened—on Henry's side.<\\/p><p>Surrounded and unhorsed, Richard III was killed, fighting to the last. His death marked the end of the Wars of the Roses. Henry Tudor was crowned King Henry VII on the battlefield, and his subsequent marriage to Elizabeth of York symbolically united the warring houses.<\\/p>",
            "comments": [
                { "user": "WelshDragon", "text": "A great day for Wales and for England!" },
                { "user": "John de Vere", "text": "The Stanleys were opportunists, plain and simple. Their betrayal, not Tudor's skill, won the day." }
            ]
        },
        {
            "id": "post-007",
            "title": "The Princes in the Tower: History's Coldest Case",
            "author": "Eleanor of Cambridge",
            "date": "September 29, 2025",
            "snippet": "In 1483, King Edward V (age 12) and his brother Richard of Shrewsbury (age 9) were lodged in the Tower of London for their 'protection' by their uncle, Richard, Duke of Gloucester. They were never seen again.",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/45/Paul_Delaroche_%281797-1856%29_-_The_Princes_in_the_Tower_%28Edward_V_and_the_Duke_of_York%29_-_3003004_-_Tower_of_London.jpg",
            "content": "<h3>A Royal Disappearance<\\/h3><p>The fate of the Princes in the Tower is the central mystery of Richard III's reign. After their father, Edward IV, died, his brother Richard was named Lord Protector for the young Edward V. Richard quickly moved the boys to the Tower of London. Soon after, he declared the boys illegitimate and seized the throne for himself. The princes vanished from public view in the summer of 1483.<\\/p><h3>The Suspects<\\/h3><p>The most obvious suspect is Richard III himself. He had the motive and opportunity. This was the version pushed by the Tudors. However, other theories exist. Some suggest the Duke of Buckingham may have killed them to frame the king. A more fringe theory posits that Henry VII had them quietly murdered to remove any rival claimants. Without a body or a confession, the debate continues to rage.<\\/p>",
            "comments": [
                { "user": "Investigator_G", "text": "It has to be Richard. Occam's razor." },
                { "user": "The_Contrarian", "text": "What if they survived? There were pretenders like Lambert Simnel and Perkin Warbeck for a reason." }
            ]
        },
        
        {
            "id": "post-008",
            "title": "The Woodvilles: A Queen's Controversial Family",
            "author": "Isabelle d'Anvers",
            "date": "September 22, 2025",
            "snippet": "When Edward IV secretly married the commoner Elizabeth Woodville, he shocked the court and elevated her extensive family to positions of power, creating jealousy and resentment that would have deadly consequences.",
            "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/26/Coat_of_Arms_of_Elizabeth_Woodville.svg",
            "content": "<h3>A Marriage of Passion, Not Politics<\\/h3><p>In an age where royal marriages were tools of international diplomacy, Edward IV's decision to marry for love was a radical act. His bride, Elizabeth Woodville, was a widow from a relatively minor gentry family. The marriage, and the speed with which Edward promoted her numerous siblings and sons, deeply alienated the traditional nobility, especially the powerful Earl of Warwick.<\\/p><p>The Woodvilles were seen as grasping upstarts, and their sudden wealth and influence were a constant source of friction at court. After Edward IV's death, this resentment boiled over. Richard, Duke of Gloucester, used the perceived greed of the Woodvilles as a justification for his power grab.<\\/p>",
            "comments": [
                { "user": "CourtWatcher", "text": "Edward's one major political blunder. It cost him Warwick's support and created a faction that hated his heir." },
                { "user": "Elizabeth W.", "text": "Or perhaps it was a king choosing his own destiny, and the 'old guard' simply couldn't handle it." }
            ]
        },
        {
            "id": "post-009",
            "title": "The Symbolism of the Roses: More Complicated Than You Think",
            "author": "David More",
            "date": "September 19, 2025",
            "snippet": "The white rose of York and the red rose of Lancaster are iconic symbols, but their importance during the actual conflict is often overstated. The 'Tudor Rose' that united them, however, was a masterstroke of propaganda.",
            "imageUrl": "https://t3.ftcdn.net/jpg/04/30/94/80/240_F_430948045_NZEJBstU5W9iPP09aQoTr0uN4eDhi3pw.jpg",
            "content": "<h3>A Thorny Issue<\\/h3><p>While the white rose was certainly a badge used by the Yorkists, the red rose's association with the House of Lancaster is much more tenuous during the period itself. Many combatants fought under the personal banners of their lords—the Bear and Ragged Staff of Warwick, or the Sun in Splendour of Edward IV. The idea of a 'war of roses' was largely popularized after the fact.<\\/p><h3>The Propaganda of the Tudor Rose<\\/h3><p>The true genius of the rose symbolism came after the war. When Henry VII married Elizabeth of York, he created the Tudor Rose. This new emblem, combining the red and white roses, was a brilliant piece of political branding. It visually represented the end of the conflict and the unification of the two warring houses under a new, peaceful dynasty.<\\/p>",
            "comments": [
                { "user": "Heraldry_Geek", "text": "Absolutely correct. The personal badges and banners were far more significant on the battlefield." },
                { "user": "Tudor_Rose_Fan", "text": "Propaganda or not, it's one of the most beautiful and enduring symbols in English history." }
            ]
        },
        {
            "id": "post-010",
            "title": "Edward IV: The Sun in Splendour",
            "author": "Dr. Alistair Finch",
            "date": "September 15, 2025",
            "snippet": "Tall, handsome, and a formidable warrior, Edward IV was the antithesis of Henry VI. He won the throne by force of arms, but his reign was marked by both decisive leadership and periods of indulgence that nearly cost him everything.",
            "imageUrl": "https://img.wikioo.org/ADC/Art.nsf/O/AQTE94/$File/Ernest-Board-King-Edward-IV-and-His-Queen-Elizabeth-Woodville-at-Reading-Abbey-1464.jpg",
            "content": "<h3>The Ideal Medieval King?<\\/h3><p>Edward, Duke of York, had all the qualities the 15th century admired in a monarch. At six foot four, he was an imposing figure and a brilliant military commander who was never defeated in battle. His victories at Mortimer's Cross and Towton secured him the throne at just 19 years old.<\\/p><h3>Complacency and a Near-Fatal Flaw<\\/h3><p>Edward's great weakness was a tendency toward complacency. His secret marriage to Elizabeth Woodville alienated his most powerful ally, Warwick the Kingmaker, leading to his temporary overthrow in 1470. However, Edward showed his resilience, returning from exile to decisively defeat Warwick at Barnet and crush the remaining Lancastrian forces at Tewkesbury. His premature death in 1483 plunged the kingdom back into chaos.<\\/p>",
            "comments": [
                { "user": "Richard a G.", "text": "A true warrior king. If he had lived another ten years, the Tudor dynasty would never have happened." },
                { "user": "Isabelle d'Anvers", "text": "His love of luxury and women was his undoing. It sowed the seeds of the conflict that consumed his sons." }
            ]
        }
    ]
    `;
    
    // --- NEW: Helper functions for localStorage --- 
    const savePosts = (posts) => {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    };

    const loadPosts = () => {
        const postsFromStorage = localStorage.getItem('blogPosts');
        if (postsFromStorage) {
            // If data exists, parse it and turn the plain objects back into Post instances
            const plainObjects = JSON.parse(postsFromStorage);
            return plainObjects.map(data => new Post(data));
        } else {
            // First time visit: use mock data, save it, then return it
            const initialPosts = JSON.parse(blogFeedDataJSON).map(data => new Post(data));
            savePosts(initialPosts);
            return initialPosts;
        }
    };

    // --- MODIFIED: Load posts from localStorage instead of directly from JSON ---
    const blogPosts = loadPosts();

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
            <img src="${post.imageUrl}" alt="" class="post-image">
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

        // --- Save all posts after adding a comment ---
        savePosts(blogPosts);
        
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

        // --- Save all posts after adding a new one ---
        savePosts(blogPosts);
        
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