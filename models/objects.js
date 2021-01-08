function User (id, name, pass, score) {
        this.id = id;
        this.username = name;
        this.password = pass;
}
function Session (id, date) {
        this.id = id;	
        this.startDate = date;     	
}	

class Participant {
        constructor(sid, uid, date, score) {
            this.sessionId = sid;
            this.userId = uid;
            this.startDate = date;
            this.endDate = date;
            this.score = score;
        }
}
    
class Score {
        constructor(username, score) {
            this.username = username;
            this.score = score;
        }
}
    
module.exports = {	
        User,	
        Session,
        Participant,
        Score
    }
