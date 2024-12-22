import React from "react";
import { useParams } from "react-router-dom";
import MuiNavbar from "../components/MuiNavbar";
import Sidebar from "../components/MuiSidebar";
import { useEffect, useState } from "react";

const EntryDetail = () => {
    const [data, setData] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:4000/entries/${id}`);
            const data = await response.json();
            setData(data);
        };
        fetchData();
    }, [id]);

    return (
        <div>
            <div>
                <MuiNavbar />
            </div>
            <div className="hero">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="content">
                    <div className="entry-content">
                        <h2>{data.title}</h2>
                        <p>{data.content}</p>
                        <p>
                            <strong>Posted by:</strong> {data.username}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntryDetail;
