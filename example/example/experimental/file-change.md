<!-- markdownlint-disable MD033 -->

# An example of the file change section

<section-start>

```python
from IPython.display import display
filepath = 'file-change.csv'

input_type = {
    '1st': 'toggle',
    '3rd': 'number',
    '4th': 'dropdown',
    '5th': 'dropdown'
}

dropdown_items = {
  '4th': [
    'hello',
    'george',
    'all rows have the same options'
  ],
  '5th': {
    'a': [
      'pick a',
      'or 1'
    ],
    'b': [
      'pick b',
      'or 2'
    ],
    'c': [
      'pick c',
      'or 3'
    ]
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

## A table that allows the types that are sent to pandas to be edited

This is using the `typeEdit` property within the `<variable-table>` element.

<section-live>

<variable-table typeEdit>from_csv</variable-table>

```python
from_csv.to_csv(filepath)
```

</section-live>

## A table that forces input types

This is using the `inputType` property within the `<variable-table>` element.

<section-live>

<variable-table inputType="input_type" dropdownItems="dropdown_items">from_csv</variable-table>

```python
from_csv.to_csv(filepath)
```

</section-live>