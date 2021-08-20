## Purpose

*${this.packageJson.name}* aims to track the citation trends of all major atomistic simulation engines.

Practitioners and software developers in the field of atomistic simulations may find it useful for:

 * getting an overview of major simulation engines with specific features, licensing conditions, ...
 * monitoring how the use of individual simulation engines has evolved over time
 * analyzing trends at the ecosystem level (licensing, ...)

Citation data are updated annually, while [corrections and additions](${this.packageJson.repository.url}#adding-a-simulation-engine) are welcome throughout the year.

The collection does not aim to promote any particular simulation engine or group of engines.

## Scope and relevance criterion

*${this.packageJson.name}* uses the following working definition of an *atomistic simulation engine*:

> a piece of software that, given two sets of atomic elements and positions, can compute their (relative) internal energies. 
> In almost all cases, engines will also be able to compute the derivative of the energy with respect to the positions, i.e. the forces on the atoms, and thus be able to perform tasks like geometry optimizations or molecular dynamics.

This covers the \`DFT\`, \`WFM\`, \`QMC\`, \`TB\`, and \`FF\` categories.
Softwares in the \`Spectroscopy\` category are not necessarily simulation engines in the above sense, but compute the response of a given atomic structure to an external excitation (via photons, electrons, ...).

**Relevance criterion**: In order to keep the length of the list manageable, atomistic simulation engines need to have had at least **one year with 100 citations** or more in order to be added to the list.

## Methodology

**Disclaimer**: Owing to the [lack of standardization in today's software citation practices](http://doi.org/10.5281/zenodo.4263762), the citation counts reported here are *approximate* and their significance should not be overrated.
This is not an exact science.
Nevertheless, [reports](${this.packageJson.repository.url}/issues) of mistakes or practical suggestions on how to improve accuracy are always welcome. 

Approximate citation counts are obtained from [Google Scholar](https://scholar.google.com/) as follows:

 1. Search for name of the code and the last name of a representative developer (vast majority of codes)
 1. When the name of the code is too common a search term, citations of a major article are counted (minority of codes)

Click on a citation count in order to see the exact Google Scholar query that was used to extract it.

## Frequently Asked Questions

 *  **Q**: The citation count for year XXXX reported here differs somewhat from the same citation count I see on Google Scholar. Why?

    **A**: Citation counts reported by Google Scholar are not static, even for years that lie in the past.
    Reasons may include new sites being indexed, more text being extracted, different citations being disambiguated, or even the heuristic evolving that predicts the total number of results.
    In our experience, citation data for the previous year can be subject to significant (upwards) fluctuation, while citation data for years further in the past are quite stable.
    We record the date of when each data point was collected in the [source code repository](${this.packageJson.repository.url}).

*  **Q**: Why impose a criterion that engines on the list need to have at least one year with 100 citations?

    **A**: atomistic.software aims to be a comprehensive list of all major atomistic simulation engines.
    Since new engines are created all the time, this goal is almost impossible to achieve without introducing a "relevance cutoff".
    The value of 100 is not set in stone and could be re-evaluated in the future, once the list has had some time to consolidate.

## How to cite

You are welcome to cite [atomistic.software](https://atomistic.software/#/) in your scientific work in the following ways:

* **Variant 1**: Cite the DOI corresponding to the latest website release by copying the "Cite as" information from [https://doi.org/10.5281/zenodo.4639414](https://doi.org/10.5281/zenodo.4639414)
* **Variant 2**: Talirz, L. *Trends in atomistic simulation engines.* [https://atomistic.software](https://atomistic.software/#/) (2021)

## Contact

This page is currently maintained by [${this.packageJson.author.name}](${this.packageJson.author.url}).