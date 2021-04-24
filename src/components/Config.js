import citations from '../data/citations.json'
import codes from '../data/codes.json'

// Citation cutoff
const CUTOFF = 100;

function yearToRange(year) {
  /**
   * Transform year to year range used in citations.json
   * 
   * E.g. 2020 => "2020-2020"
   */
  return year.toString() + '-' + year.toString();
}

function rangeToYear(range) {
  /**
   * Transform year range used in citations.json to year
   * 
   * E.g. "2020-2020" => 2020
   */
  return parseInt(range.split('-')[0]);
}

// For whatever reason, one cannot simply use `citations.keys()`
let YEARS = [];
for (const citation in citations){
  YEARS.push(rangeToYear(citation));
}
YEARS = [...new Set(YEARS)];
YEARS.sort();


let CODES = [];
for (const codename in codes){
    CODES.push(codename);
}

function getData(year) {
  /**
   * Get data for code table for a given year.
   */
  let range_key = yearToRange(year);
  let citations_data = citations[range_key]['citations'];
  let data = codes; //.slice();

  for (const codename in data) {
    data[codename]['citations'] = citations_data[codename]['citations'];
  }

  let dataArray = [];
  for (const codename in data) {
    dataArray.push(Object.assign({}, data[codename]));
  }
  return dataArray;
}

function getDataChart(){
  /**
   * Get citation data for all codes
   */
    let lines = [];
    for(const codeName of CODES.slice(0,50)){
        lines.push({ 'id': codeName, 'data': getCodeCitations(codeName)});
    }
    return lines;
}

function filterCodeNames(filters){
  /**
   * Return list of code names after applying filters.
   * 
   * E.g. filters = {'type': ['DFT']}
   */
    let codeNames = [];
    for(const codeName in codes){
      for (const filter in filters) {
        if (filters[filter].includes(codes[codeName][filter])){
          codeNames.push(codeName);
        }
      }
    }
    return codeNames;
}

function  getCodeCitations(codeNames){
  /** 
   * Return citations of requested codes vs years.
   * 
   * Sums citations of all codes in codeNames.
   */
  let line_data = [];
    for (const year of YEARS) {
        let data = {};
        let range_key = yearToRange(year);

        data['x'] = parseInt(year);
        data['y'] = 0;
        for (const codeName of codeNames) {
          data['y'] += parseInt(citations[range_key]['citations'][codeName]['citations']);
        }
        if (isNaN(data['y']) || data['y'] <= 0) { 
            data['y']=0;
        }
        line_data.push(data);
    
    }
    return line_data;
}

export {yearToRange, rangeToYear, YEARS, CODES, getData, getDataChart, getCodeCitations, filterCodeNames, CUTOFF};