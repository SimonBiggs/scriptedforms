<!-- markdownlint-disable MD033 -->

# An example of the file change section

<section-start>

```python
from IPython.display import display
filepath = 'file-change.csv'
```

</section-start>

<section-live>

<variable-table>from_csv</variable-table>

```python
from_csv.to_csv(filepath)
```

</section-live>

<section-filechange paths="[filepath]">

```python
from_csv = pd.read_csv(filepath, index_col=0)
display(from_csv)
```

</section-filechange>