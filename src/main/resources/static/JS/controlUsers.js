async function signIn() {
    const name = prompt("Ingrese su nombre de usuario:"); // Pide al usuario su nombre
    if (name) { // Comprueba si el usuario proporcionó un nombre
        localStorage.setItem("logeo", name);

        if (name === "Organizer") {
            app.createOrganizer(name);
        } else {
            app.createUser(name);
        }
    } else {
        console.log("El usuario no proporcionó un nombre.");