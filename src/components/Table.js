/**
 * Overview table with all codes.
 */
import React from "react";
import MUIDataTable from "mui-datatables";
import packageJson from "../../package.json";
//import RangeSlider from './RangeSlider'
import Typography from "@material-ui/core/Typography";

import { YEARS, getData } from "./Config";
import { getColumns } from "./Columns";

const lastYear = YEARS[YEARS.length-1];

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: lastYear,
      data: getData(lastYear),
      columns: null,
      options: {
        print: false,
        filterType: "checkbox",
        filterArrayFullMatch: false,
        sortOrder: { name: "citations", direction: "desc" },
        rowsPerPage: 100,
        selectableRows: false,
        setTableProps: () => {
          return {
            // material ui v4 only
            size: "small",
          };
        },
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

        <Typography variant="subtitle1" align='center' noWrap>
          Further engines are tracked on the <a href={packageJson.repository.url + '/wiki/Watchlist'}>Watchlist</a>.
        </Typography>

        </header>
      </div>
    );
    //title={<RangeSlider year={this.state.year} />
  }
}

export default Table;
