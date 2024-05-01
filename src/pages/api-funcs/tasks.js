export async function createTask(newTask){
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_DOMAIN}/create-task`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    })

    if(!response.ok){
        throw new Error('Network response was not ok')
    }
    
    return response.json();
}

export async function updateTask(taskData){
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_DOMAIN}/update-task`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    })

    if(!response.ok){
        throw new Error('Network response was not ok')
    }
    
    return response.json();
}