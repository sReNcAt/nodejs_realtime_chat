var app = require('express')(); //express 모듈 불러오기
var server = require('http').Server(app); //http 모듈을 불러와 express모듈을 사용
var io = require('socket.io')(server); //socket.io 모듈을 불러와 http모듈을 사용

server.listen(8001); //8001포트로 웹서버 생성

app.get("/",function (req,res){ // http://서버주소/ 주소 매핑
    res.sendfile(__dirname+'/index.html'); //index.html을 보냄
});
var user_arr = {};

io.on("connection",function (socket){ //소켓이 연결됫을경우
    socket.on("join",function(data){ //소켓에 join으로 요청이 올경우
        var user="";
        console.log(socket.id+" : "+data);
        user_arr[socket.id]=data;
        for (var key in user_arr){
            user+=user_arr[key]+"\n";
        }
        io.emit("user",user); //모든사용자에게 user으로 user데이터를 보냄
    });
    socket.on("msg",function(data){//소켓에 msg로 요청이 올경우
        console.log(socket.id);
        console.log(user_arr[socket.id]);
        console.log(data);
        io.emit("broadcast",user_arr[socket.id]+" : "+data);
        //모든사용자에게 broadcast로 메세지 데이터를 보냄
    });
    socket.on("disconnect",function(data){//소켓연결이 끊어질경우
        console.log(socket.id);
        try{
            delete user_arr[socket.id];
            io.emit("load_user","server");
            //모든사용자에게 load_user로 server 라는데이터를 보냄
        }catch (e){
            console.log(e);
        }
    });
    socket.on("load",function(data){//소켓에 load으로 요청이 올경우
        var user="";
        try {
            for (var key in user_arr){
                user+=user_arr[key]+"\n";
            }
            io.emit("user",user);
            //모든사용자에게 user으로 user데이터를 보냄
        }catch (e){
            console.log(e);
        }
    })
});