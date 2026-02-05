import React from 'react'

function Footer() {
    return (

        <footer className="bg-white border-t py-3 h-10 bottom-0 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Mini Support Desk
        </footer>
    )
}

export default Footer