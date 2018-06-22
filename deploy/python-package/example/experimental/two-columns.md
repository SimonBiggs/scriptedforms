<!-- markdownlint-disable MD033 MD041 -->

<style>
  .scripted-form-widget .form-contents {
    max-width: none;
  }

  .flex-grid {
    display: flex;
  }

  .column {
    flex: 1;
    padding: 10px;
  }
</style>

<section-start always>

```python
table = pd.DataFrame(data=[[1,2,3],[4,5,6]], columns=['a', 'b', 'c'])

def plot_xy():
    plt.figure(figsize=(5,5))
    plt.scatter(table.values[0], table.values[1])
    plt.axis('equal')


def plot_yx():
    plt.figure(figsize=(5,5))
    plt.scatter(table.values[1], table.values[0])
    plt.axis('equal')
```

</section-start>

# Multi columns with CSS

Need at least version `0.9.2-dev2` for this to work.

<div class="flex-grid">
  <div class="column">
    ## Markdown won't work in here
    <h2>You need to use html</h2>
    <variable-table>table</variable-table>
  </div>

  <div class="column">
    <section-output onLoad code="plot_xy()"></section-output>
  </div>

  <div class="column">
    <section-output onLoad code="plot_yx()"></section-output>
  </div>
</div>