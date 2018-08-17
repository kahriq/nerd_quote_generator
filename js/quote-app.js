//main IIFE
(function() {

    //Declare CONST variables that target and create DOM elements
    const quote = document.getElementById('quote');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const button = document.getElementById('newBtn');
    const list = document.getElementById('list');

    const movietitle = document.createElement("i");
    const img = document.createElement("img");
    const link = document.createElement("a");

    //Declare let variables for checking which quote is currently displayed, intervals, and when button is clicked
    let quoteIndex;
    let buttonIndex;
    let typeInterval;

    //Declare let variables for the current object values
    let currentQuote;
    let currentAuthor;
    let currentPhoto;
    let currentTextColor;
    let currentMovieTitle;
    
    //Function that randomly chooses an element in an array and performs a callback function
    function randomize(array,currentValue,callback) {
            let newRandom = Math.floor(Math.random() * array.length);
            newRandom === currentValue ? randomize(array,currentValue,callback) : callback(newRandom);
    }

    //Function that assigns new quote values to let variables, passed in as a callback to randomize()
    function assignQuoteValues(newRandom) {
        quoteIndex = newRandom;
        currentQuote = quoteArray[quoteIndex].sentence;
        currentAuthor = quoteArray[quoteIndex].author;
        currentPhoto = quoteArray[quoteIndex].photo;
        currentTextColor = quoteArray[quoteIndex].textColor;
        currentMovieTitle = quoteArray[quoteIndex].movie;
    }

    //Function that changes button text, passed in as a callback to randomize()
    function assignBtnValues(newRandom) {
        buttonIndex = newRandom;
        button.innerHTML = `<b>${newButtonText[newRandom]}</b>`;
    }


    //Function that changes the background image for each quote
    function displayImg() {
        list.setAttribute("style",`
        background:
            linear-gradient(
                rgba(0, 0, 0, 0.3), 
                rgba(0, 0, 0, 0.3)
            ),
            url(${currentPhoto}) no-repeat center center
        `)
    }

    //Function that creates a tweet button
    function buildTweet() {
        let tweetURL = `https://twitter.com/intent/tweet?text="${currentQuote}" - ${currentAuthor}&hashtags=geekquote via @kahriqsalil`
        link.href = tweetURL;
        link.target = "_blank";
        img.src = "./images/tweet_button.png";
        img.className = "tweet"
        link.appendChild(img);
        list.appendChild(link);

    }


    //Function that 1) prints the quote and its author to the DOM one character at a time in a typewriter effect then 2) fades in the title of the movie the quote is from
    function displayQuote() {
        randomize(quoteArray,quoteIndex,assignQuoteValues);

        if (list.contains(link)) {
            list.removeChild(link);
        }

        if(movietitle.textContent !== "") {
            movietitle.className = "";
        }

        (function typeWriter() {          
            let i = 0;
            quote.textContent = "";
            quoteAuthor.textContent = "";
            
            quote.setAttribute("style",`color:${currentTextColor}`);
            quoteAuthor.setAttribute("style",`color:${currentTextColor}`);
            
            function typeOut(data, element, callback) {
                typeInterval = setInterval( function() {
                    if (i < element.length) {
                        data.textContent += element.charAt(i++);
                    } else {
                        i = 0;
                        clearInterval(typeInterval);
                        callback();
                    }
                },85);
            }
                
            function fadeTitle() {
                movietitle.innerHTML = `<br> (${currentMovieTitle})`;
                quoteAuthor.appendChild(movietitle);
                setTimeout( () => movietitle.className = 'fadeIn', 500);
            }

            displayImg();
            typeOut( quote,currentQuote, function(){
                typeOut( quoteAuthor, currentAuthor, function(){ 
                    fadeTitle();
                    buildTweet();
                });
            });
            
        })(); //end IIFE
    }

    // Button click event listener
    button.addEventListener("click", () => {
        clearInterval(typeInterval);
        randomize(newButtonText,buttonIndex,assignBtnValues);
        displayQuote();
    });
    
})();