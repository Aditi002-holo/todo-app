const displayTaskEl = document.querySelector('.display-section')
const taskInput = document.getElementById('task-input')
const addBtn = document.getElementById('add-btn')
const errMsg = document.getElementById('err-message')

// User Input
addBtn.addEventListener('click', function() {
    let userInput = taskInput.value 
    if(!userInput) {
        errMsg.style.visibility = 'visible'
        errMsg.textContent = `Enter a task`

        setTimeout(function() {
            document.getElementById('err-message').style.visibility = 'hidden'
        }, 2500)
    } else {
        fetch('http://localhost:81/api/todos', {
            method: "POST",
            body: JSON.stringify({
                taskName: userInput,
                completed: false
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error(`HTTP error! Status: ${response.status}`)
            })
            .then(data => {
                let count = data.last_inserted_id
                displayTaskEl.innerHTML += `
                <div class="task-section" id="task-section-${count}">
                    <input 
                        type="checkbox" 
                        class="checkbox-input" 
                        id="checkbox-${count}"
                        onclick ="toggleTask(${count}, this.checked)"
                    />
                    <span class="task-name" id="task-${count}">${userInput}</span>
                    <button class="del-btn" id="del-${count}" onclick="deleteTask(${count})">DEL</button>
                </div>` 
            })
            .catch(error => console.error('Error:', error))
    }

    taskInput.value = ''
})


taskInput.addEventListener('keypress', (e) => {
    if(e.key === "Enter") {
        e.preventDefault()
        addBtn.click()
    }
})

// Get request
function renderTasks() {
    return fetch('http://localhost:81/api/todos')
    .then(response => response.json())
    .then(data => {
        return data.map(eachTask => {
            displayTaskEl.innerHTML += `
                <div class="task-section" id="task-section-${eachTask[0]}">
                    <input 
                        type="checkbox" 
                        class="checkbox-input" 
                        id="checkbox-${eachTask[0]}"
                        ${eachTask[2] ? "checked" : ""}
                        onclick ="toggleTask(${eachTask[0]}, this.checked)"
                    />

                    <span class="task-name ${eachTask[2] ? "task-name-checked" : ""}" id="task-${eachTask[0]}">${eachTask[1]}</span>

                    <button class="del-btn" id="del-${eachTask[0]}" onclick ="deleteTask(${eachTask[0]})">DEL</button>
                </div>`
        })
    })
}


function deleteTask(taskId) {
    fetch(`http://localhost:81/api/todos/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if(response.ok) {
                return response.json()
            }
            throw new Error('Failed to delete task')
        })
        .then(data => {
            let element = document.getElementById(`task-section-${taskId}`)
            displayTaskEl.removeChild(element)
        })
        .catch(error => console.error('Error deleting task:', error));
}


function toggleTask(taskId, completed) {
    if(completed) {
        document.getElementById(`task-${taskId}`).classList.add('task-name-checked')
    } else {
        document.getElementById(`task-${taskId}`).classList.remove('task-name-checked')
    }

    fetch(`http://localhost:81/api/todos/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: completed }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => console.log(data))
}


renderTasks()







































// TODO: add this later
// <img src="{{ url_for('static', filename='/images/cross.svg') }}" class="delete-btn" alt="">