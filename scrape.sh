#!/bin/bash
#export SCRAPER_API_KEY=c37bce6f98b186f306fef3fb26dcd30e
# Existing data are skipped automatically
for year in {2010..2024}; do
#for year in 2024; do
  atsim query --year-low $year --year-high $year -i src/data/citations.json -o cit-new.json --codes-json src/data/codes.json
  cp cit-new.json src/data/citations.json
done
