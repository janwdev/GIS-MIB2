namespace Twitter {

    let htmlName: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("name");
    let htmlEmail: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("email");
    let htmlStudyDetails: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("studyDetails");
    let htmlFollowerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("followerSec");
    let htmlFollowingSec: HTMLDivElement = <HTMLDivElement>document.getElementById("followingSec");
    let htmlProfPicSec: HTMLDivElement = <HTMLDivElement>document.getElementById("profPicSec");
    let htmlTweetSec: HTMLDivElement = <HTMLDivElement>document.getElementById("tweetSec");

    let query: URLSearchParams = new URLSearchParams(window.location.search);
    if (query.has("email")) {
        showUserDetail(query.get("email"));
    } else {
        //TODO weiterleitung auf alle Benutzer Seite
        console.log("No email Param given");
    }

    async function showUserDetail(email: string): Promise<void> {
        console.log("Get User Details for Email: " + email);
        let requestData: RequestToServerInterface = { command: "showUserDetail", email: email };
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
                    htmlStudyDetails.textContent = "Studiengang: " + user.studycourse + ", Semester: " + user.semester;
                    //TODO durch Links ersetzen
                    let htmlFollower: HTMLParagraphElement = document.createElement("p");
                    htmlFollower.textContent = "Follower: " + user.followers.length.toString();
                    htmlFollowerSec.appendChild(htmlFollower);
                    let htmlFollowing: HTMLParagraphElement = document.createElement("p");
                    htmlFollowing.textContent = "Following: " + user.following.length.toString();
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

                    if (query.get("email") == "me") {
                        let linkEdit: HTMLAnchorElement = document.createElement("a");
                        linkEdit.href = "edit.html";
                        linkEdit.textContent = "Edit";
                        htmlName.appendChild(linkEdit);
                    }
                } else {
                    console.log("Error no User returned");
                }
            } else {
                console.log("Error: " + responseFromServer.message);
                //TODO
            }
        } else {
            //TODO weiterleitung
            console.log("Need to login again");
        }
    }
}