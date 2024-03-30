// Function to fetch to-do items from the server
async function fetchTodos() {
    const response = await fetch("/items");
    if (response.ok) {
        const items = await response.json();
        const todoItemsContainer = document.getElementById("todoItems");
        const completedItemsContainer = document.getElementById("completedItems");

        // Clear existing items
        todoItemsContainer.innerHTML = "";
        completedItemsContainer.innerHTML = "";

        // Sort items into todo and completed lists
        items.forEach((item) => {
            // Create a new list item
            const itemElement = document.createElement("li");
            itemElement.setAttribute("data-id", item.ID);
            itemElement.setAttribute("data-description", item.DESCRIPTION);
            itemElement.setAttribute("data-status", item.STATUS);

            // Populate the list item
            const deleteButton = createDeleteButton(item.ID);
            const editButton = createEditButton(item.ID);

            // Create a span to hold the text
            const textSpan = document.createElement("span");
            textSpan.textContent = item.DESCRIPTION;

            // Create a container for icons
            const iconContainer = document.createElement("div");
            iconContainer.classList.add("icon-container");

            // Append icons to the container
            iconContainer.appendChild(createDeleteButton(item.ID));
            iconContainer.appendChild(createEditButton(item.ID));

            if (item.STATUS === 'Completed') {
                textSpan.classList.add('completed-text'); // Apply class to textSpan for strikethrough
            }

            // Append the container to the list item
            itemElement.appendChild(textSpan);
            itemElement.appendChild(iconContainer);

            // Append to the appropriate container
            if (item.STATUS === 'Pending') {
                todoItemsContainer.appendChild(itemElement);
            } else if (item.STATUS === 'Completed') {
                completedItemsContainer.appendChild(itemElement);
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


// Function to show the add new todo modal
function showAddModal() {
    // Clear previous input value
    document.getElementById('addDescription').value = ''; 
    // Display the modal
    const modal = document.getElementById('addTodoModal');
    modal.style.display = 'block';
}

// Function to close the add new todo modal
function closeAddModal() {
    const modal = document.getElementById('addTodoModal');
    modal.style.display = 'none';
}

// Event listener for the add new todo form submission
document.getElementById('addForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const description = document.getElementById('addDescription').value; // Correct ID for the input field
    submitData(description); // Call submitData with the new description
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
async function submitData(description, status = 'Pending') { // Set 'Pending' as default status
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
        alert("Data inserted successfully");
    } else {
        alert("Failed to insert data");
    }
}

// Fetch and display todos when the page loads
window.onload = fetchTodos;


