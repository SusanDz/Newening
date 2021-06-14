function init() {
    $(document).ready(function() {
        var num = null;
        var player = sessionStorage.getItem("Player");
        // const elem = document.querySelector(".you");
        // elem.style.display = "none";

        setTimeout(function() {
            $.post('/api/leaderboard', function(result) {
                console.log("Hi ", player);

                var i = 0;
                    
                while (i < result.length) {
                    $("#" + i + "user").html(result[i].name);
                    $("#" + i + "score").html(result[i].score);

                    if(result[i].name == player) {
                        num=i;
                    }
                    i++;

                }
                console.log("Num",num);
                $("#" + num + "user").css("border-colour", "yellow");

            })
            .fail(function() {
                window.alert("test1");
                console.log("error loading user");
            });

        }, 2)

        if(num == null){
            var s= 0;
            var play = {username:player, score:s};
            var i=0;

            $.post('/api/getScore', play, function(result) {
                // elem.style.display = "block";
                console.log(result);
                console.log(result[0].id);
                $("#no").html("6.");
                $("#nouser").html(result[0].name);
                $("#noscore").html(result[0].score);
            })
        }
    })

};