# Task List

## 1. Normalize data

### Fill in missing values
        
* If it's a boolean value, you can make it equidistant from either category. 
* If it's numerical, you can either put in an average/median value, discard the data point, or something else at your discretion.
* If it's categorical, non-boolean, use your discretion dependent on the nature of the column.

### Location data

* Expand any location data to two columns for the coordinates

### Rescale

* The space should end up being an n-dimensional hypercube.

## 2. Create a metric function

### Transformations

* Consider if there are any benefits to transforming any of the variables (eg. taking the log, or changing the coordinate system)

### Independence

* Determine dependent columns
* Weight the metric so that dependent columns are weighted as one independent column, or create a "nested" metric to get distances in those subspaces first.

### Testing Properties

* Is the distance of a point to itself 0?
* Are similar data points closer than dissimilar data points?
* Do transitivity and reflexivity hold?

## 3. Create a bin function (think overlapping clusters)
## 4. Use mapper
## 5. Look at the pretty pictures
## 6. Do topology

