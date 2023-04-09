import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./components/UserCard";
import appStyles from './App.module.scss'

type User = {
    name: {
        first: string;
        last: string;
    };
    email: string;
    picture: {
        thumbnail: string;
    };
    phone: string;
};

type Response = {
    results: User[];
    info: {
        page: number;
        pages: number;
    };
};

const App: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [page, setPage] = useState<{ current: number }>({ current: 1 });
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = (): void => {
        if (!hasMore || loading) return;

        setLoading(true);

        axios
            .get<Response>(
                `https://randomuser.me/api/?page=${page.current}&results=16`
            )
            .then((response) => {
                const newResults = response.data.results;

                setData((prevData) => [...prevData, ...newResults]);
                setHasMore(response.data.info.page < response.data.info.pages);
                setPage((prevPage) => ({ current: prevPage.current + 1 }));
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const handleScroll = () => {
        const windowHeight =
            "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        const windowBottom = windowHeight + window.pageYOffset;

        if (windowBottom >= docHeight && !loading) {
            loadData();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={appStyles.container} onScroll={handleScroll}>
            <ul>
                {data.map((user) => (
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
        </div>
    );
};

export default App;
