import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useStyles from './Dashboard/Styles';
import Title from './Dashboard/Title';
import { YEARS, getData } from './Config';
// import { Card } from '@material-ui/core';

function citationGrowth(year) {
    /**
     * Compute citation growth for given year with respect to previous one.
     */

    const dataNew = getData(year);
    const dataOld = getData(year - 1);

    let data = { 'total': [], 'absoluteGrowth': [], 'relativeGrowth': [] , 'typeCounts': [] };
    let delta = 0;
    let codeName = '';

    dataNew.forEach((dNew, index) => {
        codeName = dNew['name'];
        delta = dNew['citations'] - dataOld[index]['citations'];
        data['absoluteGrowth'].push([codeName, delta]);
        data['total'].push([codeName, dNew['citations']]);

        if (dataNew[index]['citations'] < 100) {
            // We require at least 100 citations for analyzing growth
            data['relativeGrowth'].push([codeName, 0]);
        } else {
            const factor = delta / parseFloat(dataOld[index]['citations']);
            data['relativeGrowth'].push([codeName, factor]);
        }

        // add code count to 
        for (const type of dNew['types']){
            if (type in data['typeCounts']) {
                data['typeCounts'][type] += 1;
            } else {
                data['typeCounts'][type] = 1;
            }
        }
    })

    data['absoluteGrowth'].sort((a, b) => {
        return a[1] - b[1];
    }).reverse();
    data['relativeGrowth'].sort((a, b) => {
        return a[1] - b[1];
    }).reverse();
    data['total'].sort((a, b) => {
        return a[1] - b[1];
    }).reverse();

    return data;

}

function totalList(data) {
    return (
        <Typography component="div" variant="subtitle1">
        <ol>
            {data.map(line => <li>{line[0] + ": " + line[1] + "\n"}</li>)}
        </ol>
        </Typography>
    );     
}

function absoluteGrowthList(data) {
    return (
        <Typography component="div" variant="subtitle1">
        <ol>
            {data.map(line => <li>{line[0] + ": +" + line[1] + "\n"}</li>)}
        </ol>
        </Typography>
    );     
}

function relativeGrowthList(data) {
    return (
        <Typography component="div" variant="subtitle1">
        <ol>
            {data.map(line => <li>{line[0] + ": +" + parseInt(line[1] * 100) + "%\n"}</li>)}
        </ol>
        </Typography>
    );     
}

function typeList(data) {
    return (
        <Typography component="div" variant="subtitle1">
        <ul>
        {Object.entries(data).map(( [k,v]) => <li>{k + ": " + v + "\n"}</li>)}
        </ul>
        </Typography>
    );     
}

function Card(title, message, footnote="", size) {
    const classes = useStyles();
    return ([
        <Grid item xs={size}>
            <Paper className={classes.paper}>
                <React.Fragment>
                    <Title>{title}</Title>
                    {message}
                    <Typography color="textSecondary" className={classes.depositContext}>
                        {footnote}
</Typography>
                </React.Fragment>
            </Paper>
        </Grid>

    ]);
}

let CURRENT_YEAR = YEARS.slice(-1)[0];
let GROWTH = citationGrowth(CURRENT_YEAR);

export default function Home() {
    return (
        <Grid container spacing={3}>
            {Card("Simulation engines", typeList(GROWTH['typeCounts']), "Number of simulation engines per method.", 4)}
            {Card("Top cited", totalList(GROWTH['total'].slice(0, 5)), 
            "In " + CURRENT_YEAR +".", 4)}
            {Card("Top citation growth", absoluteGrowthList(GROWTH['absoluteGrowth'].slice(0, 5)), 
            "In " + CURRENT_YEAR +" with respect to "+ (CURRENT_YEAR-1) + ".", 4)}
            {Card("Top relative citation growth", relativeGrowthList(GROWTH['relativeGrowth'].slice(0, 5)),
                "In " + CURRENT_YEAR +" with respect to "+ (CURRENT_YEAR-1) + ", considering only codes with >100 citations.",
                 4)}
        </Grid>);
}