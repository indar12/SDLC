let projectButton = document.querySelector(".project-btn");
let projectName = document.querySelector(".projectName-input");
let projectCardContainer = document.getElementById("project-card-container");
let bottomSection = document.querySelector(".bottom-section");
let card = document.querySelector(".card");
let mainContainer = document.querySelector(".main");
// Cancel the default action of submit button
document
  .getElementById("projectCreate-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); 
  });
// create a project when input value is not equal to null and if null it shows alert message
function validateProjectName() {
  if (projectName.value == "") {
    const alert = document.createElement("div");
    alert.classList.add("alert");
    alert.innerHTML = `<p class='alert-text'>You must enter a task!!!</p>`;
    projectCardContainer.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  } else {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    card.appendChild(cardContainer);
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    cardContainer.appendChild(cardContent);
    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card-title");
    cardContent.appendChild(cardTitle);
    const titleText = document.createElement("p");
    titleText.classList.add("title-text");
    titleText.innerText = `${projectName.value}`;
    cardTitle.appendChild(titleText);
    document.querySelector(".projectName-input").value = "";
    projectName.focus();
    titleText.addEventListener("click", () => {
      location.replace("../html/taskboard.html");
    });
  }
}

function replaceToLoginPage() {
  location.replace("../index.html");
}
