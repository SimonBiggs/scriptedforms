<!-- markdownlint-disable MD033 -->

# An example

<section-start>

```python
# By using autoreload, any changes within the python package will update
# automatically. This will slow the form down though, so only use it during
# development.
# http://ipython.readthedocs.io/en/stable/config/extensions/autoreload.html
%load_ext autoreload
%autoreload 1
%aimport example

# Normally you would just need to use the following:
# import example
```

</section-start>

<section-live>

<variable-string>your_name</variable-string>

```python
example.hello(your_name)
```

</section-live>

## A more detailed example

[Link](./detailed.md)