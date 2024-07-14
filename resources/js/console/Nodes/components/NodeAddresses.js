export default ({addresses}) => {
    if (!addresses) {
        return null;
    }
    return (
        <>
            {addresses.map((address, i) => <div key={'n-address-'+i}>
        <i>{address.type}</i> {address.address}</div>)}
        </>
    );
}