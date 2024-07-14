export default ({nodeInfo}) => <>
    <i>Architecture</i> {nodeInfo.architecture}<br />
    <i>OS</i> {nodeInfo.operatingSystem}&nbsp;{nodeInfo.osImage}<br />
    <i>Version</i> {nodeInfo.kubeletVersion}
</>