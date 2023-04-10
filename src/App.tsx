import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import UserCard from './components/UserCard'
import appStyles from './App.module.scss'

/**
 Represents a user object.
 @typedef {Object} User
 @property {Object} name - User's name. /
 @property {string} name.first - User's first name.
 @property {string} name.last - User's last name.
 @property {string} email - User's email.
 @property {Object} picture - User's profile picture.
 @property {string} picture.thumbnail - User's thumbnail picture URL.
 @property {string} phone - User's phone number.
 */
interface User {
    name: {
        first: string
        last: string
    }
    email: string
    picture: {
        thumbnail: string
    }
    phone: string
}

/**

 Represents a response object.
 @typedef {Object} Response
 @property {User[]} results - Array of users.
 @property {Object} info - Pagination info.
 @property {number} info.page - Current page number.
 @property {number} info.pages - Total number of pages.
 */

interface Response {
    results: User[]
    info: {
        page: number
        pages: number
    }
}

/**
 The main component of the application.

 @component
 */
const App: React.FC = () => {
    /**
     Represents the current state of data.
     @type {[User[], function]}
     */
    const [data, setData] = useState<User[]>([])
    /**
     Represents the current page state.
     @type {[{ current: number }, function]}
     */
    const [page, setPage] = useState<{ current: number }>({ current: 1 })
    /**
     Represents the current loading state.
     @type {[boolean, function]}
     */
    const [loading, setLoading] = useState<boolean>(false)
    /**
     Represents the current state of whether there is more data to load.
     @type {[boolean, function]}
     */
    const [hasMore, setHasMore] = useState<boolean>(true)
    /**
     Represents the length of previous data loaded.
     @type {[number, function]}
     */
    const [prevDataLength, setPrevDataLength] = useState<number>(0)
    /**
     Represents the current loading data state.
     @type {[boolean, function]}
     */
    const [loadingData, setLoadingData] = useState<boolean>(true)
    /**
     This useEffect hook is used to load data when the component mounts
     @function
     @returns {void}
     */

    useEffect(() => {
        void loadData()
    })

    /**
     Loads data from the API.
     @async
     @function
     @returns {Promise<void>}
     */

    const loadData = useCallback(async (): Promise<void> => {
        if (!hasMore || loading) return

        setLoading(true)

        await axios
            .get<Response>(`https://randomuser.me/api/?page=${page.current}&results=16`)
            .then(({ data }) => {
                const newResults = data.results

                setData((prevData) => [...prevData, ...newResults])
                setPrevDataLength(newResults.length)
                setHasMore(data.info.page < data.info.pages)
                setPage((prevPage) => ({ current: prevPage.current + 1 }))
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
    }, [hasMore, loading, page])
    /**
     Handles scrolling of the page and loads more data when the user scrolls to the bottom of the page.
     @function
     @returns {void}
     */
    const handleScroll = useCallback(() => {
        const windowHeight =
            'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
        const body = document.body
        const html = document.documentElement
        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        )
        const windowBottom = windowHeight + window.pageYOffset

        if (windowBottom >= docHeight && !loading) {
            void loadData()
        }
    }, [loadData, loading])
    /**
     Adds an event listener to the window for scroll events and removes it when component is unmounted
     @param {Function} handleScroll - The callback function to be called when the window is scrolled
     @returns {void}
     */

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    })
    /**
     Loads data from a server and sets loading state to false
     @returns {void}
     */
    useEffect(() => {
        void loadData().then(() => {
            setLoadingData(false)
        })
        setLoading(false)
    }, [loadData])

    return useMemo(() => (
        <div className={appStyles.container} onScroll={handleScroll}>
            {loadingData
                ? (
                    <p>Loading...</p>
                )
                : data.length > 0
                    ? (
                        <ul>
                            {data.slice(prevDataLength).map((user) => (
                                <li key={user.email}>
                                    <UserCard
                                        name={`${user.name.first} ${user.name.last}`}
                                        phone={user.phone}
                                        email={user.email}
                                        picture={user.picture.thumbnail}
                                    />
                                </li>
                            ))}
                        </ul>
                    )
                    : (
                        <p>No users found</p>
                    )}
        </div>
    ), [loadingData, data, prevDataLength, handleScroll])
}

export default App
