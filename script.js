import { tweetData as data } from "/data.js"

let tweetData = JSON.parse(localStorage.getItem('tweetData')) || data

// variable 
const tweetsAndCommentsContainer = document.getElementById("tweets-and-comments-container")
const tweetsContainer = document.getElementById('tweets-container')
const commentsContainer = document.getElementById("comments-container")
const tweetInput = document.getElementById("tweet-input")
const tweetBtn = document.getElementById('tweet-btn')

console.log(JSON.parse(localStorage.getItem("comment-section")))

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

// save date to local storage
function saveToLocalStorage(){
    localStorage.setItem("tweetData", JSON.stringify(tweetData))
}

// Get twees data
function getTweetsData(){

    let tweets = ``
    tweetData.forEach( tweet => {
        const {handle, isLiked, isRetweeted, isUser, likes, retweets, profilePic, tweetText, replied, uuid} = tweet

        const isCommentHidden = localStorage.getItem(`comment-section-${uuid}`) === 'true'

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
                <div id="comment-section-${uuid}" class="comment-section ${isCommentHidden ? "hide" : ""}">
                    ${getComment(uuid)}
                    ${replied.length > 0 ? replied.map(getReply).join("") : ""}
                </div>
            </div>
        `
    })
    return tweets
}

function getComment(uuid){
    return `<div class="comment">
        <img src="./images/captainamerica.jpeg" class="profile-pic">
        <input type="text" name="comment" placeholder="Write response..." autocomplete="off" class="comment-input">
        <span id="comment-post-btn"><i class="fa-regular fa-paper-plane" data-post-comment=${uuid}></i></span>
    </div>`
}

function getReply(reply){
    const {handle, isCommented, profilePic, tweetText, likes, uuid, isLiked} = reply

    return `
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

    saveToLocalStorage()
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

    saveToLocalStorage()
    renderTweet()
}

const handleCommentClick = function(id){
    tweetData.forEach( comment => {
        if(comment.uuid === id.dataset.comment){
            document.getElementById(`comment-section-${comment.uuid}`).classList.toggle("hide")   
            localStorage.setItem(`comment-section-${id.dataset.comment}`, JSON.stringify(document.getElementById(`comment-section-${id.dataset.comment}`).classList.contains("hide")))
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

    saveToLocalStorage()
    renderTweet()
}

const handlePostCommentClick = function(id){
    // ensuring clicked element uuid
    const clickedEl = tweetData.filter(tweet => {
        return tweet.uuid === id.dataset.postComment
    })[0]

    // ensuring input is empty
    const commentInputs = document.getElementsByClassName("comment-input")
    const input = Array.from(commentInputs).filter( input => {
        return input.value !== ""
    })[0]

    // adding comment to the comments array
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

    saveToLocalStorage()
    // re-rendering the DOM
    renderTweet()
}

const handleCommentTrash = function(id){
    tweetData.forEach(tweet => {
        tweet.replied.forEach( item => {
            if(item.uuid === id.dataset.commentTrash){
                tweet.replied.shift()

                saveToLocalStorage()
                renderTweet()
            }
        })
    })

}

const handleTrashClick = function(id){
    let index = tweetData.findIndex( tweet => tweet.uuid === id.dataset.trash)

    // removing the tweet from the data
    if(index > -1){
        tweetData.splice(index, 1)
        saveToLocalStorage()
        renderTweet()
    }
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

        saveToLocalStorage()
        renderTweet()  
        tweetInput.value = ""
    }
    
})