document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector(".input-task");
    const addTaskBtn = document.querySelector("#add-task-btn");
    const taskList = document.querySelector(".task-list");
    const emptyImage = document.querySelector(".emptyImg")
    const progressBar = document.querySelector("#progress");
    const progressNumber = document.querySelector("#numbers");

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    }

    const updateProgress = (checkCompletion = true) => {
        const totalTask = taskList.children.length;
        const completedTask = taskList.querySelectorAll(".checkbox:checked").length;

        progressBar.style.width = totalTask ? `${(completedTask / totalTask) * 100}%` : '0%';
        progressNumber.textContent = `${completedTask} / ${totalTask}`;

        if(checkCompletion && totalTask > 0 && completedTask === totalTask){
            Confetti();
        }

    };

    const saveTaskToLocalStorage = () => {

        const task = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(task));
    };

    const loadTaskFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({text, completed }) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgress();
        };
    

    const addTask = ( text, completed = false, checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        
        if(!taskText){
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ""} />
        <span>${taskText}</span>
        <div class="task-button">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>`;

        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if(completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointEvents = "none";
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? "0.5" : "1";
            editBtn.style.pointEvents = isChecked ? "none" : "auto";
            updateProgress();
            saveTaskToLocalStorage();
        });


        editBtn.addEventListener("click", () => {
            if(!checkbox.checked){
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState()
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        })

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        })
        
        
        taskList.appendChild(li);
        taskInput.value = "";
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    };

    addTaskBtn.addEventListener("click", (event) => {
        event.preventDefault();
        addTask();
    })
    taskInput.addEventListener("keypress", (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();    
            addTask();
        }
    });

    loadTaskFromLocalStorage();
})

const Confetti = () => {

    const duration = 15 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
  
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
  
    const particleCount = 50 * (timeLeft / duration);
  
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}