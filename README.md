# Covid Data Exploration

The new iterations is on based on:

[paper](http://diglib.eg.org/handle/10.2312/SPBG.SPBG07.091-100)

We'll be using scikit and kmapper. The javascript is not the focus right now, we're making notebooks.

## Dependencies

`pip install numpy pandas scikit-learn matplotlib seaborn ipynb jupyterlab`

## Tools

version.sh will just copy the current ref hash into a div. It's always one behind, obviously.

## Notebook diffying

Git & other plaintext tools don't like json. However, git has been configured to use nbdime to do merge's and diff's for ipynb files.

`pip install nbdime` must be installed. This setting is marked in `.gitattributes` and was set with `nbdime config-git --enable`. More is written [here](https://nbdime.readthedocs.io/en/latest/vcs.html#merge-driver).

Now you have some useful commands:

`nbdiff` and `nbdiff-web` - prints a diff nicely

`nbmerge` and `nbmerge-web` - use these when there are git merge conflicts

`nbshow` - just prints the terminal nicely


## Submodules

This repository uses mdcollab/covidclinicaldata as a submodule.

Jupyter and git don't play too nicely- jupyter changes meta data, git wants to commit. jupyter creates hidden files, git wants to commit. 

You can maybe add exclude lines (especially for checkpoints) to `.git/info/exclude` and `.git/module/covidclinicaldata/info/exclude` to reduce these issues.

Any of these commands may help (from stack exchange):

`git -C covidclinicaldata reset --hard`
`git submodule update --init`
`git subdmoule update -f --init`

When you pull in new changes to the submodule, make sure you `git pull` AND `git checkout master` because git submodule has a really weird way of _using_ the master branch after `git pull` but still thinking it's in a weird state.

Make sure to pull in new changes and commit that change to the master directory immediately.
