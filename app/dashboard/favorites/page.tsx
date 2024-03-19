import AllFiles from '@/app/_components/AllFiles'
import React from 'react'

function Favorites() {
    return (
        <>
            <AllFiles title="Your Favorites" isFavorite={true} />
        </>
    )
}

export default Favorites
