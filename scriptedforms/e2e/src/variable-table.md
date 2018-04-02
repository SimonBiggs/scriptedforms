<!-- markdownlint-disable MD033 MD041 -->

<section-start always code="from importlib import reload; variable_table = __import__('variable-table');"></section-start>
<section-filechange paths="['./variable-table.py']" code="reload(variable_table);"></section-filechange>
<section-filechange paths="['./variable-table.csv']" code="variable_table.load_table();"></section-filechange>

<variable-table inputTypes="variable_table.input_types">variable_table.table</variable-table>