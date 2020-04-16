import React from 'react'
import projectState from "../state/projectState"
import {irrelonNextState} from "../nextstate";
import Test from "../components/Test";
const {setLogLevel} = require("../nextstate");
setLogLevel("ProvideState=*,State=*,Store=*,useState=*,irrelonNextState=*");

const Home = (props) => {
    const {project, patchProject} = props;
    
    return (
        <div className="body">
            Home Page has state {JSON.stringify(project)}
            <Test />
            <button onClick={() => {
                patchProject({
                    name:"Next Thing"
                });
            }}>Update</button>
            <style jsx>{`
                .body {
                    flex-direction: column;
                    display: flex;
                    flex: 1;
                    width: 100vw;
                    height: 100vh;
                    background-color: #555;
                    color: #fff;
                }
            `}</style>
        </div>
    );
};

Home.getInitialProps = ({patchProject}) => {
    const cookieVal = "My Cookie Project";
    
    patchProject({
        name: cookieVal
    });
    
    return {
        someNextJsProp: "foo",
        cookieVal
    };
};

export default irrelonNextState({
    "project": projectState.read,
    "patchProject": projectState.patch
}, Home);
