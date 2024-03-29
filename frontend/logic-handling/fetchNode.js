import config from "../config"

export const getNodeTitles = async () => {
    const res = await fetch(`${config.API_URL}/api/notes`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    })

    return res.json()
}