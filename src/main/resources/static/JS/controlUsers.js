async function signIn(){
    const config = {
        auth: {
            clientId: '2900126f-1811-46f9-91f1-03e9e383bd94',
            authority: 'https://login.microsoftonline.com/common/',
            redirectUri: 'http://localhost:8080/index.html'
        }
    };
    var client = new Msal.UserAgentApplication(config);
    var request = {
        scopes: ['user.read']
    };
    let loginResponse = await client.loginPopup(request);
    console.log("hola bienvenido ")
    localStorage.setItem("logeo", loginResponse.account.name)
    if (loginResponse.account.name === "Organizer"){
        app.createOrganizer(loginResponse.account.name)
    }else{

        app.createUser(loginResponse.account.userName)
    }
}