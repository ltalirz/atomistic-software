[![DOI](https://zenodo.org/badge/327603600.svg)](https://zenodo.org/badge/latestdoi/327603600)

# Trends in atomistic simulation engines

[atomistic.software](https://atomistic.software/#/) aims to track the citation trends of all major atomistic simulation engines.

This git repository contains the source code of the [atomistic.software](https://atomistic.software/#/) website.

## How to cite

You are welcome to cite [atomistic.software](https://atomistic.software/#/) in your scientific work in the following ways:

* **Variant 1**: Cite the DOI corresponding to the latest website release by copying the "Cite as" information from [https://doi.org/10.5281/zenodo.4639414](https://doi.org/10.5281/zenodo.4639414)
* **Variant 2**: Talirz, L. *Trends in atomistic simulation engines.* [https://atomistic.software](https://atomistic.software/#/) (2021)
 
## Scope

[atomistic.software](https://atomistic.software/#/) uses the following working definition of an *atomistic simulation engine*:

> a piece of software that, given two sets of atomic elements and positions, can compute their (relative) internal energies. 
> In almost all cases, engines will also be able to compute the derivative of the energy with respect to the positions, i.e. the forces on the atoms, and thus be able to perform tasks like geometry optimizations or molecular dynamics.

This covers the `DFT`, `WFM`, `QMC`, `TB`, and `FF` categories.

Softwares in the `Spectroscopy` category are not necessarily simulation engines in the above sense, but compute the response of a given atomic structure to an external excitation (via photons, electrons, ...).

## Relevance criterion

In order to keep the length of the list manageable, atomistic simulation engines need to have had at least **one year with 100 citations** or more in order to be added to the list.
## Adding a simulation engine

Contributions of new simulation engines are always welcome!
Please check that your engine fits the [scope](#scope) and meets the [relevance criterion](#relevance-criterion).
Then pick one of the following two options:
#### Option 1: Suggest addition

If you're not familiar with GitHub or don't have time to add the engine yourself, just [add a comment](https://github.com/ltalirz/atomistic-software/issues/21) with your suggestion.

#### Option 2: Make a pull request

 1. Add code metadata to [`src/data/codes.json`](src/data/codes.json)
 2. (optional) Add citation information to [`src/data/citations.json`](src/data/citations.json)

The second step can also be performed in an automated way by the maintainer of this repository.

## Developing the app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

 * `npm start`runs the app in the development mode.
 * `npm test` launches the test runner in the interactive watch mode, see [running tests](https://facebook.github.io/create-react-app/docs/running-tests).
 * `npm run build` builds the app for production to the `build` folder (bundles React and optimizes for performance).
 * `npm run deploy` deploys the app to GitHub pages.

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
