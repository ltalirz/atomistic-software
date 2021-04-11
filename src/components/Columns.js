/**
 * Column definition for table
 */
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import methods from '../data/methods';
import tags from '../data/abbreviations';
import licenses from '../data/licenses';
//idea: use search icon for link to google scholar
import ShowChartIcon from '@material-ui/icons/ShowChart';

import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SchoolIcon from '@material-ui/icons/School';
import LockOpenIcon from '@material-ui/icons/LockOpen';

//import NotInterestedIcon from '@material-ui/icons/NotInterested';
import ContactMailIcon from '@material-ui/icons/ContactMail';
//import CopyrightIcon from '@material-ui/icons/Copyright';
import LockIcon from '@material-ui/icons/Lock';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';

function TooltipText(tooltip, text) {
    /** 
     * Tooltip with nicely spaced text that doesn't become a cursor.
     */
    return <Tooltip title={tooltip} placement="top-end" key={text}><span style={{ 'cursor': 'default', 'marginRight': '0.5em' }}>{text}</span></Tooltip>;
    //return <Tooltip title={tooltip} placement="top-end" key={text} clickable={true}><span><Button disabled >{text}</Button></span></Tooltip>;
    //return <Tooltip title={tooltip} placement="top-end" key={text} clickable={true}><span><Paper  >{text}</Paper></span></Tooltip>;
}

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
            "options": { "filter": false, "sort": true, 'selected': false, "display": false}
        },
        {
            "name": "notes",
            "label": "Notes",
            "options": { "filter": false, "sort": true, 'selected': false, "display": false}
        },
        {
            "name": "types",
            "label": "Methods",
            "options": {
                "filter": true,
                "sort": true,
                "customBodyRenderLite": (dataIndex) => {
                    const types = data[dataIndex]['types'];
                    return types.map(x => TooltipText(methods[x], x));
                }
            }
        },

        {
            "name": "tags",
            "label": "Tags",
            "options": { "filter": true, "sort": true,
            "customBodyRenderLite": (dataIndex) => {
                const types = data[dataIndex]['tags'];
                return types.map(x => TooltipText(tags[x], x));
            }
        }
        },
        {
            "name": "license",
            "label": "Cost",
            "options": {
                "filter": true,
                "sort": true,
                "customBodyRenderLite": (dataIndex) => {
                    const x = data[dataIndex]['license'];
                    if (['C(S)', 'C(C)'].includes(x)) {
                        return TooltipText(licenses[x], [<AttachMoneyIcon />]);
                    } else if (['F(A)'].includes(x)) {
                        return TooltipText(licenses[x], [<span><MoneyOffIcon /><SchoolIcon /></span>]);
                    } else if (['I'].includes(x)) {
                        return TooltipText(licenses[x], [<ContactMailIcon />]);
                    } else {
                        return TooltipText(licenses[x], [<MoneyOffIcon />]);
                    }
                    //return TooltipText(licenses[x], x);  import ContactMailIcon from '@material-ui/icons/ContactMail';
                }
            }
        },
        {
            "name": "license",
            "label": "Source",
            "options": {
                "filter": false,
                "sort": true,
                "customBodyRenderLite": (dataIndex) => {
                    const x = data[dataIndex]['license'];
                    if (['C(S)', 'F(A)'].includes(x)) {
                        return TooltipText(licenses[x], [<LockOpenIcon color={'action'} />]);
                    } else if (['C(C)'].includes(x)) {
                        return TooltipText(licenses[x], [<LockIcon color={'action'} />]);        
                    } else if (['OS(P)', 'OS(CL)'].includes(x)) {
                        return TooltipText(licenses[x], [<NoEncryptionIcon color={'action'} />]);
                    } else if (['F'].includes(x)) {
                        return TooltipText(licenses[x], [<span><NoEncryptionIcon color={'action'} /></span>]);
                    } else {
                        return TooltipText(licenses[x], x);
                    }
                }
            }
        },
        {
            "name": "license_annotation",
            "label": "License Note",
            "options": { "filter": false, "sort": true, 'selected': false, "display": false}
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
                    let searchUrl = '';

                    if (row['query_method'] === 'publication') {
                        searchUrl = 'https://scholar.google.com/scholar?cites=' + row['query_publication_id'].toString();
                    } else {
                        searchUrl = 'https://scholar.google.com/scholar?q=' + encodeURIComponent(row['query_string']);
                    }
                    searchUrl += '&hl=en&as_sdt=0%2C5&as_ylo=' + year + '&as_yhi=' + year;
                    return (<a href={searchUrl} target='_blank' rel="noreferrer">{row['citations']}</a>);
                }
            }
        },
        {
            "name": "trend",
            "label": "Trend",
            "options": {
                "filter": false,
                "sort": true,
                // add google scholar link to number of citations
                "customBodyRenderLite": (dataIndex) => {
                    const row = data[dataIndex];
                    return <Button href={'#/charts/' + encodeURIComponent(row['name'])} color="secondary" ><ShowChartIcon /> </Button>;
                }
            }
        }
    ]

    return columns;
}

export { getColumns }