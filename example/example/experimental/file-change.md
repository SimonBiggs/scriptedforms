<!-- markdownlint-disable MD033 -->

# An example of the file change section

<section-start>

```python
from IPython.display import display
filepath = 'file-change.csv'

input_types = {
    '1st': 'toggle',
    '3rd': 'number',
    '4th': 'dropdown',
    '5th': 'dropdown',
    '6th': 'readonly'
}

dropdown_items = {
  '4th': ['apple', 'orange', 'pear'],
  '5th': {
    'a': ['sally', 'margaret', 'annita'],
    'b': ['george', 'philip', 'simpson'],
    'c': ['red', 'green', 'blue']
  }
}
```

</section-start>

## A Jupyter output display of the pandas dataframe from the csv file

<section-filechange paths="[filepath]">

```python
from_csv = pd.read_csv(filepath, index_col=0)
display(from_csv)
```

</section-filechange>

## A default table

<section-live>

<variable-table>from_csv</variable-table>

```python
from_csv.to_csv(filepath)
```

</section-live>

## A table that allows the json pandas types to be edited

This is using the `typeEdit` property within the `<variable-table>` element.

<section-live>

<variable-table typeEdit>from_csv</variable-table>

```python
from_csv.to_csv(filepath)
```

</section-live>

## A table that forces input types

This is using the `inputTypes` property within the `<variable-table>` element.

<section-live>

<variable-table inputTypes="input_types" dropdownItems="dropdown_items">from_csv</variable-table>

```python
from_csv.to_csv(filepath)
```

</section-live>
