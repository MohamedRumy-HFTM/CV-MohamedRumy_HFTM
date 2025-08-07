function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    var errors = [];

    if (name == "") {
        errors.push("Name");
    }

    if (email == "") {
        errors.push("E-Mail");
    } else if (!email.includes("@") || !email.includes(".")) {
        errors.push("gültige E-Mail-Adresse");
    }

    if (subject == "") {
        errors.push("Betreff");
    }

    if (message == "") {
        errors.push("Nachricht");
    } else if (message.length < 10) {
        errors.push("längere Nachricht (min. 10 Zeichen)");
    }

    if (errors.length > 0) {
        alert("Bitte folgende Felder ausfüllen: " + errors.join(", "));
        return false;
    }

    showSuccessMessage();
    return false;
}

function showSuccessMessage() {
    var form = document.querySelector("form");
    var successDiv = document.createElement("div");
    successDiv.style.color = "green";
    successDiv.style.padding = "10px";
    successDiv.style.marginTop = "10px";
    successDiv.style.border = "1px solid green";
    successDiv.style.borderRadius = "4px";
    successDiv.innerHTML = "<strong>Vielen Dank!</strong> Ihre Nachricht wurde gesendet.";

    form.appendChild(successDiv);

    setTimeout(function() {
        successDiv.remove();
        form.reset();
    }, 5000);
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("Formular-Validierung geladen");

    var button = document.querySelector("button[type='submit']");
    button.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#34495e";
    });

    button.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#2c3e50";
    });
});