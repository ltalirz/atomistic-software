[![DOI](https://zenodo.org/badge/327603600.svg)](https://zenodo.org/badge/latestdoi/327603600)

# Trends in atomistic simulation engines

[atomistic.software](https://atomistic.software/#/) aims to track the citation trends of all major atomistic simulation engines.

This git repository contains the source code of the [atomistic.software](https://atomistic.software/#/) website.

## Contributing

Corrections, updates and contributions of new simulation engines are always welcome!

Before contributing a new simulation engine, please check that your engine fits the **scope** and **relevance criterion** on [atomistic.software/#/about](https://atomistic.software/#/about).

#### Option 1: Make a pull request

Edit the [`src/data/codes.json`](src/data/codes.json) file and make a pull request.

Note: There is no need to update citation counts.
If necessary, this will be performed by the maintainer of this repository using the [scholarly python package](https://github.com/scholarly-python-package/scholarly).

#### Option 2: Suggest addition/correction

If you're not familiar with GitHub or don't have time to add the engine yourself, feel free provide your suggestion via [email to the author](mailto:leopold.talirz@gmail.com) or by [commenting on this GitHub issue](https://github.com/ltalirz/atomistic-software/issues/21).

## How to cite

See [atomistic.software/#/about](https://atomistic.software/#/about).

## Developing the app

This project uses [Vite](https://vitejs.dev/) for the development/build toolchain and makes use of [Material UI v6](https://mui.com/) with [material-react-table](https://www.material-react-table.com/) as well as the [nivo](https://github.com/plouc/nivo) visualization library.

Tip: You don't need the (large & growing) `gh-pages` branch. Clone only the `master` branch via

```terminal
git clone -b master --single-branch git@github.com:ltalirz/atomistic-software.git
```

You will need Node.js 20 or newer (see `"engines"` in `package.json`), e.g. from `conda-forge`:

```terminal
conda install -c conda-forge nodejs
```

Finally, install the dependencies and run the app:

- `npm install` installs dependencies for running the app locally.
- `npm start` starts the Vite development server.
- `npm test` runs the test suite once using Vitest; use `npm run test:watch` to watch tests.
- `npm run build` builds the app for production to the `dist` folder.
- Deployment to GitHub Pages is handled by GitHub Actions; for a manual deploy, run `npm run deploy` to publish the `dist` folder.

## License

The web application is licensed under the [Affero General Public License version 3 (AGPL-3.0-only)](./LICENSE).

The data set in [src/data](./src/data) is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International license (CC-BY-SA-4.0)](http://creativecommons.org/licenses/by-sa/4.0/).

## Acknowledgements & contact

See [atomistic.software/#/about](https://atomistic.software/#/about)
