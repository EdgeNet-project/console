import axios from "axios";
import {Select} from "@mantine/core";

const SelectTenant = ({handleTenant}) => {
    const [tenants, setTenants] = useState([]);

    useEffect(() => {
        axios.get('/api/tenants')
            .then(({data}) => {
                setTenants(data.map(d => { return { value: d.name, label: d.fullname } }))
            })
    }, [])

    const handleCreate = (query) => {

    }

    return (
        <>
            <p>
                To run experiments on EdgeNet, you need an account linked to an institution.
                If your institution is not present please create one, EdgeNet administrator will review your application.
            </p>
            <Select
                label="Select your institution or create e new one"
                data={tenants}
                placeholder="EdgeNet institutions"
                nothingFound="Nothing found"
                searchable
                creatable
                clearable
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                    const item = { value: query, label: query };
                    setTenants((current) => [...current, item]);
                    return item;
                }}
                onChange={(value) => console.log('onchange', value)}
            />

        </>
    )
}