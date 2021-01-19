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
        console.log("No email Param given");
        showUserDetail(null);
    }
    async function showUserDetail(email) {
        let requestData;
        if (email != null) {
            requestData = { command: "showUserDetail", email: email };
            console.log("Get User Details for Email: " + email);
        }
        else {
            console.log("Show details for logged in user");
            requestData = { command: "showUserDetail" };
        }
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
                    htmlFollowingSec.appendChild(htmlFollowing);
                    if (responseFromServer.tweets) {
                        if (responseFromServer.tweets.length > 0) {
                            for (let index = 0; index < responseFromServer.tweets.length; index++) {
                                const tweet = responseFromServer.tweets[index];
                                let tweetDiv = Twitter.createTweetElement(tweet);
                                htmlTweetSec.appendChild(tweetDiv);
                            }
                        }
                    }
                    if (query.get("email") == "me" || query.get("email") == null) {
                        let linkEdit = document.createElement("a");
                        linkEdit.href = "edit.html";
                        linkEdit.textContent = "Edit";
                        htmlName.appendChild(linkEdit);
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
})(Twitter || (Twitter = {}));
//# sourceMappingURL=userdetails.js.map