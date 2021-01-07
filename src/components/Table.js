import React from 'react';
import MUIDataTable from "mui-datatables";
//import RangeSlider from './RangeSlider'
//idea: use search icon for link to google scholar
//import SearchIcon from '@material-ui/icons/Search'

import columns from '../data/columns.json'
import { YEARS, getData } from './Config';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "2020",
      data: getData("2020"),
      columns: columns,
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
    let cols = this.state.columns;

    // add homepage link to code
    cols[0]['options']['customBodyRenderLite'] = (dataIndex) => {
      const row = this.state.data[dataIndex];
      return <a href={row['homepage']} target='_blank' rel="noreferrer">{row['name']}</a>;
    }

    // add google scholar link to number of citations
    cols.slice(-1)[0]['options']['customBodyRenderLite'] = (dataIndex) => {
      const row = this.state.data[dataIndex];
      const searchUrl = 'https://scholar.google.com/scholar?q=' + encodeURIComponent(row['query_string'])
        + '&hl=en&as_sdt=0%2C5&as_ylo=' + this.state.year + '&as_yhi=' + this.state.year;
      return <a href={searchUrl} target='_blank' rel="noreferrer">{row['citations']}</a>;
    }

    // add search link to citation

    return cols;
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
