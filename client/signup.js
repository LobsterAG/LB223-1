// Source: https://github.com/SwitzerChees/simple-typescript-template
// waits for the DOM to load before attaching event listeners to the "signup" button
window.addEventListener("DOMContentLoaded", () => {
    // get the signup button
    const signupButton = document.getElementById("signup");
    // add an event listener to the signup button
    signupButton.addEventListener("click", () => {
        // get the username and password from the input fields
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        // create a new XMLHttpRequest object
        const request = new XMLHttpRequest();
        // set the request method and url
        request.open("POST", "/signup");
        // set the request header
        request.setRequestHeader("Content-Type", "application/json");
        // set the onload callback
        request.onload = () => {
            // get the response
            const response = JSON.parse(request.response);
            // check if the response was successful
            if (response.success) {
                // redirect the user to the login page
                window.location.href = "/login.html";
            }
            else {
                // display the error message
                alert(response.message);
            }
        };
        // send the request
        request.send(JSON.stringify({ username, password }));
    });
});
