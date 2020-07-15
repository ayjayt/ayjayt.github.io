import os

import pandas as pd


# define utility function to find submodules
def findSubmoduleDir(path: str) -> str:
    path = os.path.abspath(path)
    if path == "/":
        # Could not find covidclinicaldata in current directory or in any parent directory
        # You can edit the CWPATH variable to point to the containing directory
        raise FileNotFoundError("Could not find the covidclinicaldata/ subdirectory")
    if os.path.isdir(path+'/covidclinicaldata'):
        if not os.path.isdir(path+'/covidclinicaldata/notebooks'):
            raise FileNotFoundError("Could not find Jupyter notebooks in covidclinicaldata/- is it initialized?")
        return path+'/covidclinicaldata'
    return findSubmoduleDir('..')


## We'd like to use the original open_data function, but it takes no PATH argument.
## This one also ignores indexes
def open_data(path: str) -> pd.DataFrame:
    '''Open all data in `PATH`.
    Parameters
    ----------
    path : str
        The path to find data.

    
    Returns
    -------
    pandas.DataFrame
    '''    
    return pd.concat(
        [
            pd.read_csv(f'{path}/{filename}') 
            for filename in os.listdir(path) 
            if filename.endswith('.csv')
        ], ignore_index=True
    )

