import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ReactMarkdown from "react-markdown";

import useStyles from "./Dashboard/Styles";
import Title from "./Dashboard/Title";
import packageJson from "../../package.json";

import aboutMD from "../text/about.md";

const fillTemplate = function (templateString, templateVars) {
  /**
   * Replace JS variables in markdown strings.
   *
   * See https://stackoverflow.com/a/37217166/1069467
   */
  // eslint-disable-next-line
  return new Function("return `" + templateString + "`;").call(templateVars);
};

class MarkdownPane extends React.Component {
  /**
   * Pane to display markdown content from file
   * 
   * Can be used with markdown file or markdown string:
   * 
   *   <MarkdownPane title="About" markdown={aboutMD} classes={classes} />
       <MarkdownPane title="Methodology" markdownFile={methodologyMD} classes={classes} />
   */

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      markdownFile: props.markdownFile,
      markdown: props.markdown || "",
      classes: props.classes,
    };
  }

  componentWillMount() {
    // Get contents from Markdown file and put them in the React state, so we can reference it in render() below.
    if (!this.state.markdown && this.state.markdownFile) {
      fetch(this.state.markdownFile)
        .then((res) => res.text())
        .then((text) =>
          this.setState({
            markdown: fillTemplate(text, { packageJson: packageJson }),
          })
        );
    }
  }

  render() {
    return (
      <Grid item xs={12}>
        <Paper className={this.state.classes.paper}>
          <React.Fragment>
            <Title>{this.state.title}</Title>
            <Typography component="div" variant="body1" className="markdown">
              <ReactMarkdown children={this.state.markdown} />
            </Typography>
          </React.Fragment>
        </Paper>
      </Grid>
    );
  }
}

export default function Home() {
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      <MarkdownPane title="About" markdownFile={aboutMD} classes={classes} />
    </Grid>
  );
}
