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
            const itemElement = document.createElement("li");
            //itemElement.textContent = `ID: ${item.ID} - Description: ${item.DESCRIPTION}`;
            itemElement.textContent = `${item.DESCRIPTION}`;
            const deleteButton = createDeleteButton(item.ID);
            const editButton = createEditButton(item.ID);

            itemElement.appendChild(deleteButton);
            itemElement.appendChild(editButton);

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

// Function to create a delete button
function createDeleteButton(id) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        deleteTodo(id);
    };
    return deleteButton;
}

// Function to create an edit button
function createEditButton(id) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        editTodo(id);
    };
    return editButton;
}

// Add new todo button
// event listener for add button
document.getElementById('addTodoBtn').addEventListener('click', function() {
    const description = prompt("Enter the description for the new to-do:");
    if (description) { // Check if the description is not empty
        submitData(description, 'Pending'); // 'Pending' is the status for new to-dos
    }
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
// Function to edit a to-do item
function editTodo(id) {
    // Prompt the user for the new description
    const newDescription = prompt("Enter new description:");
    if (!newDescription) {
        alert("Description is required to update a to-do item.");
        return; // Exit if no description was entered
    }

    // Prompt the user for the new status
    const newStatus = prompt("Enter new status (Pending/Completed):");
    if (!newStatus || (newStatus !== "Pending" && newStatus !== "Completed")) {
        alert(
            "Valid status is required to update a to-do item. Please enter 'Pending' or 'Completed'."
        );
        return; // Exit if an invalid status was entered
    }

    // Prepare the request body
    const requestBody = {
        id: id,
        description: newDescription,
        status: newStatus,
    };

    // Send the PUT request to the server
    fetch(`/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (response.ok) {
                fetchTodos(); // Refresh the list to show the updated item
                alert("Item updated successfully.");
            } else {
                alert("Failed to update item.");
            }
        })
        .catch((error) => console.error("Error updating item:", error));
}

// Function to submit new to-do item
async function submitData() {
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;
    const response = await fetch("/insert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, status }),
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


