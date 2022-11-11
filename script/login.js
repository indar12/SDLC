let loginButton = document.querySelector(".loginButton");
// Cancel the default action of submit button
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
});
loginButton.addEventListener("click", checkLoginCredentials);
// get the username and password to check for the login credentials
async function checkLoginCredentials() {
  try {
    let user = document.getElementById("username");
    let password = document.getElementById("password");
    let userData = {};
    userData = { username: `${user.value}`, password: `${password.value}` };
    let loginCredential = await fetch(
      "http://localhost:5000/loginCredentialData",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    user.value = "";
    password.value = "";
    user.focus();
    //check for the status code if successful login to dashboard orelse show alert message
    if (loginCredential.ok) {
      alert("Login Success");
      window.location.href = "../html/dashboard.html";
    } else {
      alert("Invalid Username or password");
    }
  } catch (e) {
    alert(console.error(e));
  }
}

let signup = document.getElementById("signup");
signup.style.color = "blue";
