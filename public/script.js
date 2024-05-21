// Function to fetch to-do items from the server
async function fetchTodos() {
    const response = await fetch("/items");
    if (response.ok) {
        const items = await response.json();
        const todoItemsContainer = document.getElementById("todoItems");
        const completedItemsContainer = document.getElementById("completedItems");
        const tomorrowsItemsContainer = document.getElementById("tomorrowsItems"); // Get the container for tomorrow's tasks

        // Clear existing items in all containers
        todoItemsContainer.innerHTML = "";
        completedItemsContainer.innerHTML = "";
        tomorrowsItemsContainer.innerHTML = ""; // Clear the container for tomorrow's tasks as well

        // Sort items into todo, completed, and tomorrow's lists
        items.forEach((item) => {
            // Create a new list item
            const itemElement = document.createElement("li");
            itemElement.setAttribute("data-id", item.ID);
            itemElement.setAttribute("data-description", item.DESCRIPTION);
            itemElement.setAttribute("data-status", item.STATUS);

            // Populate the list item with delete and edit buttons, and text span
            const deleteButton = createDeleteButton(item.ID);
            const editButton = createEditButton(item.ID);
            const textSpan = document.createElement("span");
            textSpan.textContent = item.DESCRIPTION;
            const iconContainer = document.createElement("div");
            iconContainer.classList.add("icon-container");
            iconContainer.appendChild(deleteButton);
            iconContainer.appendChild(editButton);

            if (item.STATUS === 'Completed') {
                textSpan.classList.add('completed-text');
            }

            // Append the container to the list item
            itemElement.appendChild(textSpan);
            itemElement.appendChild(iconContainer);

            // Append to the appropriate container based on the status
            if (item.STATUS === 'Pending') {
                todoItemsContainer.appendChild(itemElement);
            } else if (item.STATUS === 'Completed') {
                completedItemsContainer.appendChild(itemElement);
            } else if (item.STATUS === 'Tomorrow') {
                tomorrowsItemsContainer.appendChild(itemElement);
            }
        });
    } else {
        alert("Failed to fetch to-do items.");
    }
}

// Function to create a delete button with a trash icon
function createDeleteButton(id) {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#128465;"; // Unicode for trash can icon
    deleteButton.classList.add("icon-button"); // Add class for styling
    deleteButton.onclick = function () {
        deleteTodo(id);
    };
    return deleteButton;
}

// Function to create an edit button with a pencil icon
function createEditButton(id) {
    const editButton = document.createElement("button");
    editButton.innerHTML = "&#9998;"; // Unicode for pencil icon
    editButton.classList.add("icon-button"); // Add class for styling
    editButton.onclick = function () {
        showEditModal(id);
    };
    return editButton;
}


// Function to show the ADD NEW TO-DO MODAL
function showAddModal() {
    document.getElementById('addDescription').value = ''; // Clear previous input value
    document.getElementById('addStatus').value = 'Pending'; // Set the status to 'Pending' for today's tasks
    const modal = document.getElementById('addTodoModal');
    modal.style.display = 'block'; // Display the modal
}
document.getElementById('addTodoBtn').addEventListener('click', showAddModal);

// Function to show the ADD NEW TO-DO MODAL with the "Tomorrow" status
function showAddModalForTomorrow() {
    document.getElementById('addDescription').value = ''; // Clear previous input value
    const modal = document.getElementById('addTodoModal');
    modal.style.display = 'block'; // Display the modal
    document.getElementById('addStatus').value = 'Tomorrow'; // Set the status to 'Tomorrow'
}
// Function to close the add new todo modal
function closeAddModal() {
    const modal = document.getElementById('addTodoModal');
    modal.style.display = 'none';
}
// Event listener for the add new todo form submission
document.getElementById('addForm').addEventListener('submit', function(event) {
    event.preventDefault();
    submitData(); // Call submitData without parameters
    closeAddModal(); // Close the modal after submitting
});

// Function to delete a to-do item
async function deleteTodo(id) {
    const response = await fetch(`/item/${id}`, {
        method: "DELETE",
    });
    if (response.ok) {
        fetchTodos(); // Refresh the list
    } else {
        alert("Failed to delete item.");
    }
}
// Function to display the EDIT TO-DO ITEM modal
function showEditModal(id) {
    // Get the todo details by id, assumed to be stored in your items or retrieved from DOM
    const todo = document.querySelector(`li[data-id="${id}"]`);
    const description = todo ? todo.getAttribute('data-description') : '';
    const status = todo ? todo.getAttribute('data-status') : '';

    // Set the current todo details in the modal's form fields
    document.getElementById('editDescription').value = description;
    document.getElementById('editStatus').value = status;

    // Show the modal
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';

    // Set the form's onsubmit event
    const form = document.getElementById('editForm');
    form.onsubmit = function (event) {
        event.preventDefault();
        submitEdit(id);
    };
}
// Event listener for ADD TO-DO modal button
document.getElementById('addTomorrowsTaskBtn').addEventListener('click', showAddModalForTomorrow);

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

// Function to handle the form submission for editing a todo
function submitEdit(id) {
    const description = document.getElementById('editDescription').value;
    const status = document.getElementById('editStatus').value;

    // Prepare the request body
    const requestBody = {
        id: id,
        description: description,
        status: status,
    };

    // Send the PUT request to the server
    fetch(`/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
        closeModal(); // Close the modal
        fetchTodos(); // Refresh the list to show the updated item
        alert("Item updated successfully.");
    })
    .catch((error) => {
        console.error("Error updating item:", error);
        alert("Failed to update item.");
    });
}


// Function to submit new to-do item
async function submitData() {
    // Retrieve the description and status from the modal inputs
    const description = document.getElementById('addDescription').value;
    const status = document.getElementById('addStatus').value; // Retrieve the status from the hidden input

    const requestBody = { description, status };
    
    const response = await fetch("/insert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });
    
    if (response.ok) {
        fetchTodos(); // Refresh the list
        closeAddModal(); // Close the modal after successful insertion
        alert("Data inserted successfully");
    } else {
        alert("Failed to insert data");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        // Add other options as needed
    });
    calendar.render();
});

// Fetch and display todos when the page loads
window.onload = fetchTodos;


