var apiclient = (function (){

    var getUser = function (id, callback){
        $.ajax({
            type: "GET",
            url: "Sketchsync/" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data){
                callback(data);
            }
        })

    };

    var addUser = function (name){
        var data = JSON.stringify({name:name});
        return new Promise(function (resolve, reject){
            resolve(
                $.ajax({
                    url: "Sketchsync",
                    type: "POST",
                    data: data,
                    contentType: "application/json"
                })
            )
        })
    };

    var getAllUsers = function(callback){
        $.ajax({
                type: "GET",
                url: "Sketchsync/all",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                callback(data)}});
    };

    var getOrganizerName = function(callback){
        $.ajax({
            type: "GET",
            url: "Sketchsync/OrganizerName/OrganizerName",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                callback(data)}});
    };

    var cleanParticipantes = function (){
        return new Promise(function(resolve,reject){
            resolve(
                $.ajax({
                    url: "Sketchsync/clean",
                    type: 'DELETE'
                })
            )
        })
    }

        var setWinner = function (name){
            return new Promise(function (resolve, reject){
                resolve(
                    $.ajax({
                        url: "Sketchsync/"+name,
                        type: "PUT",
                        contentType: "application/json"
                    })
                )
            })
        };

    var saveClue  = function(contenido, tomado){
        var data = JSON.stringify({contenido:contenido, tomado:tomado});
        return new Promise(function(resolve, reject){
        resolve(
            $.ajax({
                type:"POST",
                url: "Sketchsync/Clue ",
                contentType: "application/json",
                data:data
            })
        )})
    };

    var getClue = function(callback){
        $.ajax({
            type: "GET",
            url: "Sketchsync/TakeClue",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                callback(data)}});
    };

    return{
        getUser: getUser,
        addUser: addUser,
        getAllUsers: getAllUsers,
        getOrganizerName: getOrganizerName,
        setWinner: setWinner,
        cleanParticipantes: cleanParticipantes,
        saveClue : saveClue,
        getClue :getClue
        }
    }
)();