const taskInput = document.querySelector('.task-input input'),
taskBox = document.querySelector('.task-box'),
filters = document.querySelectorAll('.filters span');
cleareAll = document.querySelector('.clear-btn')
// getting localstore todo list

let todos = JSON.parse(localStorage.getItem('todos-list'));
console.log(todos)
let editId;
let isEditedTask = false;

filters.forEach(btn => {
    btn.addEventListener("click", ()=>{
        // console.log(btn)
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active")
        showTodo(btn.id)
    })
})

function showTodo(filter){
    let li = '';
    if(todos){
        todos.forEach((todo, id) => {
            // console.log(todo, id)
            // if status is completed set isCompleted value to checked
           let isCompleted = todo.status == "completed" ? "checked" : "";
           if(filter == todo.status || filter == "all"){
                li+=`<li class="task">
                        <label for="${id}">
                            <input onClick='updateStatus(this)' type="checkbox" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onClick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onClick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onClick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`
           }
           
        });
    }
    //if li isn't empty, insert this value inside taskbox else insert span
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
showTodo("all")

function editTask(taskId,taskName){
    // console.log(taskId, taskName);
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;

}

function showMenu(selectedTask){
    // console.log(selectedTask)
     // geting task menu div
     let taskMenu = selectedTask.parentElement.lastElementChild;
     taskMenu.classList.add("show"); 
     // removing show class
     document.addEventListener('click', e=>{
        if(e.target.tagName != 'I' || e.target != selectedTask){
            taskMenu.classList.remove("show"); 
        }
     })
}
function deleteTask(deleteId){
    // console.log(deleteId)
    //removing selected task from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem('todos-list', JSON.stringify(todos))
    showTodo("all")
}
cleareAll.addEventListener("click", ()=>{
    //removing all from array/todos
    todos.splice(0, todos.length);
    localStorage.setItem('todos-list', JSON.stringify(todos))
    showTodo("all")
})

function updateStatus(selectedTask){
    // console.log(selectedStatus)
    // getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild; 
    if(selectedTask.checked){
        taskName.classList.add('checked');
        // update the status of selected to completed 
        todos[selectedTask.id].status = 'completed';
    }else{
        taskName.classList.remove('checked');
        // update the status of selected to pending 
        todos[selectedTask.id].status = 'pending';
    }
    localStorage.setItem('todos-list', JSON.stringify(todos))
}
// first part
taskInput.addEventListener('keyup', e =>{
    let userTask = taskInput.value.trim();
    if(e.key == 'Enter' && userTask){
        console.log(userTask)
        if(!isEditedTask){ // if isnt true
            if(!todos){ // if todos is`nt exist, pass an empty array to todos
                todos=[]
            }
            let taskInfo = {name: userTask, status:'pending'};
            todos.push(taskInfo);
        }else{
            isEditedTask = false;
            todos[editId].name = userTask;
        }
       taskInput.value = '';
       localStorage.setItem('todos-list', JSON.stringify(todos))
       showTodo("all")
    }
})