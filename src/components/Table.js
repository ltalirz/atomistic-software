import React from 'react';
import MUIDataTable from "mui-datatables";
//import RangeSlider from './RangeSlider'
//idea: use search icon for link to google scholar
//import SearchIcon from '@material-ui/icons/Search'

import { YEARS, getData } from './Config';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "2020",
      data: getData("2020"),
      columns: null,
      options: {
        'filterType': 'checkbox',
        'sortOrder': { 'name': 'citations', 'direction': 'desc' },
        'rowsPerPage': 100,
      }
    };
  }

  handleYearChange(event) {
    this.setState({ year: event.target.value, data: getData(event.target.value) });
  }

  getColumns() {
    let columns = [
      {
        "name": "name",
        "label": "Code",
        "options": {
          "filter": false, "sort": true,
          // add homepage link to code
          "customBodyRenderLite": (dataIndex) => {
            const row = this.state.data[dataIndex];
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
        "options": { "filter": true, "sort": true }
      },

      {
        "name": "types",
        "label": "Methods",
        "options": { 
          "filter": true, 
          "sort": true,
          "customBodyRenderLite": (dataIndex) => {
            return Array.from(this.state.data[dataIndex]['types']).join(', ')
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
            const row = this.state.data[dataIndex];
            const searchUrl = 'https://scholar.google.com/scholar?q=' + encodeURIComponent(row['query_string'])
              + '&hl=en&as_sdt=0%2C5&as_ylo=' + this.state.year + '&as_yhi=' + this.state.year;
            return <a href={searchUrl} target='_blank' rel="noreferrer">{row['citations']}</a>;
          }
        }
      }
    ]

    // add search link to citation

    return columns;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MUIDataTable
            title={
              <h2>Atomistic Simulation Engines &nbsp;
              <select defaultValue={this.state.year} onChange={(event) => this.handleYearChange(event)}>
                  {YEARS.map(x => <option key={x}>{x}</option>)}
                </select>
              </h2>
            }
            columns={this.getColumns()}
            data={this.state.data}
            options={this.state.options}
          />
        </header>
      </div>
    );
    //title={<RangeSlider year={this.state.year} />
  }
}

export default Table;
