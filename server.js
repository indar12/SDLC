const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
let userData = fs.readFileSync("./json/data.json");
userData = JSON.parse(userData);
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json());

app.post("/loginCredentialData", function (req, res) {
  let user = req.body.username;
  let password = req.body.password;
  const account = userData.find(
    (obj) => obj.username == user && obj.password == password
  );
  if (account == undefined) {
    res.sendStatus(404);
    res.end();
  } else {
    res.sendStatus(200);
    res.end();
  }
});

app.post("/registerCredentialData", function (req, res) {
  let user = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let userDetails = { username: `${user}`, password: `${password}` };
  if (user == "" || password == "" || confirmPassword == "") {
    res.sendStatus(410);
    res.end();
  } else if (password != confirmPassword) {
    res.sendStatus(404);
    res.end();
  } else if (user == userData.username) {
    res.sendStatus(400);
    res.end();
  } else {
    userData.push(userDetails);
    fs.writeFile("./json/data.json", JSON.stringify(userData), () => {});
    res.sendStatus(200);
    res.end();
  }
});


app.use(express.json());
app.use(express.static(path.join(__dirname, "./html/taskboard.html")));

app.get("/getTask", (req, res) => {
  let taskData = JSON.parse(fs.readFileSync("./json/taskData.json"));
  res.send(taskData);
});

app.post("/taskCredential", function (req, res) {
  let data = fs.readFileSync("./json/taskData.json");
data = JSON.parse(data);
  let id = req.body.taskId;
  data[id] = {
    taskId: `${req.body.taskId}`,
    taskName: `${req.body.taskName}`,
    category: `${req.body.category}`,
    startDate: `${req.body.startDate}`,
    endDate: `${req.body.endDate}`,
  };
  let initialData = JSON.stringify(data);
  fs.writeFile("./json/taskData.json", initialData, () => {});
  res.sendStatus(200);
  res.end();
});

app.post("/editCredential", function (req, res) {
  let data = fs.readFileSync("./json/taskData.json");
data = JSON.parse(data);
  let username = req.body.oldName;
  delete data[username];
  let id = req.body.taskId;
  data[id] = {
    taskId: `${req.body.taskId}`,
    taskName: `${req.body.taskName}`,
    category: `${req.body.category}`,
    startDate: `${req.body.startDate}`,
    endDate: `${req.body.endDate}`,
  };
  let editData = JSON.stringify(data);
  fs.writeFile("./json/taskData.json", editData, () => {});
  res.sendStatus(200);
  res.end();
});

app.post("/moveCredential", function (req, res) {
  let data = fs.readFileSync("./json/taskData.json");
data = JSON.parse(data);
  let id = req.body.taskId;
  data[id] = {
    taskId: `${req.body.taskId}`,
    taskName: `${req.body.taskName}`,
    category: `${req.body.category}`,
    startDate: `${req.body.startDate}`,
    endDate: `${req.body.endDate}`,
  };
  let moveData = JSON.stringify(data);
  fs.writeFile("./json/taskData.json", moveData, () => {});
  res.sendStatus(200);
  res.end();
});

app.post("/delete-task", function (req, res) {
  let data = fs.readFileSync("./json/taskData.json");
data = JSON.parse(data);
  let task = JSON.parse(fs.readFileSync("./json/taskData.json"));
  let username = req.body.taskName;
  delete task[username];
  task = JSON.stringify(task);
  fs.writeFile("./json/taskData.json", task, () => {});
  res.sendStatus(200);
  res.end();
});



app.listen(5000);
