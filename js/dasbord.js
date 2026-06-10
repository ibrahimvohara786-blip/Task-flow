if(localStorage.getItem("loggedIn")!=="true"){
window.location.href="index.html";
}

const user=
JSON.parse(localStorage.getItem("user"));

document.getElementById(
"welcomeUser"
).innerText=
`Welcome, ${user.name}`;

let tasks=
JSON.parse(
localStorage.getItem("tasks")
)||[];

const taskInput=
document.getElementById("taskInput");

const taskList=
document.getElementById("taskList");

const addTaskBtn=
document.getElementById("addTaskBtn");

function saveTasks(){

localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);

}

function updateStats(){

const total=tasks.length;

const completed=
tasks.filter(
t=>t.completed
).length;

document.getElementById(
"totalTasks"
).innerText=total;

document.getElementById(
"completedTasks"
).innerText=completed;

document.getElementById(
"pendingTasks"
).innerText=
total-completed;

}

function renderTasks(){

taskList.innerHTML="";

tasks.forEach((task,index)=>{

const li=
document.createElement("li");

li.className=
"task-item";

if(task.completed){
li.classList.add("completed");
}

li.innerHTML=`

<span>${task.text}</span>

<div class="task-actions">

<button
class="complete-btn"
onclick="toggleTask(${index})">

✓

</button>

<button
class="delete-btn"
onclick="deleteTask(${index})">

✕

</button>

</div>

`;

taskList.appendChild(li);

});

updateStats();

saveTasks();

}

addTaskBtn.addEventListener(
"click",
()=>{

if(taskInput.value.trim()==="")
return;

tasks.push({

text:taskInput.value,
completed:false

});

taskInput.value="";

renderTasks();

});

function toggleTask(index){

tasks[index].completed=
!tasks[index].completed;

renderTasks();

}

function deleteTask(index){

tasks.splice(index,1);

renderTasks();

}

window.toggleTask=
toggleTask;

window.deleteTask=
deleteTask;

document
.getElementById("logoutBtn")
.addEventListener(
"click",
()=>{

localStorage.removeItem(
"loggedIn"
);

window.location.href=
"index.html";

});

renderTasks();