import { tweetData } from "/data.js"

// console.log(tweetData)
// variables 
const tweetsContainer = document.getElementById("tweets-container")

// handle document events
document.addEventListener('click', (e)=> {
    e.target.dataset.like && handleLikeClick(e.target)
    e.target.dataset.retweet && handleRetweetClick(e.target)
    e.target.dataset.comment && handleCommentClick(e.target)
})

function getTweetsData(){
    let tweets = ``
    let comments = ``
    tweetData.forEach(tweet => {
        const {profilePic, handle, tweetText, likes, retweets, uuid, isLiked, isRetweeted, replied} = tweet
        tweets += `
                <div class="tweet-container">
                    <div class="tweet-user-info">
                        <img src="./images/${profilePic}" alt="Image of ${handle}" class="profile-pic">
                        <p class="handle-p">${handle}</p>
                    </div>
                    <div class="tweet-feed">
                        <p class="tweet">${tweetText}</p>
                        <div class="tweet-feedback">
                            <span><i class="fa-regular fa-comment-dots" data-comment=${uuid}></i>${replied.length}</span>
                            <span><i class="fa-solid fa-heart ${isLiked ? "liked" : ""}" data-like=${uuid}></i>${likes}</span>
                            <span><i class="fa-solid fa-retweet ${isRetweeted ? "retweeted" : ""}" data-retweet=${uuid}></i>${retweets}</span>
                        </div>
                    </div>
                </div>
            `

        tweet.replied.forEach(item => {
            const {profilePic, handle, tweetText, isLiked, uuid, likes} = item
            tweets += `
                <div class="comment-container">
                    <div class="tweet-user-info">
                        <img src="./images/${profilePic}" alt="Image of ${handle}" class="profile-pic">
                        <p class="handle-p">${handle}</p>
                    </div>
                    <div class="tweet-feed">
                        <p class="tweet">${tweetText}</p>
                        <div class="tweet-feedback">
                            <span><i class="fa-solid fa-heart ${isLiked ? "liked" : ""}" data-like=${uuid}></i>${likes}</span>
                        </div>
                    </div>
                </div>
            `
        })
    })
    return tweets
}

function renderTweet(){
    tweetsContainer.innerHTML = getTweetsData()
}

renderTweet()

const handleLikeClick = function(id){ 
    tweetData.forEach(tweet => {
        if(tweet.uuid === id.dataset.like){
            if(tweet.isLiked){
                tweet.likes--;
                tweet.isLiked = false

            } else {
                
                tweet.likes++
                tweet.isLiked = true
            }
            renderTweet()
        }
    })
}

const handleRetweetClick = function(id){
    tweetData.forEach(tweet => {
        if(tweet.uuid === id.dataset.retweet){
            if(tweet.isRetweeted){
                tweet.retweets--
                tweet.isRetweeted = false
            } else {
                tweet.retweets++
                tweet.isRetweeted = true
            }
        }
        renderTweet()
    })

}

const handleCommentClick = function(id){
    tweetData.forEach(tweet => {
        tweet.uuid === id.dataset.comment && 
            console.log(document.querySelector(".comment-container"))
    })
}
