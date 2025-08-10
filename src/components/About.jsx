import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ReactMarkdown from "react-markdown";
import Title from "./Dashboard/Title";
import packageJson from "../../package.json";

import aboutMD from "../text/about.md";

const fillTemplate = function (templateString, templateVars) {
  /**
   * Replace JS variables in markdown strings.
   *
   * See https://stackoverflow.com/a/37217166/1069467
   */

  return new Function("return `" + templateString + "`;").call(templateVars);
};

function MarkdownPane({ title, markdownFile, markdown: initialMarkdown = "" }) {
  const [markdown, setMarkdown] = React.useState(initialMarkdown);

  React.useEffect(() => {
    if (!initialMarkdown && markdownFile) {
      let active = true;
      fetch(markdownFile)
        .then((res) => res.text())
        .then((text) => {
          if (!active) return;
          setMarkdown(fillTemplate(text, { packageJson }));
        })
        .catch(() => {
          if (!active) return;
          setMarkdown("\n> Failed to load markdown.\n");
        });
      return () => {
        active = false;
      };
    }
  }, [initialMarkdown, markdownFile]);

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          overflow: "auto",
          flexDirection: "column",
        }}
      >
        <React.Fragment>
          <Title>{title}</Title>
          <Typography component="div" variant="body1" className="markdown">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </Typography>
        </React.Fragment>
      </Paper>
    </Grid>
  );
}

export default function Home() {
  return (
    <Grid container spacing={3}>
      <MarkdownPane title="About" markdownFile={aboutMD} />
    </Grid>
  );
}
