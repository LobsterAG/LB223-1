// Source: https://github.com/SwitzerChees/simple-typescript-template
// waits for the DOM to load before attaching event listeners to the "login" button
window.addEventListener("DOMContentLoaded", () => {
  // attaches an event listener to the "login" button
  const inputUsername = document.getElementById("username");
  const inputPassword = document.getElementById("password");
  const buttonLogin = document.getElementById("login");
  const loginForm = document.getElementById("login-form");
  // prevents the default action of submitting the form
  function onLoginFormSubmitted(event) {
    event.preventDefault();
  }
  loginForm.addEventListener("submit", onLoginFormSubmitted);
  // attaches an event listener to the "login" button
  buttonLogin.addEventListener("click", () => {
    // creates a user object with the username and password
    const user = {
      username: inputUsername.value,
      password: inputPassword.value
    };
    // sends a POST request to the server with the user object in the body
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(data => {
        // if the server returns an error, display the error message
        if (data.error) {
          alert(data.error);
        }
        // if the server returns a success message, redirect the user to the login page
        else if (data.message) {
          alert(data.message);
          window.location.href = "/home.html";
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
});