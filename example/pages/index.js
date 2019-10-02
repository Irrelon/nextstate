import React from 'react'
import Home from '../components/Home'
import {getStore, ProvideState} from "irrelon-nextstate";

const AppIndex = (props) => {
    const stateStore = getStore(props._storeData);
    
    return (
        <ProvideState stateStore={stateStore}>
          <Home />
        </ProvideState>
    );
};

AppIndex.getInitialProps = () => {
    const stateStore = getStore({
        data: {
            test1: {
                val1: {
                    val1: "Hello1",
                    val2: "Hello1"
                },
                val2: {
                    val1: "Hello1",
                    val2: "Hello1"
                }
            },
            test2: {
                val1: {
                    val1: "Hello2",
                    val2: "Hello2"
                },
                val2: {
                    val1: "Hello1",
                    val2: "Hello1"
                }
            }
        }
    });
    
    return {
        _storeData: stateStore.exportData()
    };
};

export default AppIndex;
