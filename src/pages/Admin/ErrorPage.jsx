import React from 'react'

function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {/* 404 Text */}
            <h1 className="text-9xl font-bold mb-4 text-[#6EE7B7]">404</h1>
            <p className="text-2xl mb-8 text-gray-300">
                Oops! The page you're looking for doesn't exist.
            </p>

            {/* Music Icon */}
            <div className="mb-8">
                <img
                    src="../../public/lightened_logo.png"
                    alt="Music Logo"
                    className="w-44 h-auto mx-auto sm:w-44 md:w-48 lg:w-56"
                />
            </div>

            {/* Back to Home Button */}
            <a
                href="/"
                className="px-6 py-3 bg-[#6EE7B7] text-gray-900 rounded-lg hover:bg-[#34D399] transition duration-300"
            >
                Back to Home
            </a>
        </div>

    )
}

export default ErrorPage
