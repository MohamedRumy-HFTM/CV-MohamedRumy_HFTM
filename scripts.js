function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    if (name == "") {
        alert("Bitte geben Sie Ihren Namen ein!");
        return false;
    }

    if (email == "") {
        alert("Bitte geben Sie Ihre E-Mail ein!");
        return false;
    }

    if (subject == "") {
        alert("Bitte geben Sie einen Betreff ein!");
        return false;
    }

    if (message == "") {
        alert("Bitte geben Sie eine Nachricht ein!");
        return false;
    }

    alert("Vielen Dank für Ihre Nachricht!");
    return true;
}