# atsim-trends

[*atsim-trends*](https://ltalirz.github.io/atsim-trends/#/) aims to track the citation trends of all major atomistic simulation engines.

This is the git source code repository powering the [live website](https://ltalirz.github.io/atsim-trends/#/).
### Scope

Working definition of an "atomistic simulation engine": a piece of software that, given two sets of atomic elements and positions, can compute their (relative) internal energies. In almost all cases, codes will also be able to compute the derivative of the energy with respect to the positions, i.e. the forces on the atoms, and thus be able to perform tasks like geometry optimizations or molecular dynamics. This covers the codes in the `DFT`, `WFM`, `QMC`, `TB`, and `FF` categories.

Codes in the `Spectroscopy` category are not necessarily simulation engines in the above sense, but are able to compute the response of a given set of atomic elements to an external excitation (via photons, electrons, ...).
### Adding a simulation engine

Contributions of new simulation engines are always welcome!

In order to keep the length of the list manageable, new atomistic simulation engines need to have had at least **one year with 100 citations** or more. 
This criterion is put in place in order to keep the length of the list manageable.
It is obviously somewhat arbitrary (and is not fulfilled by all historical entries on the list) and may be relaxed over time.

#### Option 1: Suggest addition

If you're not familiar with github or don't have time to add the engine yourself, just [add a comment](https://github.com/ltalirz/atsim-trends/issues/21) with your suggestion.

#### Option 2: Make a pull request

 1. Add code metadata to [`src/data/codes.json`](src/data/codes.json)
 2. (optional) Add citation information to [`src/data/citations.json`](src/data/citations.json)

The second step can also be performed in an automated way by the maintainer of this repository.

## Developing the app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Acknowledgements

This project was inspired by the ["Major codes in electronic-structure theory, quantum chemistry, and molecular-dynamics"](https://www.nomad-coe.eu/old-pages/externals/codes) collection maintained by the [NOMAD Center of Excellence](https://www.nomad-coe.eu) from 2017-2019.
Thanks go to Luca Ghiringelli for being supportive of this effort to transform the static list into an interactive app and a collaborative project.

The project draws upon further great resources, including:
 * The [Google Scholar](https://scholar.google.com/) search engine for citation counts
 * Wikipedia's [List of quantum chemistry and solid-state physics software](https://en.wikipedia.org/wiki/List_of_quantum_chemistry_and_solid-state_physics_software)
 * Wikipedia's [Comparison of software for molecular mechanics modelling](https://en.wikipedia.org/wiki/Comparison_of_software_for_molecular_mechanics_modeling)
 * SklogWiki's [Materials modelling and computer simulation codes](https://en.wikipedia.org/wiki/Comparison_of_software_for_molecular_mechanics_modeling)

## Contact

leopold.talirz@gmail.com
