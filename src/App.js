import './App.css';
import React from 'react';
import MUIDataTable from "mui-datatables";
//idea: use search icon for link to google scholar
//import SearchIcon from '@material-ui/icons/Search'

//import { Chart } from './components'
//import { Table } from './components'
import citations from './data/citations.json'
import codes_metadata from './data/codes_metadata.json'
import columns from './data/columns.json'

// For whatever reason, one cannot simply use `citations.keys()`
let years = [];
for (const citation in citations){
  years.push(citation);
}

function getData(year) {
  year = year.toString();
  let data = codes_metadata; //.slice();

  for (const codename in data) {
    data[codename]['citations'] = citations[year]['citations'][codename];
  }

  let dataArray = [];
  for (const codename in data) {
    dataArray.push(data[codename]);
  }
  return dataArray;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "2015",
      data: getData("2015"),
      columns: columns,
      options: { 'filterType': 'dropdown', 
      'sortOrder': { 'name': 'citations', 'direction': 'desc' },
      'rowsPerPage': 15,
     }
    };
  }

  handleYearChange(event) {
    const newYear = event.target.value;
    this.setState({ year: newYear, data: getData(newYear)});
  }

  getColumns() {
    let cols = this.state.columns;
    for (const col of cols) {
      col['options'] = { 'filter': true, 'sort': true };

    }

    // add homepage link to code
    cols[0]['options']['customBodyRenderLite'] = (dataIndex) => {
      const row = this.state.data[dataIndex];
      return <a href={row['homepage']} target='_blank' rel="noreferrer">{row['name']}</a>;
    }

    // add google scholar link to number of citations
    cols.slice(-1)[0]['options']['customBodyRenderLite'] = (dataIndex) => {
      const row = this.state.data[dataIndex];
      const searchUrl = 'https://scholar.google.com/scholar?q=' + row['query_string'] 
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
          <select defaultValue={this.state.year} onChange={this.handleYearChange}>
            {years.map( x => <option key={x}>{x}</option>)}
          </select>
          <MUIDataTable
            title={"QM Code List"}
            columns={this.getColumns()}
            data={this.state.data}
            options={this.state.options}
          />
        </header>
      </div>
    );

    //<Chart />
  }
}

export default App;
