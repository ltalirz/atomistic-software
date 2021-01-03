//import './App.css';
import React from 'react';
import Table, { Column, SortOrder} from 'react-base-table'
import 'react-base-table/styles.css'

//import { Chart } from './components'
//import { Table } from './components'
import citations from './data/citations.json'
import codes_metadata from './data/codes_metadata.json'
import columns from './data/columns.json'

// for (let i = 0; i < 3; i++) columns[i].sortable = true

const tableHeight = 1200;
const rowHeight = 25;
const colWidth = 100;

// const defaultSort = { key: 'column-0', order: SortOrder.ASC }



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //sortBy: defaultSort,
      year: "2015",
      metadata: codes_metadata,
      citations: citations,
      sortBy: {key: 'citations', order: SortOrder.DESC },
    };
  }

  // onColumnSort = sortBy => {
  //   this.setState({
  //     sortBy,
  //     data: this.state.data.reverse(),
  //   })
  // }

  handleChange(event) {
    this.setState({year: event.target.value});
  }

  getColumns() {
    // let columns = [];
    // for (const key in this.state.metadata['ABINIT']){
    //   columns.push({ key: key, dataKey: key, width: colWidth});
    // }
    // //console.log(columns);
    // console.log(columns[0].width);
    // return columns
    let cols = columns;
    for (const col of cols) {
      col['width'] = colWidth;
      col['dataKey'] = col['key'];
      col['height'] = 100;
    }
    return cols;
  }

  getData() {
    let year  = this.state.year.toString();
    let data = this.state.metadata; //.slice();

    for (const codename in data){
      data[codename]['citations'] = this.state.citations[year]['citations'][codename];
    }

    let dataArray = [];
    for (const codename in data){
      dataArray.push(data[codename]);
    }
    console.log(dataArray[0]);
    return dataArray;
    //.return generateData(this.getColumns(),100);
  }

  render() {
    return (
    <div className="App">
      <header className="App-header">
      <select value={this.state.year} onChange={this.handleChange}>
        <option value="2015">2015</option>
      </select>
        <Table
        width={800}
        height={tableHeight}
        //fixed
        rowKey="name"
        columns={this.getColumns()}
        data={this.getData()}
        sortBy={this.state.sortBy}
        onColumnSort={this.onColumnSort}
      >
        </Table>
      </header>
    </div>
  );
          //width={100}
        //
        
        //<Chart />
}
}

export default App;
