// import Chart from './Dashboard/Chart';
// import Deposits from './Dashboard/Deposits';
import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ReactMarkdown from "react-markdown";

import useStyles from "./Dashboard/Styles";
import Title from "./Dashboard/Title";
import packageJson from "../../package.json";

const aboutMD = `
*${packageJson.name}* aims to track the citation trends of all major atomistic simulation engines (see [scope](${packageJson.repository.url}#scope) and [relevance criterion](${packageJson.repository.url}#relevance)).

This is a collaboratively edited list.
Please visit the [source code repository on GitHub](${packageJson.repository.url}) for instructions on how to [add new simulation engines](${packageJson.repository.url}#adding-a-simulation-engine).

`;

const methodologyMD = `

**Disclaimer**: Owing to the [lack of standardization in today's software citation practices](http://doi.org/10.5281/zenodo.4263762), the citation counts reported here are *approximate* and their significance should not be overrated.
This is not an exact science.
Nevertheless, [reports](${packageJson.repository.url}/issues) of mistakes or practical suggestions on how to improve accuracy are always welcome. 

Approximate citation counts are obtained from [Google Scholar](https://scholar.google.com/) as follows:

 1. Search for name of the code and the last name of a representative developer (vast majority of codes)
 1. When the name of the code is too common a search term, citations of a major article are counted (minority of codes)

Click on a citation count in order to see the exact Google Scholar query that was used to extract it.
`;

const faqMD = `
 *  **Q**: The citation count for year XXXX reported here differs somewhat from the same citation count I see on Google Scholar. Why?

    **A**: Citation counts reported by Google Scholar are not static, even for years that lie in the past.
    Reasons may include new sites being indexed, more text being extracted, different citations being disambiguated, or even the heuristic evolving that predicts the total number of results.
    In our experience, citation data for the previous year can be subject to significant (upwards) fluctuation, while citation data for years further in the past are quite stable.
    We record the date of when each data point was collected in the [source code repository](${packageJson.repository.url}).

*  **Q**: Why impose a criterion that engines on the list need to have at least one year with 100 citations?

    **A**: atomistic.software aims to be a comprehensive list of all major atomistic simulation engines.
    As new engines are created all the time, this goal is almost impossible to achieve without introducing a "relevance cutoff".
    The value of 100 is not set in stone and could be re-evaluated in the future, once the list has had some time to consolidate.
    
`;

const acknowledgementsMD = `
This project was inspired by and built upon the ["Major codes in electronic-structure theory, quantum chemistry, and molecular-dynamics"](https://www.nomad-coe.eu/old-pages/externals/codes) collection maintained by the [NOMAD Center of Excellence](https://www.nomad-coe.eu) from 2017-2019.
Thanks go to Luca Ghiringelli for being supportive of this effort to transform the static list into an interactive app and a collaborative project.

The project draws upon further great resources, including:
 * The [Google Scholar](https://scholar.google.com/) search engine for citation counts
 * Wikipedia's [List of quantum chemistry and solid-state physics software](https://en.wikipedia.org/wiki/List_of_quantum_chemistry_and_solid-state_physics_software)
 * Wikipedia's [Comparison of software for molecular mechanics modelling](https://en.wikipedia.org/wiki/Comparison_of_software_for_molecular_mechanics_modeling)
 * SklogWiki's [Materials modelling and computer simulation codes](http://www.sklogwiki.org/SklogWiki/index.php/Materials_modelling_and_computer_simulation_codes)
`;

const contactMD = `
This page is currently maintained by [${packageJson.author.name}](${packageJson.author.url}).
`;

export default function Home() {
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      {}
      {/* About */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <React.Fragment>
            <Title>About</Title>
            <Typography component="div" variant="body1">
              <ReactMarkdown source={aboutMD} />
            </Typography>
          </React.Fragment>
        </Paper>
      </Grid>
      {/* Methodology */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <React.Fragment>
            <Title>Methodology</Title>
            <Typography component="div" variant="body1">
              <ReactMarkdown source={methodologyMD} />
            </Typography>
          </React.Fragment>
        </Paper>
      </Grid>
      {/* FAQ */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <React.Fragment>
            <Title>Frequently Asked Questions</Title>
            <Typography component="div" variant="body1">
              <ReactMarkdown source={faqMD} />
            </Typography>
          </React.Fragment>
        </Paper>
      </Grid>
      {/* Acknowledgements */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <React.Fragment>
            <Title>Acknowledgements</Title>
            <Typography component="div" variant="body1">
              <ReactMarkdown source={acknowledgementsMD} />
            </Typography>
          </React.Fragment>
        </Paper>
      </Grid>
      {/* Contact */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <React.Fragment>
            <Title>Contact</Title>
            <Typography component="div" variant="body1">
              <ReactMarkdown source={contactMD} />
            </Typography>
          </React.Fragment>
        </Paper>
      </Grid>
    </Grid>
  );
}

// {/* Chart */}
// <Grid item xs={12} md={8} lg={9}>
//     <Paper className={fixedHeightPaper}>
//         <Chart />
//     </Paper>
// </Grid>
// {/* Recent Deposits */}
// <Grid item xs={12} md={4} lg={3}>
//     <Paper className={fixedHeightPaper}>
//         <Deposits />
//     </Paper>
// </Grid>
