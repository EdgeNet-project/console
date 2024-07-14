export default ({capacity}) => <>
    <i>CPUs</i> {capacity.cpu}, <i>RAM</i> {capacity.memory}<br />
    <i>Storage</i> {capacity['ephemeral-storage']}<br />
    <i>PODs</i> {capacity.pods}
</>