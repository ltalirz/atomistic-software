## Purpose

_${this.packageJson.name}_ aims to track the citation trends of all major atomistic simulation engines.

Practitioners and software developers in the field of atomistic simulations may find it useful for:

- getting an [overview of major simulation engines](#/table) with specific features, licensing conditions, ...
- monitoring how the use of individual simulation engines has evolved over time
- analyzing [trends at the ecosystem level](#/statistics) (licensing, ...)

Citation data are updated annually, while [corrections and additions](${this.packageJson.repository.url}#adding-a-simulation-engine) are welcome throughout the year.

The collection does not aim to promote any particular simulation engine or group of engines.

## Scope and relevance criterion

_${this.packageJson.name}_ uses the following working definition of an _atomistic simulation engine_:

> a piece of software that, given two sets of atomic elements and positions, can compute their (relative) internal energies.
> In almost all cases, engines will also be able to compute the derivative of the energy with respect to the positions, i.e. the forces on the atoms, and thus be able to perform tasks like geometry optimizations or molecular dynamics.

This covers the \`DFT\`, \`WFM\`, \`QMC\`, \`TB\`, and \`FF\` categories.
Softwares in the \`Spectroscopy\` category are not necessarily simulation engines in the above sense, but compute the response of a given atomic structure to an external excitation (via photons, electrons, ...).

**Relevance criterion**: In order to keep the length of the list manageable, atomistic simulation engines need to have had at least **one year with 100 citations** or more in order to be added to the list.
Simulation engines that do not yet meet the criterion are tracked on a [watchlist](${this.packageJson.repository.url}/wiki/Watchlist).
Simulation engines that are no longer maintained (website down for more than 1 month) are removed from the list.

Besides citation counts, _${this.packageJson.name}_ collects further metadata, such as the homepage, license, and other relevant information.
Metadata on _${this.packageJson.name}_ should
  1. add value for filtering/selecting codes
  2. change slowly (time scale 1 year or longer)
  3. be easy to collect (2 work days per year should suffice for updating the complete collection)
## Methodology

**Disclaimer**: Owing to the [lack of standardization in today's software citation practices](http://doi.org/10.5281/zenodo.4263762), the citation counts reported here are _approximate_ and their significance should not be overrated.
This is not an exact science.
Nevertheless, [reports](${this.packageJson.repository.url}/issues) of mistakes or practical suggestions on how to improve accuracy are always welcome.

Approximate citation counts are obtained from [Google Scholar](https://scholar.google.com/) as follows:

1.  Search for name of the code and the last name of a representative developer (vast majority of codes)
1.  When the name of the code is too common a search term, citations of a major article are counted (minority of codes)

Click on a citation count in order to see the exact Google Scholar query that was used to extract it.

## Frequently Asked Questions

1.  **Q**: The citation count for year XXXX reported here differs somewhat from the same citation count I see on Google Scholar. Why?

    **A**: Citation counts reported by Google Scholar are not static, even for years that lie in the past.
    Reasons may include new sites being indexed, more text being extracted, different citations being disambiguated, or even the heuristic evolving that predicts the total number of results.
    In our experience, citation data for the previous year can be subject to significant (upwards) fluctuation, while citation data for years further in the past are quite stable.
    Hover with the mouse pointer over a citation count in the overview table in order to see when this data point was collected.

1.  **Q**: Why impose a criterion that engines on the list need to have at least one year with 100 citations?

    **A**: atomistic.software aims to be a comprehensive list of all major atomistic simulation engines.
    Since new engines are created all the time, this goal is almost impossible to achieve without introducing a "relevance cutoff".
    The value of 100 is not set in stone and could be re-evaluated in the future, once the list has had some time to consolidate.

1.  **Q**: A major simulation engine (check relevance criterion above) is missing. How can I add it to the list?

    **A**: Please follow the [instructions](${this.packageJson.repository.url}#contributing) from the source code repository.

1.  **Q**: I have discovered a mistake/inaccuracy in the citation data or in the classification of a simulation engine. How can I report/correct it?

    **A**: Please follow the [instructions](${this.packageJson.repository.url}#contributing) from the source code repository.
    A to-do list of corrections is maintained [here](${this.packageJson.repository.url}/issues/29).

## How to cite

Please cite [atomistic.software](https://atomistic.software/#/) in your scientific work in one or both of the following ways:

- **Article**: Talirz, L., Ghiringhelli, L. M., & Smit, B. (2021). Trends in Atomistic Simulation Software Usage [Article v1.0]. Living Journal of Computational Molecular Science, 3(1), 1483. [https://doi.org/10.33011/livecoms.3.1.1483](https://doi.org/10.33011/livecoms.3.1.1483)
- **Web site**: Cite the DOI corresponding to the latest website release by copying the "Cite as" information from [https://doi.org/10.5281/zenodo.4639414](https://doi.org/10.5281/zenodo.4639414)


## Acknowledgements
This project was inspired by and built upon the ["Major codes in electronic-structure theory, quantum chemistry, and molecular-dynamics"](https://www.nomad-coe.eu/old-pages/externals/codes) collection maintained by the [NOMAD Center of Excellence](https://www.nomad-coe.eu) from 2017-2019.
Thanks go to Luca Ghiringhelli for being supportive of this effort to transform the static list into an interactive app and a collaborative project.

The project draws upon further great resources, including:
 * The [Google Scholar](https://scholar.google.com/) search engine for citation counts
 * Wikipedia's [List of quantum chemistry and solid-state physics software](https://en.wikipedia.org/wiki/List_of_quantum_chemistry_and_solid-state_physics_software)
 * Wikipedia's [Comparison of software for molecular mechanics modelling](https://en.wikipedia.org/wiki/Comparison_of_software_for_molecular_mechanics_modeling)
 * SklogWiki's [Materials modelling and computer simulation codes](http://www.sklogwiki.org/SklogWiki/index.php/Materials_modelling_and_computer_simulation_codes)
 * MolSSI's [Molecular Software Database](https://molssi.org/software-search/)


## Contact

This page is currently maintained by [${this.packageJson.author.name}](${this.packageJson.author.url}).
