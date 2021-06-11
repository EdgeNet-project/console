import React, {useState, useEffect} from "react";
import axios from "axios";
import Select from "react-select";

const TenantSelect = ({setTenant}) => {
    const [ tenants, setAuthorities ] = useState([]);

    useEffect(() => {
        axios.get('/apis/core.edgenet.io/v1alpha/tenants')
            .then(({data}) => {
                if (data.items) {
                    data.items.sort(compare)
                    setAuthorities(data.items.map(item => {
                        return {
                            value: item.metadata.name,
                            label: item.spec.fullname + ' (' + item.spec.shortname + ')'
                        }
                    }));
                }
            })
    }, []);

    const compare = ( a, b ) => {
        if ( a.spec.fullname  < b.spec.fullname) {
            return -1;
        }
        if ( a.spec.fullname  > b.spec.fullname) {
            return 1;
        }
        return 0;
    }


    const selectTenant = (selected) => {
        if (selected && selected.value) {
            setTenant(selected.value)
        } else {
            setTenant(null)
        }

    }

    return <Select placeholder="Select your institution"
                   isSearchable={true} isClearable={true}
                   options={tenants}
                   name="tenant"
                   onChange={selectTenant}/>;
}

export default TenantSelect;
