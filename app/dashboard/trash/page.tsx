import AllFiles from '@/app/_components/AllFiles'
import React from 'react'

function Trash() {
    return (
        <>
            <AllFiles title="Trash" toBeDeleted={true} />
        </>
    )
}

export default Trash