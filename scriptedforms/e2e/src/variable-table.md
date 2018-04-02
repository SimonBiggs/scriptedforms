<!-- markdownlint-disable MD033 MD041 -->

# Variable table

<section-start always code="from importlib import reload; variable_table = __import__('variable-table');"></section-start>
<section-filechange paths="['./variable-table.py']" code="reload(variable_table);"></section-filechange>
<section-filechange paths="['./variable-table.csv']" code="variable_table.load_table();"></section-filechange>

## Default table

<variable-table>variable_table.table</variable-table>

## Editable pandas json types

<variable-table typeEdit>variable_table.table</variable-table>

## Dropdown input types with no dropdown items defined

<variable-table inputTypes="variable_table.input_types">variable_table.table</variable-table>

## Dropdown input types with dropdown items

<variable-table inputTypes="variable_table.input_types" dropdownItems="variable_table.dropdown_items">variable_table.table</variable-table>