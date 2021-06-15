function init() {
    $(document).ready(function() {
        var num = null;
        var player = sessionStorage.getItem("Player");
        const elemno = document.querySelector("td#no");
        const elemuser = document.querySelector("td#nouser");
        const elemscore = document.querySelector("td#noscore");

        setTimeout(function() {
            $.post('/api/leaderboard', function(result) {
                console.log("Hi ", player);

                var i = 0;

                while (i < 5) {
                    $("#" + i + "user").html(result[i].name);
                    $("#" + i + "score").html(result[i].score);

                    if(result[i].name == player) {
                        num=i;
                        sessionStorage.setItem("num", i);
                        elemno.style.display = "none";
                        elemuser.style.display = "none";
                        elemscore.style.display = "none";
                    }
                    i++;

                }
                if(num != null) {
                    document.getElementById(num).bgColor = 'orange';
                } else {
                    document.getElementById('5').bgColor = 'orange';
                }
            })
            .fail(function() {
                window.alert("test1");
                console.log("error loading user");
            });

        }, 2)

        if(num === null && player!=null){
            var i=0;

            $.post('/api/leaderboard', function(result) {
                
                while(result[i].name != player) {
                    i++;
                }

                $("#no").html(i+1 +".");
                $("#nouser").html(result[i].name);
                $("#noscore").html(result[i].score);
            })
        }
    })

};