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
                        let htmlProfilePic: HTMLImageElement = document.createElement("img");
                        //TODO styling
                        htmlProfilePic.src = user.pictureLink;
                        htmlProfPicSec.appendChild(htmlProfilePic);
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
                        let linkEdit: HTMLAnchorElement = document.createElement("a");
                        linkEdit.href = "edit.html";
                        linkEdit.textContent = "Edit";
                        htmlControllSec.appendChild(linkEdit);

                        let btLogout: HTMLButtonElement = document.createElement("button");
                        btLogout.textContent = "Logout";
                        btLogout.addEventListener("click", function (): void {
                            deleteAuthCookie(true);
                        });
                        htmlControllSec.appendChild(btLogout);

                        let btDelete: HTMLButtonElement = document.createElement("button");
                        btDelete.textContent = "Delete User";
                        btDelete.addEventListener("click", deleteThisUser);
                        htmlControllSec.appendChild(btDelete);
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