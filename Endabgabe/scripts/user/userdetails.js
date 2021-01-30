"use strict";
var Twitter;
(function (Twitter) {
    let answerSec = document.getElementById("answerSection");
    let htmlName = document.getElementById("name");
    let htmlEmail = document.getElementById("email");
    let htmlStudyDetails = document.getElementById("studyDetails");
    let htmlFollowerSec = document.getElementById("followerSec");
    let htmlFollowingSec = document.getElementById("followingSec");
    let htmlControllSec = document.getElementById("controllSec");
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
                        if (user.pictureLink.length > 0) {
                            let htmlProfilePic = document.createElement("img");
                            htmlProfilePic.src = user.pictureLink;
                            htmlProfilePic.className = "profPic";
                            htmlProfPicSec.appendChild(htmlProfilePic);
                        }
                    }
                    htmlName.textContent = user.firstname + " " + user.lastname;
                    htmlEmail.textContent = user.email;
                    htmlStudyDetails.textContent = "StudyCourse: " + user.studycourse + ", Semester: " + user.semester;
                    //TODO durch Links ersetzen
                    let htmlFollower = document.createElement("p");
                    htmlFollower.textContent = "Follower: " + (user.followers.length - 1).toString();
                    htmlFollowerSec.appendChild(htmlFollower);
                    let htmlFollowing = document.createElement("p");
                    htmlFollowing.textContent = "Following: " + (user.following.length - 1).toString();
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
                        let htmlRow = document.createElement("div");
                        htmlRow.className = "row";
                        htmlControllSec.appendChild(htmlRow);
                        let linkEdit = document.createElement("a");
                        linkEdit.href = "edit.html";
                        let linkEditSpan = document.createElement("span");
                        linkEditSpan.textContent = "Edit";
                        linkEdit.appendChild(linkEditSpan);
                        linkEdit.className = "col-s-3 btn btnEdit";
                        htmlRow.appendChild(linkEdit);
                        let btLogout = document.createElement("button");
                        let logoutSpan = document.createElement("span");
                        logoutSpan.textContent = "Logout";
                        btLogout.appendChild(logoutSpan);
                        btLogout.className = "col-s-3 btn btnLogout";
                        btLogout.addEventListener("click", function () {
                            Twitter.deleteAuthCookie(true);
                        });
                        htmlRow.appendChild(btLogout);
                        let btDelete = document.createElement("button");
                        let deleteSpan = document.createElement("span");
                        deleteSpan.textContent = "Delete User";
                        btDelete.appendChild(deleteSpan);
                        btDelete.className = "col btn btnDelete";
                        btDelete.addEventListener("click", deleteThisUser);
                        htmlRow.appendChild(btDelete);
                    }
                    else {
                        let requestDataNew = { command: "showUserDetail" };
                        let responseFromServerNew = await Twitter.postToServer(requestDataNew);
                        if (responseFromServerNew) {
                            if (responseFromServerNew.status >= 0) {
                                if (responseFromServerNew.users && responseFromServerNew.users.length > 0) {
                                    let me = responseFromServerNew.users[0];
                                    let thisUserFollowing = me.following;
                                    let following = false;
                                    for (let j = 0; j < thisUserFollowing.length; j++) {
                                        if (user._id == thisUserFollowing[j]) {
                                            following = true;
                                            break;
                                        }
                                    }
                                    if (following) {
                                        let btUnSubscribe = document.createElement("button");
                                        let span = document.createElement("span");
                                        span.textContent = "Unsubscribe";
                                        btUnSubscribe.appendChild(span);
                                        btUnSubscribe.className = "btn col btnFirst";
                                        htmlControllSec.appendChild(btUnSubscribe);
                                        btUnSubscribe.addEventListener("click", async function () {
                                            await Twitter.suscribeUnsuscribeToUserWithId(user._id, "unsubscribe");
                                            location.reload();
                                        });
                                    }
                                    else {
                                        let btSubscribe = document.createElement("button");
                                        let span = document.createElement("span");
                                        span.textContent = "Subscribe";
                                        btSubscribe.appendChild(span);
                                        btSubscribe.className = "btn col btnFirst";
                                        htmlControllSec.appendChild(btSubscribe);
                                        btSubscribe.addEventListener("click", async function () {
                                            await Twitter.suscribeUnsuscribeToUserWithId(user._id, "subscribe");
                                            location.reload();
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    while (answerSec.firstChild) {
                        answerSec.removeChild(answerSec.lastChild);
                    }
                    let alert = Twitter.createAlertElement("Error no User returned", Twitter.KEYALERTERROR);
                    answerSec.appendChild(alert);
                }
            }
            else {
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                let alert = Twitter.createAlertElement("Error: " + responseFromServer.message, Twitter.KEYALERTERROR);
                answerSec.appendChild(alert);
            }
        }
        else {
            Twitter.redirectToLogin();
            console.log("Need to login again");
        }
    }
    async function deleteThisUser() {
        let requestData = { command: "deleteUser" };
        let responseFromServer = await Twitter.postToServer(requestData);
        if (responseFromServer) {
            if (responseFromServer.status >= 0) {
                Twitter.deleteAuthCookie(true);
            }
            else {
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                let alert = Twitter.createAlertElement("Error: " + responseFromServer.message, Twitter.KEYALERTERROR);
                answerSec.appendChild(alert);
            }
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=userdetails.js.map