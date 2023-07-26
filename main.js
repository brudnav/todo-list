
const filterBox = document.querySelector(".filter-box")
const filterBtn = document.querySelector(".filter-btn")
const submitBtn = document.querySelector(".submit-btn")
const searchBar = document.querySelector(".search-bar")
const menuOverlay = document.querySelector(".menu-overlay")
const menu = document.querySelector(".menu")
const menuItems = document.querySelectorAll(".menu-item")
const filterCheckboxes = document.querySelectorAll(".filter-item-check")

let inputValue;
let todos;
let dataId;
let activeCheckeboxes = [
  {
    name: "Home",
    active: true
  },
  {
    name: "School",
    active: true
  },
  {
    name: "Undefined",
    active: true
  }
]


window.addEventListener("DOMContentLoaded", windowHandler)
filterBtn.addEventListener("click",toggleMenu)
searchBar.addEventListener("input", searchBarHandler)
submitBtn.addEventListener("click", submitBtnHandler)
menuOverlay.addEventListener("click", ()=>{
  menuOverlay.classList.remove("active")
})
menu.addEventListener("click",(e)=>{
  e.stopPropagation()
})

filterCheckboxes.forEach((checkbox)=>{
  checkbox.addEventListener("change",()=>{
    checkFilter()
    
    let homeCheck = activeCheckeboxes[0].active
    let schoolCheck = activeCheckeboxes[1].active
    let undefinedCheck = activeCheckeboxes[2].active

    let currentTodos = todos.filter((todo)=>{
      switch(todo.category){
        case "Home":
          return homeCheck
        case "School":
          return schoolCheck
        case "Undefined": 
          return undefinedCheck
      }

     })

      document.querySelector(".todos").innerHTML = ""
      appendTodos(currentTodos)

  })
})



function searchBarHandler(e){
  inputValue = e.target.value;
}

function windowHandler(){
  let todos = localGetTodos()
  appendTodos(todos)

}

function submitBtnHandler(e){
  e.preventDefault()
  let todo = localCreateTodo(inputValue)
  createTodo(todo)
  localSaveTodo(todo)
  
  searchBar.value = ""
  categoryCounter()
}

function toggleMenu(){
  filterBox.classList.toggle("active")
}


function createTodo(todoObj){

const todo = document.createElement("div");
todo.setAttribute("data-id",todoObj.id)
todo.classList.add("todo")
if(todoObj.category === "Home"){
  todo.classList.add("home")
}
if(todoObj.category === "School"){
  todo.classList.add("school")
}



if(todoObj.completed){
  todo.classList.add("checked")
}

const todoInfo = document.createElement("div");
todoInfo.classList.add("todo-info")
const title_h2 = document.createElement("h2");
title_h2.classList.add("todo-title")
title_h2.textContent = todoObj.title
title_h2.contentEditable = true

title_h2.addEventListener("input",function(e){
  let title = e.target.textContent;
  const todo = this.parentElement.parentElement
  console.log("change")
  localChangeTitle(todo,title);
})


const category_h4 = document.createElement("h4");
category_h4.classList.add("todo-category")

category_h4.addEventListener("click", function(){
  menuOverlay.classList.add("active")
  let title = category_h4.textContent
  dataId = this.parentElement.parentElement.getAttribute("data-id")
  let checkboxes = menuOverlay.querySelectorAll("input")
  

  checkboxes.forEach((checkbox)=>{
    checkbox.checked = false
    todo.classList.remove("home")
    todo.classList.remove("school")

    checkbox.addEventListener("change",function(e){
      let name = this.name;
      let todoObjs = localGetTodos()
        todoObjs.forEach((obj)=>{
          if(obj.id == dataId){
            category_h4.textContent = name
            if(name === "Home"){
              todo.classList.add("home")
            }
            if(name === "School"){
              todo.classList.add("school")
            }
            localChangeCategory(dataId,name)
            categoryCounter()
          }
        })
        

      menuOverlay.classList.remove("active")
    
    })
  })

  menuItems.forEach((item)=>{

    if(item.querySelector("h4").textContent == title){
      let input = item.querySelector("input")
      input.checked = true
    }
  })
})

category_h4.textContent = todoObj.category
todoInfo.appendChild(title_h2);
todoInfo.appendChild(category_h4);

const todoControls = document.createElement("div");
todoControls.classList.add("todo-controls")

const checkBtn = document.createElement("div");
checkBtn.classList.add("check-btn")
checkBtn.innerHTML = `<i class='bx-md bx bxs-check-square'></i>`

checkBtn.addEventListener("click", function(){

  let id = todoObj.id;
  this.parentElement.parentElement.classList.toggle("checked")

  localCheck(id)
})


const trashBtn = document.createElement("div");
trashBtn.classList.add("trash-btn")
trashBtn.innerHTML = `<i class='bx-md bx bxs-trash'></i>`
trashBtn.addEventListener("click", function(){

  let id = todoObj.id;
  this.parentElement.parentElement.remove()

  localDeleteTodo(id)
  categoryCounter()
})
todoControls.appendChild(checkBtn);
todoControls.appendChild(trashBtn);

todo.appendChild(todoInfo);
todo.appendChild(todoControls);

const todos = document.querySelector(".todos")
todos.appendChild(todo)
}

function appendTodos(todosData){

  todosData.forEach((todo)=>{
    
    createTodo(todo)

  })
}




function localGetTodos(){

  if(localStorage.getItem("todos") === null){
    todos = [];
  }else{
    todos = JSON.parse(localStorage.getItem("todos"))
  }

  return todos
}

function localCreateTodo(title = "New note",category = "Undefined"){

  const todos = localGetTodos()

  const todo = {
    id: todos.length,
    title,
    category,
    completed: false
  }

  return todo;
}

function localSaveTodo(todo){
  if(localStorage.getItem("todos") === null){
    todos = [];
  }else{
    todos = JSON.parse(localStorage.getItem("todos"))
  }

  todos.push(todo)
  localStorage.setItem("todos", JSON.stringify(todos))

}

function localDeleteTodo(id){
   const todos = localGetTodos();

   todos.forEach((todo)=>{
    if(todo.id === id){
        let index = todos.indexOf(todo)
        todos.splice(index,1)
        localStorage.setItem("todos", JSON.stringify(todos))
    }
   })
}

function localChangeCategory(id,category){
  const todos = localGetTodos();
  todos.forEach((todo)=>{
    if(todo.id == id){
        let index = todos.indexOf(todo)
        todos[index].category = category
        localStorage.setItem("todos", JSON.stringify(todos))
    }
   })
}

function categoryCounter(){
  let homeLength = 0;
  let schoolLength = 0;
  let undefinedLength = 0;

  let filterItems = document.querySelectorAll(".filter-item")
  let todos = localGetTodos()

  todos.forEach((todo)=>{
    if(todo.category === "Home"){
      homeLength++;
    }
    if(todo.category === "School"){
      schoolLength++;
    }
    if(todo.category === "Undefined"){
      undefinedLength++;
    }
  })
  filterItems[0].children[1].children[1].textContent = homeLength;
  filterItems[1].children[1].children[1].textContent = schoolLength
  filterItems[2].children[1].children[1].textContent = undefinedLength
  
}

function localChangeTitle(todo,title){
  const todos = localGetTodos();
  console.log(title)
  const id = todo.getAttribute("data-id")

  todos.forEach((todo)=>{
    if(todo.id == id){
        let index = todos.indexOf(todo)
        todos[index].title = title
        localStorage.setItem("todos", JSON.stringify(todos))
    }
   })
}

function localCheck(id){
  const todos = localGetTodos();

   todos.forEach((todo)=>{
    if(todo.id === id){
        if(todo.completed){
          todo.completed = false
        }else{
          todo.completed = true
        }
        localStorage.setItem("todos", JSON.stringify(todos))
    }
   })
}

function checkFilter(){
  filterCheckboxes.forEach((checkbox,index)=>{
    activeCheckeboxes[index].active = checkbox.checked
  })

}



categoryCounter()