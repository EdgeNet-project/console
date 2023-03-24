import React, {useContext, useState} from "react";

const WorkspaceContext = React.createContext({
    namespace: null
});
const WorkspaceConsumer = WorkspaceContext.Consumer;

const WorkspaceProvider = ({children}) => {
    const [ namespace, setNamespace ] = useState(null)

    return (
        <WorkspaceContext.Provider value={{
            namespace: namespace,
            setNamespace: setNamespace,
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

const useWorkspace = () => {
    const { namespace, setNamespace } = useContext(WorkspaceContext)

    return { namespace, setNamespace }
}
export {
    WorkspaceContext, WorkspaceConsumer, WorkspaceProvider as Workspace, useWorkspace
}