const API_ENDPOINT = 'http://localhost:4200';
const LOGIN_ENDPOINT = `${API_ENDPOINT}/login`;

// using jQuery to wait for the document to be ready
$(document).ready(function () {
    // get the form and input elements
    const loginForm = document.querySelector('#login-form');
    const usernameInput = document.querySelector('#login-username');
    const passwordInput = document.querySelector('#login-password');
    // add an event listener to the form to handle the submit event (when the user clicks the submit button)
    loginForm.addEventListener('submit', async (e) => {
        // prevent the default behavior of the form (which is to refresh the page)
        e.preventDefault();
        // get the values from the input elements and trim any whitespace
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        // check if the username and password are valid (not empty and no whitespace) and if not, alert the user 
        if (!isValidInput(username) || !isValidInput(password)) {
            alert('Please enter a valid username and password.');
            return;
        }
        // if the username and password are valid, send a POST request to the login endpoint with the username and password in the body of the request
        try {
            // fetch returns a promise, so we need to await to get the response
            const response = await fetch(LOGIN_ENDPOINT, {
                // set the method to POST and the headers to include the content type of application/json
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // set the body of the request to the username and password as a JSON string
                body: JSON.stringify({ username, password }),
            });
            // if the response is not ok (status code 200-299), throw an error with the message from the response
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            // if the response is ok, get the data from the response and alert the user that the login was successful and redirect them to the home page
            const data = await response.json();
            alert('Log In Successful');
            window.location.href = `${API_ENDPOINT}/home.html`;
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request. Please try again later.');
        }
    });
});

// function to check if the input is valid (not empty and no whitespace) and return a boolean value
function isValidInput(input) {
    return input.length > 0 && !/\s/.test(input);
}