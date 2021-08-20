[![DOI](https://zenodo.org/badge/327603600.svg)](https://zenodo.org/badge/latestdoi/327603600)

# Trends in atomistic simulation engines

[atomistic.software](https://atomistic.software/#/) aims to track the citation trends of all major atomistic simulation engines.

This git repository contains the source code of the [atomistic.software](https://atomistic.software/#/) website.
## Adding a simulation engine

Contributions of new simulation engines are always welcome!
Please check that your engine fits the **scope** and **relevance criterion** on [atomistic.software/#/about](https://atomistic.software/#/about).
Then pick one of the following two options:
#### Option 1: Suggest addition

If you're not familiar with GitHub or don't have time to add the engine yourself, just [add a comment](https://github.com/ltalirz/atomistic-software/issues/21) with your suggestion.

#### Option 2: Make a pull request

 1. Add code metadata to [`src/data/codes.json`](src/data/codes.json)
 2. (optional) Add citation information to [`src/data/citations.json`](src/data/citations.json)

The second step can also be performed in an automated way by the maintainer of this repository.

## How to cite

See [atomistic.software/#/about](https://atomistic.software/#/about).

## Developing the app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
and makes use of the great [mui-datatable](https://github.com/gregnb/mui-datatables) and [nivo](https://github.com/plouc/nivo) visualization library.

 * `npm start`runs the app in the development mode.
 * `npm test` launches the test runner in the interactive watch mode, see [running tests](https://facebook.github.io/create-react-app/docs/running-tests).
 * `npm run build` builds the app for production to the `build` folder (bundles React and optimizes for performance).
 * `npm run deploy` deploys the app to GitHub pages.
## License

The web application is licensed under the [Affero General Public License version 3 (AGPL-3.0-only)](./LICENSE).

The data set in [src/data](./src/data) is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International license (CC-BY-SA-4.0)](http://creativecommons.org/licenses/by-sa/4.0/).

## Acknowledgements & contact

See [atomistic.software/#/about](https://atomistic.software/#/about) 