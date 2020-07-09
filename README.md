The new iterations is on based on:

[paper](http://diglib.eg.org/handle/10.2312/SPBG.SPBG07.091-100)
[reference implementation](http://danifold.net/mapper/index.html)

This is a data explorer for open source data from CarbonHealth/Braid.

version.sh will just copy the current ref hash into a div. It's always one behind, obviously.

## Submodules

This repository uses mdcolab/covidclinicaldata as a submodule.

Jupyter and git don't play too nicely- jupyter changes meta data, git wants to commit. jupyter creates hidden files, git wants to commit. I removed my own write permissions for this directory during daily drivings.

`sudo chown 555 covidclinicaldata`
