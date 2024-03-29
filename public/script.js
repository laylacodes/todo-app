// Function to fetch to-do items from the server
async function fetchTodos() {
    const response = await fetch("/items");
    if (response.ok) {
        const items = await response.json();
        const itemsContainer = document.getElementById("displayContent");
        itemsContainer.innerHTML = ""; // Clear existing items
        items.forEach((item) => {
            const itemElement = document.createElement("li");
            itemElement.textContent = `ID: ${item.ID} - Description: ${item.DESCRIPTION}, Status: ${item.STATUS}`;
            // Add Delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
                deleteTodo(item.ID);
            };
            itemElement.appendChild(deleteButton);
            // Add Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = function () {
                editTodo(item.ID);
            };
            itemElement.appendChild(editButton);
            itemsContainer.appendChild(itemElement);
        });
    } else {
        alert("Failed to fetch to-do items.");
    }
}

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
