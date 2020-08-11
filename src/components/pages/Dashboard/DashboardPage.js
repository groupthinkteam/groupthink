import React, { useState, useEffect } from "react"
import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import MenuBar from "../../UI/MenuBar/MenuBar"
import ProjectCard from "../../UI/ProjectCard/ProjectCard"

import "./DashboardPage.scss"

export default function DashboardPage(props) {
    const database = firebase.database();
    const refURL = 'users/' + firebase.auth().currentUser.uid +'/'

    let [projectCards, setProjectCards] = useState({});
    let pro_key = [];
    function writeToDB(info) {
        database.ref(refURL).push(info);
    }

    function readFromDB() {
        // database.ref(refURL).on('value', (snapshot) => setProjectCards(snapshot.val()));
        database.ref(`${refURL}`).once('value')
            .then((snapshot) => {
                console.log('Snapshot ', snapshot);
                setProjectCards(snapshot.val());
            });
    }

    useEffect(() => readFromDB(), [])

    return (
        <div >
            <MenuBar onLogout={props.onLogout} />
            <div className="dashboard-card-container">
                <ProjectCard type="add" />
                { console.log("interpolated Project CArd \n" , projectCards)}
                {
                  Object.values(projectCards)
                  .map((pro_id) => <ProjectCard title={pro_id} key={pro_id} />)
                }
            </div>
        </div>
    )
}