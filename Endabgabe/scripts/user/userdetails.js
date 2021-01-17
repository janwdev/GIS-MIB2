"use strict";
var Twitter;
(function (Twitter) {
    let htmlName = document.getElementById("name");
    let htmlEmail = document.getElementById("email");
    let htmlStudyDetails = document.getElementById("studyDetails");
    let htmlFollowerSec = document.getElementById("followerSec");
    let htmlFollowingSec = document.getElementById("followingSec");
    let htmlProfPicSec = document.getElementById("profPicSec");
    let htmlTweetSec = document.getElementById("tweetSec");
    let query = new URLSearchParams(window.location.search);
    if (query.has("email")) {
        showUserDetail(query.get("email"));
    }
    else {
        //TODO weiterleitung auf alle Benutzer Seite
        console.log("No email Param given");
    }
    async function showUserDetail(email) {
        console.log("Get User Details for Email: " + email);
        let requestData = { command: "showUserDetail", email: email };
        let responseFromServer = await Twitter.postToServer(requestData);
        if (responseFromServer) {
            if (responseFromServer.status >= 0) {
                if (responseFromServer.users && responseFromServer.users.length > 0) {
                    let user = responseFromServer.users[0];
                    if (user.pictureLink) {
                        let htmlProfilePic = document.createElement("img");
                        //TODO styling
                        htmlProfilePic.src = user.pictureLink;
                        htmlProfPicSec.appendChild(htmlProfilePic);
                    }
                    htmlName.textContent = user.firstname + " " + user.lastname;
                    htmlEmail.textContent = user.email;
                    htmlStudyDetails.textContent = "Studiengang: " + user.studycourse + ", Semester: " + user.semester;
                    //TODO durch Links ersetzen
                    let htmlFollower = document.createElement("p");
                    htmlFollower.textContent = "Follower: " + user.followers.length.toString();
                    htmlFollowerSec.appendChild(htmlFollower);
                    let htmlFollowing = document.createElement("p");
                    htmlFollowing.textContent = "Following: " + user.following.length.toString();
                    htmlFollowerSec.appendChild(htmlFollowing);
                    if (responseFromServer.tweets) {
                        if (responseFromServer.tweets.length > 0) {
                            for (let index = 0; index < responseFromServer.tweets.length; index++) {
                                const tweet = responseFromServer.tweets[index];
                                let tweetDiv = createTweetElement(tweet);
                                htmlTweetSec.appendChild(tweetDiv);
                            }
                        }
                    }
                }
                else {
                    console.log("Error no User returned");
                }
            }
            else {
                console.log("Error: " + responseFromServer.message);
                //TODO
            }
        }
        else {
            //TODO weiterleitung
            console.log("Need to login again");
        }
    }
    function createTweetElement(tweet) {
        let element = document.createElement("div");
        //TODO styling
        let htmlUserName = document.createElement("p");
        htmlUserName.textContent = tweet.userName;
        let htmlUserEmail = document.createElement("p");
        htmlUserEmail.textContent = tweet.userEmail;
        let htmlUserImg;
        if (tweet.userPicture) {
            htmlUserImg = document.createElement("img");
            htmlUserImg.src = tweet.userPicture;
        }
        let htmlText = document.createElement("p");
        htmlText.textContent = tweet.text;
        let htmlCreationDate = document.createElement("p");
        htmlCreationDate.textContent = new Date(tweet.creationDate).toString();
        element.appendChild(htmlUserName);
        element.appendChild(htmlUserEmail);
        if (tweet.userPicture) {
            element.appendChild(htmlUserImg);
        }
        element.appendChild(htmlText);
        element.appendChild(htmlCreationDate);
        //TODO media
        return element;
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=userdetails.js.map