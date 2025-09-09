import { tweetData } from "/data.js"

// variable 
const tweetsAndCommentsContainer = document.getElementById("tweets-and-comments-container")
const tweetsContainer = document.getElementById('tweets-container')
const commentsContainer = document.getElementById("comments-container")
const tweetInput = document.getElementById("tweet-input")
const tweetBtn = document.getElementById('tweet-btn')

// handle document events
document.addEventListener('click', (e)=> {
    e.target.dataset.like && handleLikeClick(e.target)
    e.target.dataset.retweet && handleRetweetClick(e.target)
    e.target.dataset.comment && handleCommentClick(e.target)
    e.target.dataset.commentLike && handleCommentLikeClick(e.target)
    e.target.dataset.postComment && handlePostCommentClick(e.target)
    e.target.dataset.commentTrash && handleCommentTrash(e.target)
    e.target.dataset.trash && handleTrashClick(e.target)
})

// Get twees data
function getTweetsData(){

    let tweets = ``
    tweetData.forEach( tweet => {
        const {handle, isLiked, isRetweeted, isUser, likes, retweets, profilePic, tweetText, replied, uuid} = tweet

        tweets += `
            <div class="tweet-container">
                <div class="tweet-user-info">
                    <img src="./images/${profilePic}" alt="Image of ${handle}" class="profile-pic" loading = "lazy">
                    <p class="handle-p">${handle}</p>
                </div>
                <div class="tweet-feed">
                    <p class="tweet">${tweetText}</p>
                    <div class="tweet-feedback">
                        <span><i class="fa-regular fa-comment-dots" data-comment=${uuid}></i>${replied.length}</span>
                        <span><i class="fa-solid fa-heart ${isLiked && "liked"}" data-like=${uuid}></i>${likes}</span>
                        <span><i class="fa-solid fa-retweet ${isRetweeted && "retweeted"}" data-retweet=${uuid}></i>${retweets}</span>
                        ${isUser ? `<span><i class="fa-solid fa-trash" data-trash=${uuid}></i></span>` : ""}
                    </div>
                </div>
                <div class="comment">
                    <img src="./images/captainamerica.jpeg" class="profile-pic">
                    <input type="text" name="comment" placeholder="Write response..." autocomplete="off" class="comment-input">
                    <span id="comment-post-btn"><i class="fa-regular fa-paper-plane" data-post-comment=${uuid}></i></span>
                </div>
            </div>
        `

        if(tweet.replied.length > 0){
            tweet.replied.forEach( reply => {
                const {handle, isCommented, profilePic, tweetText, likes, uuid, isLiked} = reply

                tweets += `
                <div class="comment-container">
                    <div class="tweet-user-info">
                        <img src="./images/${profilePic}" alt="Image of${handle}" class="profile-pic">
                        <p class="handle-p">${handle}</p>
                    </div>
                    <div class="tweet-feed">
                        <p class="tweet">${tweetText}</p>
                        <div class="tweet-feedback">
                            <span><i class="fa-solid fa-heart ${isLiked && "liked"}" data-comment-like=${uuid}></i>${likes}</span>     
                            ${isCommented ? `<span><i class="fa-solid fa-trash" data-comment-trash=${uuid}></i></span>` : ""}
                        </div>
                    </div>
                </div>`
            })
        }
    })

    return tweets
}

getTweetsData()

function renderTweet(){
    tweetsContainer.innerHTML = getTweetsData()
}
renderTweet()

const handleLikeClick = function(id){ 
    const likeEl = tweetData.filter( tweet => {
        return tweet.uuid === id.dataset.like
    })[0]

    if(likeEl.isLiked){
        likeEl.likes--;
        likeEl.isLiked = false
    } else {  
        likeEl.likes++
        likeEl.isLiked = true
    }
    renderTweet()
}


const handleRetweetClick = function(id){
    const retweetEl = tweetData.filter( tweet => {
        return tweet.uuid === id.dataset.retweet
    })[0]

    if(retweetEl.isRetweeted){
        retweetEl.retweets--
        retweetEl.isRetweeted = false
    } else {
        retweetEl.retweets++
        retweetEl.isRetweeted = true
    }

    renderTweet()

}

const handleCommentClick = function(id){
    tweetData.forEach( comment => {
        if(comment.uuid === id.dataset.comment){
            const comments = Array.from(id.closest("#tweets-container").querySelector(".comment-container"))
            comments.forEach(comment => comment.classList.toggle("hide"))
        }
    })
}

const handleCommentLikeClick = function(id){ 

    tweetData.forEach(tweet => {
        tweet.replied.forEach(item => {
            if(item.uuid === id.dataset.commentLike){
                if(item.isLiked){
                    item.likes--;
                    item.isLiked = false
                } else {  
                    item.likes++
                    item.isLiked = true
                }
            }
        })
    })
    renderTweet()
}

const handlePostCommentClick = function(id){
    const clickedEl = tweetData.filter(tweet => {
        return tweet.uuid === id.dataset.postComment
    })[0]

    const commentInputs = document.getElementsByClassName("comment-input")
    const input = Array.from(commentInputs).filter( input => {
        return input.value !== ""
    })[0]

    clickedEl.replied.unshift({
        handle: "@captainamerica",
        profilePic: "captainamerica.jpeg",
        tweetText: input.value,
        likes: 0,
        isLiked: false,
        isUser: false,
        isCommented: true,
        uuid: crypto.randomUUID()
    })

    renderTweet()
    // console.log(clickedEl.replied)
}

const handleCommentTrash = function(id){
    tweetData.forEach(tweet => {
        tweet.replied.forEach( item => {
            if(item.uuid === id.dataset.commentTrash){
                tweet.replied.shift()
                renderTweet()
            }
        })
    })

}

const handleTrashClick = function(id){
    tweetData.forEach(tweet => {
        if(tweet.uuid === id.dataset.trash){
            id.closest(".tweet-container").style.display = "none"
        }

    })
}

tweetBtn.addEventListener('click', ()=> {
    const tweets = tweetData.map(tweet => {
        return tweet.tweetText
    })

    if(!tweets.includes(tweetInput.value) && tweetInput.value !== ""){
        tweetData.unshift({
            handle: "@captainamerica",
            profilePic: "captainamerica.jpeg",
            tweetText: tweetInput.value,
            replied: [],
            likes: 0,
            retweets: 0,
            isLiked: false,
            isRetweeted: false,
            isUser: true,
            uuid: crypto.randomUUID()
        })
        renderTweet()  
        tweetInput.value = ""
    }
    
})