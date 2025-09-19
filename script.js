import { tweetData as data } from "/data.js"

let tweetData = JSON.parse(localStorage.getItem('tweetData')) || data

// variables
const tweetsContainer = document.getElementById('tweets-container')
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
                    <img src="./images/${profilePic}" alt="Image of ${handle}" class="profile-pic" width="48" height="46">
                    <p class="handle-p">${handle}</p>
                </div>
                <div class="tweet-feed">
                    <p class="tweet">${tweetText}</p>
                    <div class="tweet-feedback">
                        <span role="button" aria-label="comment"><i class="fa-regular fa-comment-dots" data-comment=${uuid}></i>${replied.length}</span>
                        <span role="button" aria-label="like"><i class="fa-solid fa-heart ${isLiked && "liked"}" data-like=${uuid}></i>${likes}</span>
                        <span role="button" aria-label="retweet"><i class="fa-solid fa-retweet ${isRetweeted && "retweeted"}" data-retweet=${uuid}></i>${retweets}</span>
                        ${isUser ? `<span role="button" aria-label="delete-tweet"><i class="fa-solid fa-trash" data-trash=${uuid}></i></span>` : ""}
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

// user comment section
function getComment(uuid){
    return `
        <div class="comment">
            <img src="./images/captainamerica.webp" alt="Avatar of user" class="profile-pic" width="48" height="48">
            <input type="text" name="comment" placeholder="Write response..." autocomplete="off" class="comment-input">
            <span role="button" aria-label="post-comment" id="comment-post-btn" class="post-comment-${uuid}"><i class="fa-regular fa-paper-plane" data-post-comment=${uuid}></i></span>
        </div>`
}

// get user reply on specific tweet
function getReply(reply){
    const {handle, isCommented, profilePic, tweetText, likes, uuid, isLiked} = reply

    return `
    <div class="comment-container">
        <div class="tweet-user-info">
            <img src="./images/${profilePic}" alt="Image of${handle}" class="profile-pic" width="48" height="48">
            <p class="handle-p">${handle}</p>
        </div>
        <div class="tweet-feed">
            <p class="tweet">${tweetText}</p>
            <div class="tweet-feedback">
                <span role="button" aria-label="like"><i class="fa-solid fa-heart ${isLiked && "liked"}" data-comment-like=${uuid}></i>${likes}</span>     
                ${isCommented ? `<span role="button" aria-label="delete-comment"><i class="fa-solid fa-trash" data-comment-trash=${uuid}></i></span>` : ""}
            </div>
        </div>
    </div>`    
}

getTweetsData()

// rendering tweet
function renderTweet(){
    tweetsContainer.innerHTML = getTweetsData()
}

renderTweet()

// functions to find the clicked elements

function findClickedTweet(id){
    const clickedElement = tweetData.filter(tweet => {
        return tweet.uuid === id
    })[0]

    return clickedElement
}

function findRepliedTweets(id){
    for(const tweet of tweetData){
        if(tweet.replied.length > 0){
            let reply = tweet.replied.find(reply => reply.uuid.toString() === id)
            if(reply) return reply
        }
    }
    return null
}

const handleLikeClick = function(clickedEl){ 
    const likeEl = findClickedTweet(clickedEl.dataset.like)

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


const handleRetweetClick = function(clickedEl){
    const retweetEl = findClickedTweet(clickedEl.dataset.retweet)

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

const handleCommentClick = function(clickedEl){
    const comment = findClickedTweet(clickedEl.dataset.comment)
    const commentSection = document.getElementById(`comment-section-${clickedEl.dataset.comment}`)

    document.getElementById(`comment-section-${comment.uuid}`).classList.toggle("hide")   
    localStorage.setItem(`comment-section-${clickedEl.dataset.comment}`, JSON.stringify(commentSection.classList.contains("hide")))
}

const handleCommentLikeClick = function(clickedEl){     
    let commentLikeClicked = findRepliedTweets(clickedEl.dataset.commentLike)

    if(commentLikeClicked.isLiked){
        commentLikeClicked.likes--;
        commentLikeClicked.isLiked = false
    } else {  
        commentLikeClicked.likes++
        commentLikeClicked.isLiked = true
    }

    saveToLocalStorage()
    renderTweet()
}

const handlePostCommentClick = function(clickedEl){
    const clickedElement = findClickedTweet(clickedEl.dataset.postComment)
    
    const commentInput = document.querySelector(`.post-comment-${clickedEl.dataset.postComment}`).previousElementSibling

    // checking if comment not already posted
    let isEqual = false
    clickedElement.replied.forEach(reply => {
          isEqual = reply.tweetText === commentInput.value
    })

    // adding comment to the comments array
    if(commentInput.value !== "" && !isEqual){
        clickedElement.replied.unshift({
            handle: "@captainamerica",
            profilePic: "captainamerica.webp",
            tweetText: commentInput.value,
            likes: 0,
            isLiked: false,
            isUser: false,
            isCommented: true,
            uuid: crypto.randomUUID()
        })
    }
    
    saveToLocalStorage()
    renderTweet()
}

// function to delete user comments
const handleCommentTrash = function(clickedEl){
    tweetData.forEach(tweet => {
        tweet.replied.forEach( item => {
            if(item.uuid === clickedEl.dataset.commentTrash){
                tweet.replied.shift()

                saveToLocalStorage()
                renderTweet()
            }
        })
    })

}

// function to delete user tweets
const handleTrashClick = function(clickedEl){
    let index = tweetData.findIndex( tweet => tweet.uuid === clickedEl.dataset.trash)

    // removing the tweet from the data
    if(index > -1){
        tweetData.splice(index, 1)
        saveToLocalStorage()
        renderTweet()
    }
}

// event listener to post tweet
tweetBtn.addEventListener('click', ()=> {
    const tweets = tweetData.filter(tweet => {
        return tweet.tweetText
    })

    if(!tweets.includes(tweetInput.value) && tweetInput.value !== ""){
        tweetData.unshift({
            handle: "@captainamerica",
            profilePic: "captainamerica.webp",
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