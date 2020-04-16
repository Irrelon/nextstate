import React from 'react'
import projectState from "../state/projectState"
import {irrelonNextState} from "../nextstate";
import Test from "../components/Test";
const {setLogLevel} = require("../nextstate");
setLogLevel("ProvideState=*,State=*,Store=*,useState=*,irrelonNextState=*");

const Home = (props) => {
    const {project, updateProject} = props;
    
    return (
        <div>
            Home Page has state {JSON.stringify(project)}
            <Test />
            <button onClick={() => {
                updateProject({
                    name:"Next Thing"
                });
            }}>Update</button>
        </div>
    );
};

Home.getInitialProps = ({updateProject}) => {
    const cookieVal = "My Cookie Project";
    
    updateProject({
        name: cookieVal
    });
    
    return {
        someNextJsProp: "foo",
        cookieVal
    };
};

export default irrelonNextState({
    "project": projectState,
    "updateProject": projectState.update
}, Home);
