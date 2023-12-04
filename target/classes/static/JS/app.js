var apiclient = apiclient;

var app = (function (){
    var color ='black', x=0 ,y=0, dibujando=false;
    var stompClient = null;
    var initialX,
        initialY;

    function defcolor(){
        let input= document.getElementById('color');
        color = input.value;
        console.log(color);
    }

    function createUser(user){
        var name = user.split("@")[0];

        if(name !== ""){
            sessionStorage.setItem("name",name);
            apiclient.addUser(name).then(()=>{
                window.location = "participante.html";
            })
                .catch(error => console.log(error))
        }else{
            alert("agregue un nombre adecuado")
        }
    }

    function createOrganizer(Organizer){
        var name = Organizer + " Organizer";
        if(name !== ""){
            sessionStorage.setItem("name",name);
            apiclient.addUser(name).then(()=>{
                window.location = "Organizer.html";
            })
                .catch(error => console.log(error))
        }else {
            alert("agrege un nombre valido porfavor")
        }
    }

    var getUsers = function (){
        if(localStorage.getItem("logeo") !== "Organizer" || localStorage.getItem("logeo") === null){
            window.location = "index.html"
        }else{
            connectAndSubscribe(sessionStorage.getItem("name"));
            paintUsers()
        }
    }

    var paintUsers = function (){
        apiclient.getAllUsers(printTable);
    }

    var printTable = function (data){
        $("#participantesTable tbody").empty();
        const datanew = data.map((elemento) =>{
            return{
                name : elemento.name
            }
        });
        datanew.map((element) => {
            console.log(element.name)
            $("#participantesTable > tbody:last").append($(
                "<tr>" +
                    "<td>"+
                        "<div class=\"participant\">" +
                            "<span class=\"participant-name\">" + element.name + "</span>"  +
                "                <div class=\"actions\">" +
                "                    <button onclick='app.reDirectCanvaParticipante(\"" + element.name + "\")'>Observar Pantalla</button>"  +
                "                    <button class=\"btn-abrir-win\" id=\"btn-abrir-win\" onclick='app.openWin(\""+element.name+"\")'>Escoger Como Ganador</button>" +
                "                </div>" +
                "        </div>" +
                "   </td>" +
                "</tr>"));
        });
    }

    var publicarPregunta = function (){
        apiclient.getAllUsers(actualizarPreguntaParticiapantes);
    }

    var actualizarPreguntaParticiapantes = function (data){
        var pregunta = $("#pregunta").val();
        data.forEach((element) => {
            stompClient.send("/topic/"+element.name, {}, "actualizarPregunta:" + pregunta);
        })
    }

    var openWin = function (nombreGanador){
        apiclient.setWinner(nombreGanador).then(()=>{
            apiclient.getAllUsers(notificarGanador);
            window.location="index.html"
            apiclient.cleanParticipantes();
        })
    }


    var notificarGanador = function (data){
        var ganador = "";
        data.forEach((element) => {
            if(element.isGanador){
                ganador = element.name;
            }
        })

        data.forEach((element) => {
            stompClient.send("/topic/"+element.name, {}, "seleccionarGanador "+ganador);
        })

    }

    var reDirectCanvaParticipante = function (namePaticipante){
        window.location="participante.html"
        sessionStorage.setItem("userName", namePaticipante);
    }


    function getPointsUser(nombreParticipante){
        apiclient.getUser(nombreParticipante, drawAllPointsCanvas);
    }


    var connectAndSubscribe = function (name) {
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/'+name, function (eventbody) {
                if (eventbody.body === "delete"){
                    clearCanvas()
                }else if(eventbody.body === "actualizarUsuarios"){
                    paintUsers();
                }else if(eventbody.body.includes("seleccionarGanador")){
                    if(! name.includes("Organizer")){

                        var overgame = document.getElementById('overgame');
                        overgame.classList.add('activewin');
                        var list = eventbody.body.split(" ")
                        $("#ganador").append(list[1])
                    }
                }else if(eventbody.body.includes("actualizarPregunta")){

                    var list = eventbody.body.split(":")
                    alert("¡Se actualizó la pregunta!")
                    document.getElementById("pregunta").value = list[1];
                }else if(eventbody.body.includes("publicarPista")){
                    document.getElementById("botonPista").hidden=false;

                }else if(eventbody.body.includes("tomadaPista")){
                    document.getElementById("botonPista").hidden=true;

                }
                else{


                    var point = JSON.parse(eventbody.body);
                    drawPointCanvas(point);
                }
            });
        });
    };

    var mousePos = function(evt){
        canvas = document.getElementById("myCanvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    var deletePoints = function (){
        stompClient.send("/app/delete."+sessionStorage.getItem("name"));
    }

    var clearCanvas = function(){
        can = document.getElementById("myCanvas");
        ctx = can.getContext("2d");
        ctx.clearRect(0, 0, can.width, can.height);

    }

    var drawPointCanvas = function(point){
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(initialX, initialY);
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        console.log(point);
        ctx.closePath();

    };

    var userConnected = function (data){
        stompClient.send("/topic/"+data.name, {}, "actualizarUsuarios");
    }

    var drawAllPointsCanvas = function (data){
        if(data.points.length > 0) {
            data.points.forEach((element) => {
                drawPointCanvas(element);
            })
        }
    }

    var conectarCavnaParticipante = function (nombreParticipante){
        connectAndSubscribe(nombreParticipante);
        getPointsUser(nombreParticipante);
    }

    var init = function (){
        if(localStorage.getItem("logeo") === null){
            window.location = "index.html"
        }else{
            var name = (sessionStorage.getItem("name"))
            if(! name.includes("Organizer")){
                conectarCavnaParticipante(name)
                setTimeout(()=>{apiclient.getOrganizerName(userConnected)},500)
                var canvas = document.getElementById("myCanvas"),
                    context = canvas.getContext("2d");
                //if PointerEvent is suppported by the browser:
                if(window.PointerEvent) {

                    let md = (ev) => {
                        var point = mousePos(event);
                        name = sessionStorage.getItem("name");
                        stompClient.send("/app/"+name, {}, JSON.stringify(point));
                    }

                    canvas.addEventListener("pointerdown", function(event){

                        canvas.addEventListener("mousemove", md);
                    });

                    canvas.addEventListener("pointerup", function(event) {
                        canvas.removeEventListener("mousemove", md);
                    });
                }
            }else{
                conectarCavnaParticipante(sessionStorage.getItem("userName"));
            }
        }


    }

    var publicarPistaParticiapantes = function (data){
        data.forEach((element) => {
            stompClient.send("/topic/"+element.name, {}, "publicarPista");
        })
    }

    var guardarPista = function (){
        apiclient.getAllUsers(publicarPistaParticiapantes);
        var contenido = document.getElementById("floatingInputPista").value;
        var tomado = true;
        apiclient.saveClue(contenido, tomado);
    }

    function setContenidoPista(data){
        document.getElementById("pista").value = data;
    }

    function getPista(){
        apiclient.getClue(setContenidoPista);
        apiclient.getAllUsers(tomadaPista);
    }

    function tomadaPista(data){
        data.forEach((element) => {
            stompClient.send("/topic/"+element.name, {}, "tomadaPista");
        })
    }

    return {
        createUser: createUser,
        init:init,
        deletePoints: deletePoints,
        getUsers: getUsers,
        createOrganizer: createOrganizer,
        reDirectCanvaParticipante   : reDirectCanvaParticipante,
        openWin: openWin,
        publicarPregunta: publicarPregunta,
        guardarPista: guardarPista,
        getPista:getPista,
        defcolor:defcolor
    }
})();
console.log(app);



