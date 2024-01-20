export const deleteNodeById = async (id) => {
    const res = await fetch(`${config.API_URL}/api/delete/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    })

    return res.json()
}