function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;
    var errors = [];

    if (name === "") errors.push("Name");
    if (email === "") {
        errors.push("E-Mail");
    } else if (!email.includes("@") || !email.includes(".")) {
        errors.push("gültige E-Mail-Adresse");
    }
    if (subject === "") errors.push("Betreff");
    if (message === "") {
        errors.push("Nachricht");
    } else if (message.length < 10) {
        errors.push("längere Nachricht (min. 10 Zeichen)");
    }

    if (errors.length > 0) {
        alert("Bitte folgende Felder ausfüllen: " + errors.join(", "));
        return false;
    }
    return true;
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
    emailjs.init("NptaAAi7rHTV3_kLK");
    var form = document.querySelector("form");
    form.addEventListener("submit", function(e) {
        if (!validateForm()) {
            e.preventDefault();
            return;
        }
        sendEmail();
    });
    var button = document.querySelector("button[type='submit']");
    button.addEventListener("mouseover", function() {
        this.style.backgroundColor = "#34495e";
    });
    button.addEventListener("mouseout", function() {
        this.style.backgroundColor = "#2c3e50";
    });
});

function sendEmail() {
    var button = document.querySelector("button[type='submit']");
    var originalText = button.textContent;
    button.textContent = "Wird gesendet...";
    button.disabled = true;
    var templateParams = {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        message: document.getElementById("subject").value + "\n\n" + document.getElementById("message").value
    };
    emailjs.send('service_2ro0mw5', 'template_do7y9wr', templateParams)
        .then(function(response) {
            console.log('Erfolgreich!', response.status, response.text);
            showSuccessMessage();
            button.textContent = originalText;
            button.disabled = false;
        }, function(error) {
            console.log('Fehler...', error);
            alert("Entschuldigung, es gab einen Fehler beim Senden. Bitte versuchen Sie es später erneut.");
            button.textContent = originalText;
            button.disabled = false;
        });
}
