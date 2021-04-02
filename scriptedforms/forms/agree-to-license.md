<!-- markdownlint-disable MD033 MD041 -->

# Need to agree to Scripted Forms software license on first use

This appears to be the first use of the Scripted Forms package on this
computer. Please agree to the terms and conditions below before you can
continue to use Scripted Forms.

<style>
.centre-output pre {
  width: 620px;
  margin: auto;
}

.no-word-break code {
  word-break: keep-all;
}

mat-card-content {
  height: 512px;
  overflow-y: auto;
}
</style>

<section-start>

```python
import os
from ipython_genutils.path import ensure_dir_exists
from jupyter_core.paths import jupyter_data_dir

from IPython.display import display, Markdown
from scriptedforms._utilities import _print_agpl, _print_apache

scripted_forms_data_directory = os.path.join(
    os.path.split(jupyter_data_dir())[0], 'scriptedforms')
ensure_dir_exists(scripted_forms_data_directory)

license_agreement_file = os.path.join(
  scripted_forms_data_directory,
  'has-agreed-to-scriptedforms-license')

i_agree_to_apache = False
```

</section-start>

## Software license agreement

Scripted Forms -- Making GUIs easy for everyone on your team.

Copyright (C) 2017 Simon Biggs

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

<mat-card class="mat-elevation-z8">
  <mat-card-header>
    <mat-card-title>Apache-2.0</mat-card-title>
    <mat-card-subtitle>
    The Apache License, Version 2.0
    </mat-card-subtitle>
  </mat-card-header>
  <mat-card-content class="mat-elevation-z1">
<section-start class="centre-output" always>

```python
_print_apache()
```

</section-start>
  </mat-card-content>
  <mat-card-actions align="right">

  <variable-tick name='I agree to the terms and conditions of the Apache-2.0' required>
    i_agree_to_apache
  </variable-tick>
  </mat-card-actions>
</mat-card>

<br><br><br><br>

<section-output>

```python
if i_agree_to_apache:
    with open(license_agreement_file, 'w') as file:
        file.write('')

    print('Record of agreement created at:\n    {}'.format(license_agreement_file))
```

</section-output>