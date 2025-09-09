export const tweetData = [
    {
        handle: "@johnwick 🔫",
        profilePic: "johnwick.jpeg",
        likes: 180,
        retweets: 83,
        tweetText: "Today, I finished one gang with just pencil. funny ha! ha!",
        replied: [],
        isLiked: false,
        isRetweeted: false,
        isUser: false,
        uuid: crypto.randomUUID()
    },
    {
        handle: "@deadpool ⚔",
        profilePic: "deadpool.jpeg",
        likes: 230,
        retweets: 145,
        tweetText: "Just found out I'm not in the next Avengers movie. Again. Seriously, Tony? Still not over that. Give me my shot, you billionaire douche. #AvengersAssemble #OrDont #MoreLikeAvengersDisassemble",
        replied: [
            {
                handle: "@Tonystark",
                profilePic: "ironman.jpeg",
                isLiked: false,
                likes: 250,
                isCommented: false,
                tweetText: "Auditions closed. Try the X-Men… they take anyone.",
                uuid: crypto.randomUUID()
            }, 
            {
                handle: "@peterparker",
                profilePic: "spiderman.jpeg",
                isLiked: false,
                likes: 100,
                isCommented: false,
                tweetText: `Uh, Mr. Pool… I barely got in myself. Pretty sure they still think I’m the intern 🕷️`,
                uuid: crypto.randomUUID()
            }
        ],
        isLiked: false,
        isRetweeted: false,
        isUser: false,
        uuid: crypto.randomUUID()
    },
    {
        handle: "@wolverine 🔪",
        profilePic: "wolverine.jpeg",
        likes: 102,
        retweets: 67,
        tweetText: `Anyone stands in my way, they won't be standin' much longer," and "I'm the best there is at what I do, but what I do isn't very nice`,
        replied: [
            {
                handle: "@deadpool ⚔",
                profilePic: "deadpool.jpeg",
                likes: 40,
                isCommented: false,
                tweetText: "Not nice? Bro, neither is your haircut. ✂️🐺",
                uuid: crypto.randomUUID()
            }
        ],
        isLiked: false,
        isRetweeted: false,
        isUser: false,
        uuid: crypto.randomUUID()
    },
]