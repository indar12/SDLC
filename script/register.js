let registerButton = document.querySelector(".register-button");
// Cancel the default action of submit button
document
  .getElementById("register-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
  });
registerButton.addEventListener("click", checkRegisterCredentials);
//get the username,password and confirm password to check the signup credentials and sends as post method to server and stores in json file
async function checkRegisterCredentials() {
  try {
    let user = document.getElementById("username");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirmPassword");
    let userData = {};
    userData = {
      username: `${user.value}`,
      password: `${password.value}`,
      confirmPassword: `${confirmPassword.value}`,
    };
    let registerCredential = await fetch(
      "http://localhost:5000/registerCredentialData",
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
    confirmPassword.value = "";
    // after submitting, again it focus on the input field
    user.focus();
    // check for status code and execute the respective alert message
    if (registerCredential.status == 400) {
      alert("User already Exist");
    } else if (registerCredential.status == 404) {
      alert("Password doesn't match");
    } else if (registerCredential.status == 410) {
      alert("No empty inputs allowed");
    } else {
      alert("User created Successfully");
    }
  } catch (e) {
    alert(console.error(e));
  }
}

let signup = document.getElementById("login");
signup.style.color = "blue";
