function init() {
    $(document).ready(function() {
        if (getCookie("score") != "") {
            var username = getCookie("username");
            var score = getCookie("score");
            setCookie("score", "", 30);
            var userScore = { username: username, score: score };
            $.post('/api/leaderboardUpdate', userScore, function(resultUpd) {})
        }
        setTimeout(function() {
            $.post('/api/leaderboard', function(result) {
                    // console.log(result[0]);
                    var i = 0;
                    while (i < result.length) {
                        $("#" + i + "user").html(result[i].username);
                        $("#" + i + "score").html(result[i].score);
                        i++;
                    }
                    console.log("test" + result.length);
                })
                .fail(function() {
                    window.alert("test1");
                    console.log("error loading user");
                });

        }, 2000)

    })

};