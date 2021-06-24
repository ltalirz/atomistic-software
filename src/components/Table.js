/**
 * Overview table with all codes.
 */
import React from "react";
import MUIDataTable from "mui-datatables";
//import RangeSlider from './RangeSlider'

import { YEARS, getData } from "./Config";
import { getColumns } from "./Columns";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "2020",
      data: getData("2020"),
      columns: null,
      options: {
        filterType: "checkbox",
        sortOrder: { name: "citations", direction: "desc" },
        rowsPerPage: 100,
      },
    };
  }

  handleYearChange(event) {
    this.setState({
      year: event.target.value,
      data: getData(event.target.value),
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MUIDataTable
            title={
              <h2>
                Citation Data &nbsp;
                <select
                  defaultValue={this.state.year}
                  onChange={(event) => this.handleYearChange(event)}
                >
                  {YEARS.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </h2>
            }
            columns={getColumns(this.state.data, this.state.year)}
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
