import config from "../config"

export const getNodeId = async (id) => {
    const res = await fetch(`${config.API_URL}/api/notes/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    })

    return res.json()
}