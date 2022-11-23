function retrievePosts(userId) {
    if(typeof userId !== 'string') throw new TypeError('invalid userId')
    if(!userId.length) throw new Error('userId is empty')

    return fetch('http://localhost:80/posts/retrieve', {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${userId}`,
            'Content-Type': 'application/json' 
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed on fetching authentication')
            }

            return res.json()
        })
        .then(posts => {
            return posts
        })
}

export default retrievePosts