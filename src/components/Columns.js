/**
 * Column definition for table
 */
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import methods from '../data/methods';
import licenses from '../data/licenses';

function getColumns(data, year) {
    /**
     * Prepare columns.
     * 
     * Since 'customBodyRenderLite' function requires us to fetch the data ourselves, this getColumns function
     * relies on data to already be present (which is rather bad design).
     */
    let columns = [
        {
            "name": "name",
            "label": "Code",
            "options": {
                "filter": false, "sort": true,
                // add homepage link to code
                "customBodyRenderLite": (dataIndex) => {
                    const row = data[dataIndex];
                    return <a href={row['homepage']} target='_blank' rel="noreferrer">{row['name']}</a>;
                }
            }
        },
        {
            "name": "author_name",
            "label": "Authors",
            "options": { "filter": false, "sort": true }
        },
        {
            "name": "description",
            "label": "Notes",
            "options": { "filter": false, "sort": true }
        },
        {
            "name": "license",
            "label": "License",
            "options": {
                "filter": true,
                "sort": true,
                "customBodyRenderLite": (dataIndex) => {
                    const x = data[dataIndex]['license'];
                    return  <Tooltip title={licenses[x]} placement="top-end" key={x}><Button>{x}</Button></Tooltip>;
                }
            }
        },

        {
            "name": "types",
            "label": "Methods",
            "options": {
                "filter": true,
                "sort": true,
                "customBodyRenderLite": (dataIndex) => {
                    const types = data[dataIndex]['types'];
                    return types.map(x => <Tooltip title={methods[x]} placement="top-end" key={x}><Button>{x}</Button></Tooltip>);
                }
            }
        },
        {
            "name": "citations",
            "label": "Citations",
            "options": {
                "filter": false,
                "sort": true,
                // add google scholar link to number of citations
                "customBodyRenderLite": (dataIndex) => {
                    const row = data[dataIndex];
                    const searchUrl = 'https://scholar.google.com/scholar?q=' + encodeURIComponent(row['query_string'])
                        + '&hl=en&as_sdt=0%2C5&as_ylo=' + year + '&as_yhi=' + year;
                    return <a href={searchUrl} target='_blank' rel="noreferrer">{row['citations']}</a>;
                }
            }
        }
    ]

    return columns;
}

export { getColumns }