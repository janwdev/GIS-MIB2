namespace Twitter {

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    let htmlName: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("name");
    let htmlEmail: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("email");
    let htmlStudyDetails: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("studyDetails");
    let htmlFollowerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("followerSec");
    let htmlFollowingSec: HTMLDivElement = <HTMLDivElement>document.getElementById("followingSec");
    let htmlControllSec: HTMLDivElement = <HTMLDivElement>document.getElementById("controllSec");
    let htmlProfPicSec: HTMLDivElement = <HTMLDivElement>document.getElementById("profPicSec");
    let htmlTweetSec: HTMLDivElement = <HTMLDivElement>document.getElementById("tweetSec");

    let query: URLSearchParams = new URLSearchParams(window.location.search);
    if (query.has("email")) {
        showUserDetail(query.get("email"));
    } else {
        console.log("No email Param given");
        showUserDetail(null);
    }

    async function showUserDetail(email: string): Promise<void> {
        let requestData: RequestToServerInterface;
        if (email != null) {
            requestData = { command: "showUserDetail", email: email };
            console.log("Get User Details for Email: " + email);
        } else {
            console.log("Show details for logged in user");
            requestData = { command: "showUserDetail" };
        }
        let responseFromServer: ResponseFromServer = await postToServer(requestData);
        if (responseFromServer) {
            if (responseFromServer.status >= 0) {
                if (responseFromServer.users && responseFromServer.users.length > 0) {
                    let user: User = responseFromServer.users[0];
                    if (user.pictureLink) {
                        if (user.pictureLink.length > 0) {
                            let htmlProfilePic: HTMLImageElement = document.createElement("img");
                            htmlProfilePic.src = user.pictureLink;
                            htmlProfilePic.className = "profPic";
                            htmlProfPicSec.appendChild(htmlProfilePic);
                        }
                    }
                    htmlName.textContent = user.firstname + " " + user.lastname;
                    htmlEmail.textContent = user.email;
                    htmlStudyDetails.textContent = "StudyCourse: " + user.studycourse + ", Semester: " + user.semester;
                    //TODO durch Links ersetzen
                    let htmlFollower: HTMLParagraphElement = document.createElement("p");
                    htmlFollower.textContent = "Follower: " + (user.followers.length - 1).toString();
                    htmlFollowerSec.appendChild(htmlFollower);
                    let htmlFollowing: HTMLParagraphElement = document.createElement("p");
                    htmlFollowing.textContent = "Following: " + (user.following.length - 1).toString();
                    htmlFollowingSec.appendChild(htmlFollowing);
                    if (responseFromServer.tweets) {
                        if (responseFromServer.tweets.length > 0) {
                            for (let index: number = 0; index < responseFromServer.tweets.length; index++) {
                                const tweet: Tweet = responseFromServer.tweets[index];
                                let tweetDiv: HTMLDivElement = createTweetElement(tweet);
                                htmlTweetSec.appendChild(tweetDiv);
                            }
                        }
                    }

                    if (query.get("email") == "me" || query.get("email") == null) {
                        let htmlRow: HTMLDivElement = document.createElement("div");
                        htmlRow.className = "row";
                        htmlControllSec.appendChild(htmlRow);

                        let linkEdit: HTMLAnchorElement = document.createElement("a");
                        linkEdit.href = "edit.html";
                        let linkEditSpan: HTMLSpanElement = document.createElement("span");
                        linkEditSpan.textContent = "Edit";
                        linkEdit.appendChild(linkEditSpan);
                        linkEdit.className = "col-s-3 btn btnEdit";
                        htmlRow.appendChild(linkEdit);

                        let btLogout: HTMLButtonElement = document.createElement("button");
                        let logoutSpan: HTMLSpanElement = document.createElement("span");
                        logoutSpan.textContent = "Logout";
                        btLogout.appendChild(logoutSpan);
                        btLogout.className = "col-s-3 btn btnLogout";
                        btLogout.addEventListener("click", function (): void {
                            deleteAuthCookie(true);
                        });
                        htmlRow.appendChild(btLogout);

                        let btDelete: HTMLButtonElement = document.createElement("button");
                        let deleteSpan: HTMLSpanElement = document.createElement("span");
                        deleteSpan.textContent = "Delete User";
                        btDelete.appendChild(deleteSpan);
                        btDelete.className = "col btn btnDelete";
                        btDelete.addEventListener("click", deleteThisUser);
                        htmlRow.appendChild(btDelete);
                    } else {
                        let requestDataNew: RequestToServerInterface = { command: "showUserDetail" };
                        let responseFromServerNew: ResponseFromServer = await postToServer(requestDataNew);
                        if (responseFromServerNew) {
                            if (responseFromServerNew.status >= 0) {
                                if (responseFromServerNew.users && responseFromServerNew.users.length > 0) {
                                    let me: User = responseFromServerNew.users[0];
                                    let thisUserFollowing: string[] = me.following;
                                    let following: boolean = false;
                                    for (let j: number = 0; j < thisUserFollowing.length; j++) {
                                        if (user._id == thisUserFollowing[j]) {
                                            following = true;
                                            break;
                                        }
                                    }
                                    if (following) {
                                        let btUnSubscribe: HTMLButtonElement = document.createElement("button");
                                        let span: HTMLSpanElement = document.createElement("span");
                                        span.textContent = "Unsubscribe";
                                        btUnSubscribe.appendChild(span);
                                        btUnSubscribe.className = "btn col btnFirst";
                                        htmlControllSec.appendChild(btUnSubscribe);
                                        btUnSubscribe.addEventListener("click", async function (): Promise<void> {
                                            await suscribeUnsuscribeToUserWithId(user._id, "unsubscribe");
                                            location.reload(); 
                                        });
                                    } else {
                                        let btSubscribe: HTMLButtonElement = document.createElement("button");
                                        let span: HTMLSpanElement = document.createElement("span");
                                        span.textContent = "Subscribe";
                                        btSubscribe.appendChild(span);
                                        btSubscribe.className = "btn col btnFirst";
                                        htmlControllSec.appendChild(btSubscribe);
                                        btSubscribe.addEventListener("click", async function (): Promise<void> {
                                            await suscribeUnsuscribeToUserWithId(user._id, "subscribe");
                                            location.reload(); 
                                        });
                                    }
                                }
                            }
                        }
                    }
                } else {
                    while (answerSec.firstChild) {
                        answerSec.removeChild(answerSec.lastChild);
                    }
                    let alert: HTMLDivElement = createAlertElement("Error no User returned", KEYALERTERROR);
                    answerSec.appendChild(alert);
                }
            } else {
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                let alert: HTMLDivElement = createAlertElement("Error: " + responseFromServer.message, KEYALERTERROR);
                answerSec.appendChild(alert);
            }
        } else {
            redirectToLogin();
            console.log("Need to login again");
        }
    }

    async function deleteThisUser(): Promise<void> {
        let requestData: RequestToServerInterface = { command: "deleteUser" };
        let responseFromServer: ResponseFromServer = await postToServer(requestData);
        if (responseFromServer) {
            if (responseFromServer.status >= 0) {
                deleteAuthCookie(true);
            } else {
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                let alert: HTMLDivElement = createAlertElement("Error: " + responseFromServer.message, KEYALERTERROR);
                answerSec.appendChild(alert);
            }
        }
    }
}