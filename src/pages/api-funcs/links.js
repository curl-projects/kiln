export async function createLink(newLink){
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_DOMAIN}/create-link`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newLink)
    })

    if(!response.ok){
        throw new Error('Network response was not ok')
    }
    
    return response.json();
}
