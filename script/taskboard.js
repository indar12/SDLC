let notStarted = document.getElementById("not-started");
let inprogress = document.getElementById("in-progress");
let completed = document.getElementById("completed");
let filterBtn = document.querySelector(".task-filter-button");
let statusNotStarted = document.querySelector(".statusNotStarted");
let statusInProgress = document.querySelector(".statusInProgress");
let statusCompleted = document.querySelector(".statusCompleted");
let tasks, tempTask;
let tempSort = [];
let order = "ascending";
let flag = 0;
let old_name, old_start_date, old_end_date, old_categ;

(() => {
  
  defaultFun();
})();
// initially the default function will call it will display the cards present in the json file
async function defaultFun() {
  let taskData = await fetch("http://localhost:5000/getTask", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  checkDeadline();
  let data = await taskData.json();
  tasks = data;
  notStarted.replaceChildren();
  inprogress.replaceChildren();
  completed.replaceChildren();
  for (let i = 0; i < Object.keys(tasks).length; i++) {
    if (tempSort.includes(tasks[Object.keys(tasks)[i]].taskName) === false)
      tempSort.push(tasks[Object.keys(tasks)[i]].taskName);
  }
  for (let i = 0; i < Object.keys(tasks).length; i++) {
    createCard(
      tasks[Object.keys(tasks)[i]].taskName,
      tasks[Object.keys(tasks)[i]].startDate,
      tasks[Object.keys(tasks)[i]].endDate,
      `${tasks[Object.keys(tasks)[i]].category}`
    );
  }
  dragAndDrop();
}
// check for the ascending or descending button clicked then update the card based on that
let sortBtn = document.querySelector(".task-sort-button");
sortBtn.addEventListener("click", () => {
  notStarted.replaceChildren();
  inprogress.replaceChildren();
  completed.replaceChildren();
  if (flag == 0) {
    order = "ascending";
  } else {
    order = "descending";
  }
  checkDeadline();
  sortCards(tempSort, order);
  for (let i = 0; i < tempSort.length; i++) {
    createCard(
      tasks[tempSort[i]].taskName,
      tasks[tempSort[i]].startDate,
      tasks[tempSort[i]].endDate,
      tasks[tempSort[i]].category
    );
  }
});

let orderIcon = document.querySelector(".task-sort-button");
orderIcon.innerHTML = `<i class="fa-solid fa-arrow-up-a-z orderIcon"></i>`;
function sortCards(tempSort, order) {
  tempSort.sort(function (a, b) {
    var previousTask = tasks[a].startDate;
    var currentTask = tasks[b].startDate;
    if (order == "descending") {
      flag = 0;
      orderIcon.innerHTML = `<i class="fa-solid fa-arrow-up-a-z orderIcon"></i>`;
      if (previousTask < currentTask) return 1;
      if (previousTask > currentTask) return -1;
    } else if (order == "ascending") {
      flag = 1;
      orderIcon.innerHTML = `<i class="fa-solid fa-arrow-down-z-a orderIcon"></i>`;
      if (previousTask < currentTask) return -1;
      if (previousTask > currentTask) return 1;
    }
  });
}

const addTask = document.querySelector(".task-add-button");
addTask.addEventListener("click", () => {
  let taskInput = document.querySelector(".task-input");
  taskInput.value = "";
  let startDate = document.querySelector(".task-startDate");
  startDate.value = "";
  let endDate = document.querySelector(".task-endDate");
  endDate.value = "";
  toggle();
});
// the popup menu will be active when plus icon is clicked
function toggle() {
  var blur = document.getElementById("blur");
  blur.classList.toggle("active");
  var popup = document.getElementById("popup");
  popup.classList.toggle("active");
}
// after entering the task name and date if user enter the submit button it checks for valid taskname or for valid date and sends data to server if status code was successful if calls the default function to create card orelse prompt with alert message
let closeBtn = document.getElementById("close");
closeBtn.addEventListener("click", () => {
  toggle();
  (async () => {
    try {
      let taskInput = document.querySelector(".task-input");
      taskInput = taskInput.value;
      let startDate = document.querySelector(".task-startDate");
      startDate = startDate.value;
      let endDate = document.querySelector(".task-endDate");
      endDate = endDate.value;
      let startYear, startMonth, start_date, endYear, endMonth, end_date;
      startYear = startDate.slice(0, 4);
      startMonth = startDate.slice(5, 7);
      start_date = startDate.slice(8, 10);
      endYear = endDate.slice(0, 4);
      endMonth = endDate.slice(5, 7);
      end_date = endDate.slice(8, 10);
      if (startDate <= endDate && startMonth <= endMonth) {
        if (
          taskInput.length != 0 &&
          startDate.length != 0 &&
          endDate.length != 0
        ) {
          let taskData;
          taskData = {
            taskId: taskInput,
            taskName: taskInput,
            category: "not-started",
            startDate: startDate,
            endDate: endDate,
          };
          let taskCredential = await fetch(
            "http://localhost:5000/taskCredential",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify(taskData),
            }
          );
          if (taskCredential.ok) {
            defaultFun();
          }
        } else {
          alert("Enter a valid data");
        }
      } else {
        alert("Starting date should be less than ending date");
      }
    } catch (e) {
      alert(e);
    }
  })();
});
// it will checks for category and create the respective cards in the bucket
function createCard(taskName, startDate, endDate, category) {
  if (category == "not-started") {
    let taskContainer = document.getElementById("not-started");
    let taskCard = document.createElement("div");
    taskCard.setAttribute("class", "list-item");
    taskCard.setAttribute("id", `${taskName}`);
    taskCard.setAttribute("draggable", "true");
    taskCard.innerText = taskName;
    taskContainer.appendChild(taskCard);
    let taskDate = document.createElement("div");
    taskDate.setAttribute("class", "taskDate");
    taskCard.appendChild(taskDate);
    taskDate.innerHTML = `<p class='date'>${startDate} <i class="fa-solid fa-arrow-right"></i> ${endDate}`;
    let change = document.createElement("div");
    change.setAttribute("class", "change");
    taskCard.appendChild(change);
    let trash = document.createElement("div");
    trash.setAttribute("class", "trash");
    change.appendChild(trash);
    trash.innerHTML = `<button class="deleteBtn" onClick="deleteCard(${taskName})"><i class="fa-solid fa-trash"></i></button>`;
    let edit = document.createElement("div");
    edit.setAttribute("class", "edit");
    change.appendChild(edit);
    edit.innerHTML = `<button class="editBtn" onClick="editCard(${taskName})"><i class="fa-sharp fa-solid fa-pen"></i></button>`;
    let status = document.createElement("div");
    status.setAttribute("class", "status");
    change.appendChild(status);
    status.innerHTML = `<button class="statusBtn dropdown"><i class="fa-solid fa-bars"></i><div class="dropdown-content"><a class="statusNotStarted" href="#" onClick="statusUpdate(${taskName},'not-started')">Not-Started</a><a class="statusInProgress" href="#" onClick="statusUpdate(${taskName},'in-progress')">In-progress</a><a class="statusCompleted" href="#" onClick="statusUpdate(${taskName},'completed')">Completed</a></button>`;
  } else if (category == "in-progress") {
    let taskContainer = document.getElementById("in-progress");
    let taskCard = document.createElement("div");
    taskCard.setAttribute("class", "list-item");
    taskCard.setAttribute("id", `${taskName}`);
    taskCard.setAttribute("draggable", "true");
    taskCard.innerText = taskName;
    taskContainer.appendChild(taskCard);
    let taskDate = document.createElement("div");
    taskDate.setAttribute("class", "taskDate");
    taskCard.appendChild(taskDate);
    taskDate.innerHTML = `<p class='date'>${startDate} <i class="fa-solid fa-arrow-right"></i> ${endDate}`;
    let change = document.createElement("div");
    change.setAttribute("class", "change");
    taskCard.appendChild(change);
    let trash = document.createElement("div");
    trash.setAttribute("class", "trash");
    change.appendChild(trash);
    trash.innerHTML = `<button class="deleteBtn" onClick="deleteCard(${taskName})"><i class="fa-solid fa-trash"></i></button>`;
    let edit = document.createElement("div");
    edit.setAttribute("class", "edit");
    change.appendChild(edit);
    edit.innerHTML = `<button class="editBtn" onClick="editCard(${taskName})"><i class="fa-sharp fa-solid fa-pen"></i></button>`;
    let status = document.createElement("div");
    status.setAttribute("class", "status");
    change.appendChild(status);
    status.innerHTML = `<button class="statusBtn dropdown"><i class="fa-solid fa-bars"></i><div class="dropdown-content"><a class="statusNotStarted" href="#" onClick="statusUpdate(${taskName},'not-started')">Not-Started</a><a class="statusInProgress" href="#" onClick="statusUpdate(${taskName},'in-progress')">In-progress</a><a class="statusCompleted" href="#" onClick="statusUpdate(${taskName},'completed')">Completed</a></button>`;
  } else if (category == "completed") {
    let taskContainer = document.getElementById("completed");
    let taskCard = document.createElement("div");
    taskCard.setAttribute("class", "list-item");
    taskCard.setAttribute("id", `${taskName}`);
    taskCard.setAttribute("draggable", "true");
    taskCard.innerText = taskName;
    taskContainer.appendChild(taskCard);
    let taskDate = document.createElement("div");
    taskDate.setAttribute("class", "taskDate");
    taskCard.appendChild(taskDate);
    taskDate.innerHTML = `<p class='date'>${startDate} <i class="fa-solid fa-arrow-right"></i> ${endDate}`;
    let change = document.createElement("div");
    change.setAttribute("class", "change");
    taskCard.appendChild(change);
    let trash = document.createElement("div");
    trash.setAttribute("class", "trash");
    change.appendChild(trash);
    trash.innerHTML = `<button class="deleteBtn" onClick="deleteCard(${taskName})"><i class="fa-solid fa-trash"></i></button>`;
    let edit = document.createElement("div");
    edit.setAttribute("class", "edit");
    change.appendChild(edit);
    edit.innerHTML = `<button class="editBtn" onClick="editCard(${taskName})"><i class="fa-sharp fa-solid fa-pen"></i></button>`;
    let status = document.createElement("div");
    status.setAttribute("class", "status");
    change.appendChild(status);
    status.innerHTML = `<button class="statusBtn dropdown"><i class="fa-solid fa-bars"></i><div class="dropdown-content"><a class="statusNotStarted" href="#" onClick="statusUpdate(${taskName},'not-started')">Not-Started</a><a class="statusInProgress" href="#" onClick="statusUpdate(${taskName},'in-progress')">In-progress</a><a class="statusCompleted" href="#" onClick="statusUpdate(${taskName},'completed')">Completed</a></button>`;  }
  dragAndDrop();
}
// if cards move to another bucket it removes the card in the present bucket and appends to the respective bucket
function dragAndDrop() {
  let draggedItem = "";
  let list_items = document.querySelectorAll(".list-item");
  const lists = document.querySelectorAll(".list");
  for (let i = 0; i < list_items.length; i++) {
    const item = list_items[i];
    item.addEventListener("dragstart", function () {
      draggedItem = item;
      setTimeout(function () {
        item.style.display = "none";
        item.remove();
      }, 0);
    });
    item.addEventListener("dragend", function () {
      setTimeout(function () {
        draggedItem.style.display = "block";
        draggedItem = "";
      }, 0);
    });
    for (let j = 0; j < lists.length; j++) {
      const list = lists[j];
      list.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      list.addEventListener("dragenter", function (e) {
        e.preventDefault();
        this.style.backgroundColor = "rgba(0,0,0,0.2)";
      });
      list.addEventListener("dragleave", function (e) {
        this.style.backgroundColor = "rgba(0,0,0,0.1)";
      });
      list.addEventListener("drop", function (e) {
        let taskContainer = document.querySelectorAll(".taskContainer");
        taskContainer[j].append(draggedItem);
        let dragItem = draggedItem.id;
        for (let k = 0; k < Object.keys(tasks).length; k++) {
          if (dragItem == tasks[Object.keys(tasks)[k]].taskName) {
            tasks[Object.keys(tasks)[k]].category = draggedItem.parentNode.id;
            tempTask = tasks;
            swap();
            async function swap() {
              let taskData;
              taskData = {
                taskId: tempTask[dragItem].taskName,
                taskName: tempTask[dragItem].taskName,
                category: tempTask[dragItem].category,
                startDate: tempTask[dragItem].startDate,
                endDate: tempTask[dragItem].endDate,
              };
              let moveCredential = await fetch(
                "http://localhost:5000/moveCredential",
                {
                  method: "POST",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify(taskData),
                }
              );
            }
          }
        }
        this.style.backgroundColor = "rgba(0,0,0,0.1)";
      });
    }
  }
}
let filterFlag = 0;
// if filter button clicked it gets the output card and hides the other cards in the bucket and if again click the filter button it shows all the cards in the bucket
filterBtn.addEventListener("click", () => {
  if (filterFlag == 0) {
    filterFlag = 1;
    let filterInput = document.querySelector(".task-filter-input");
    let filterValue = filterInput.value;
    if (filterValue.length == 0) {
      alert("Enter a value to filter");
      filterInput.focus();
    } else {
      notStarted.replaceChildren();
      inprogress.replaceChildren();
      completed.replaceChildren();
      checkDeadline();
      let filterCard = [];
      for (let i = 0; i < tempSort.length; i++) {
        if (tempSort[i].startsWith(filterValue)) {
          filterCard.push(tempSort[i]);
        }
      }
      for (let i = 0; i < filterCard.length; i++) {
        createCard(
          tasks[filterCard[i]].taskName,
          tasks[filterCard[i]].startDate,
          tasks[filterCard[i]].endDate,
          tasks[filterCard[i]].category
        );
      }
    }
  } else {
    filterFlag = 0;
    location.reload();
  }
});
// gets the card which needs to deleted and sends to server and delete in the json file and calls the default function to display the cards in the bucket
function deleteCard(obj) {
  let deleteArray;
  let parentId = obj.id;
  (async () => {
    for (let i = 0; i < tempSort.length; i++) {
      if (parentId == tempSort[i]) {
        deleteArray = { taskName: `${parentId}` };
        tempSort = tempSort.filter(function (e) {
          return e !== `${parentId}`;
        });
      }
    }
    let deleteCredential = await fetch("http://localhost:5000/delete-task", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(deleteArray),
    });
    if (deleteCredential.ok) {
      defaultFun();
    }
  })();
}
// gets the oldname and newname of the card and delete the old card and adds the new card to the json file and calls the default function to display the card
function editCard(name) {
  (() => {
    let item = name.id;
    popUpMenu();
    old_name = item;
    for (let i = 0; i < Object.keys(tasks).length; i++) {
      if (item == tasks[Object.keys(tasks)[i]].taskName) {
        old_start_date = tasks[Object.keys(tasks)[i]].startDate;
        old_end_date = tasks[Object.keys(tasks)[i]].endDate;
        old_categ = tasks[Object.keys(tasks)[i]].category;
      }
    }
    let taskInput = document.querySelector(".task-inputs");
    taskInput.value = `${old_name}`;
    let startDate = document.querySelector(".task-startDates");
    startDate.value = `${old_start_date}`;
    let endDate = document.querySelector(".task-endDates");
    endDate.value = `${old_end_date}`;
  })();
}
// this will active and hides the modal 
function popUpMenu() {
  var blur = document.getElementById("blur");
  blur.classList.toggle("active");
  var popup = document.getElementById("popups");
  popup.classList.toggle("active");
}

let submit = document.getElementById("submit");
submit.addEventListener("click", editCards);

async function editCards() {
  popUpMenu();
  let taskInput = document.querySelector(".task-inputs").value;
  let startDate = document.querySelector(".task-startDates").value;
  let endDate = document.querySelector(".task-endDates").value;
  let category = old_categ;
  let startYear, startMonth, start_date, endYear, endMonth, end_date;
  startYear = startDate.slice(0, 4);
  startMonth = startDate.slice(5, 7);
  start_date = startDate.slice(8, 10);
  endYear = endDate.slice(0, 4);
  endMonth = endDate.slice(5, 7);
  end_date = endDate.slice(8, 10);
  if (startDate <= endDate && startMonth <= endMonth) {
    if (taskInput.length != 0 && startDate.length != 0 && endDate.length != 0) {
      let taskData;
      taskData = {
        taskId: taskInput,
        taskName: taskInput,
        category: category,
        startDate: startDate,
        endDate: endDate,
        oldName: old_name,
      };
      tempSort = tempSort.filter(function (e) {
        return e !== `${old_name}`;
      });
      let editCredential = await fetch("http://localhost:5000/editCredential", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      if (editCredential.ok) {
        defaultFun();
      }
    } else {
      alert("Enter a valid data");
    }
  } else {
    alert("Starting date should be less than ending date");
  }
}
// this function checks for the deadline and if it is deadline today then higlight the card in red color
async function checkDeadline() {
  let taskData = await fetch("http://localhost:5000/getTask", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  let taskName = [];
  let startDate,
    endDate,
    startYear,
    startMonth,
    start_date,
    endYear,
    endMonth,
    end_date;
  let startingDate;
  let todayDate = new Date().getDate();
  let data = await taskData.json();
  let project = data;
  let todayMonth = new Date().getMonth() + 1;
  todayDate < 10 ? (todayDate = addZero(todayDate)) : (todayDate = todayDate);
  function addZero(str) {
    return (str = "0" + str);
  }
  let todayYear = new Date().getFullYear();
  let todayDay = todayMonth + "/" + todayDate + "/" + todayYear;
  for (let i = 0; i < Object.keys(project).length; i++) {
    taskName = project[Object.keys(project)[i]].taskName;
    startDate = project[Object.keys(project)[i]].startDate;
    endDate = project[Object.keys(project)[i]].endDate;
    startYear = startDate.slice(0, 4);
    startMonth = startDate.slice(5, 7);
    start_date = startDate.slice(8, 10);
    endYear = endDate.slice(0, 4);
    endMonth = endDate.slice(5, 7);
    end_date = endDate.slice(8, 10);
    startingDate = startMonth + "/" + start_date + "/" + startYear;
    if (startingDate == todayDay) {
      let deadLineCard = document.getElementById(`${taskName}`);
      deadLineCard.style.background = "red";
    }
  }
}
// user can hover the card and it shows the option to  move to the other buckets 
function statusUpdate(id,status){
  let taskItem = id.id;
  let taskStatus = status;
  swap();
  async function swap() {
    let taskData;
    taskData = {
      taskId: taskItem,
      taskName: taskItem,
      category: status,
      startDate: tasks[taskItem].startDate,
      endDate: tasks[taskItem].endDate,
    };
    let moveCredential = await fetch(
      "http://localhost:5000/moveCredential",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(taskData),
      }
    );
    if(moveCredential.ok)
    {
      defaultFun();
    }
  }
}

// takes to the login page
function replaceToLoginPage() {
  location.replace("../index.html");
}
