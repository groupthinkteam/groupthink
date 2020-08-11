import React, { useState, useEffect } from "react"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import MenuBar from "../../UI/MenuBar/MenuBar"
import ProjectCard from "../../UI/ProjectCard/ProjectCard"

import "./DashboardPage.scss"

export default function DashboardPage(props) {
    const database = firebase.database();
    const refURL = 'users/' + firebase.auth().currentUser.uid

    let [projectCards, setProjectCards] = useState({});

    function writeToDB(info) {
        database.ref(refURL).push(info);
    }

    function readFromDB() {
        // database.ref(refURL).on('value', (snapshot) => setProjectCards(snapshot.val()));
        database.ref(refURL).once('value')
            .then((snapshot) => {
                setProjectCards(snapshot.val())
            });
    }

    useEffect(() => readFromDB(), [])

    return (
        <div>
            <MenuBar />
            <div className="dashboard-card-container">
                <ProjectCard type="add" />
                {Object.values(projectCards).map((title) => <ProjectCard title={title} />)}
            </div>
        </div>
    )
}