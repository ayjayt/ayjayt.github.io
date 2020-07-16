import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
plt.rcParams.update({'figure.max_open_warning': 0})
import seaborn as sns

## for analyzing and sanitizing- policies are detailed in comments
## NOTE: This inpsects _individual data points_, which are numpy types, not pandas types! Pandas is just containers!
def printDataTypeAnalaysis(col: pd.Series) -> pd.Series:
    # rows is row labels
    rows = [ "missing/empty", "Has NaNs", "inferred type", "min,max", "n uniques"]
    
    # lets support three types: number, string, bool
    # strings are tough because they're just objects, and so it can hide other types
    # also supress a warning because deprecated and planned behavior is sufficient
    
    
    data_type = col.infer_objects().dtypes
    if np.issubdtype(data_type, np.number):
        data_type = np.number
    elif not data_type == np.object and not data_type == np.bool:
        raise TypeError("Could not detect type of column, or type not supported: " + str(data_type))
    # pretty unhappy when dtype is object, sometimes it wants 'O', sometimes it wants 'object', I don't know the difference

    values = [
        str(np.count_nonzero(col.isna())),
        str(col.hasnans),
        str(data_type),
    ]
    
    if data_type == np.number:
        values = values + [ 
            "(" + str(col.min()) + "," + str(col.max()) + ")",
            "N/A"
        ]
    else:
        values = values + [ 
            "N/A",
            str(col.nunique())
        ]
        # Add empty string to missing values
        if not data_type == np.bool:
            if not col.values.dtype == np.bool:
                values[0] = str(int(values[0]) + (pd.Series(col.values == '')).sum())
    return pd.Series(values, name=col.name, index=rows)


def plotDataDistributions(df: pd.DataFrame):
    n = int(np.ceil(len(df.columns)))
    fig = plt.figure(figsize=(20, 280))
    plt.subplots_adjust(hspace=.3)
    _ = df.apply(plotCol, axis='index', n = n, df=df)

def plotCol(col: pd.Series, n, df) -> pd.Series:
    idx = df.columns.get_loc(col.name) + 1
    ax = plt.subplot(n, 4, idx)
    if np.issubdtype(col.infer_objects().dtypes, np.number):
        sns.distplot(col, kde=False, rug=True)
    elif col.nunique() < 15:
        sns.countplot(x=col.fillna("NaN"))
        ax.set_xticklabels(ax.get_xticklabels(), rotation=45, horizontalalignment='right')
    else:
        ax.axis('off')
        ax.text(0.5,-0.1, col.name, size=12, ha="center", 
         transform=ax.transAxes)
        ax.text(0.5, 0.5, 'too many uniques', size=12, ha="center", transform=ax.transAxes, style='italic',
        bbox={'facecolor': 'red', 'alpha': 0.5, 'pad': 10})
    return None

def plotDistances(distances):
    width = np.max(distances) - np.min(distances)
    distancesImage = (((distances - np.min(distances))/width)*255).astype(np.uint8)
    _ = plt.figure(figsize=(20,20))
    _ = plt.gray()
    _ = plt.imshow(distancesImage)