<!-- markdownlint-disable MD033 -->

<style>
pre {
  width: 620px;
  margin: auto;
}

mat-card-content {
  height: 512px;
  overflow-y: auto;
}
</style>

# Create a New User

<variable-string placeholder="Your full name">
user
</variable-string>

Need to make password, run the salt, to create a private key, then from the
private key create a public key. Only send the public key to the server.
<section-live>
<variable-password placeholder="Create a password">
password
</variable-password>

```python
print(password)
```

</section-live>

## Software license agreement

Scripted Forms

Copyright (C) 2017 Simon Biggs

This software is licensed under both the Apache License, Version 2.0
(the "Apache-2.0") and the
GNU Affrero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version (the "AGPL-3.0+").

You may not use this software except in compliance with both the Apache-2.0 and
the AGPL-3.0+.

Full copies of the Apache-2.0 and the AGPL-3.0+ are provided below for your
reading. Copies may also be found online:

* AGPL-3.0+ -- https://www.gnu.org/licenses/agpl-3.0.txt
* Apache-2.0 -- https://www.apache.org/licenses/LICENSE-2.0.html

Unless required by applicable law or agreed to in writing, software
distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an **"AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND**, either express or implied. See
the Apache-2.0 and the AGPL-3.0+ for the specific language governing permissions and
limitations under the Apache-2.0 and the AGPL-3.0+.

<br>

<mat-card class="mat-elevation-z8">
  <mat-card-header>
    <mat-card-title>Apache-2.0</mat-card-title>
    <mat-card-subtitle>The Apache-2.0 License</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content class="mat-elevation-z1">
<section-start always>

```python
scriptedforms.print_apache()
```

</section-start>
  </mat-card-content>
  <mat-card-actions align="right">
  <variable-tick placeholder="I agree to the terms and conditions of Apache-2.0">
    i_agree_to_apache
  </variable-tick>
  </mat-card-actions>
</mat-card>

<br>

<mat-card class="mat-elevation-z8">
  <mat-card-header>
    <mat-card-title>AGPL-3.0+</mat-card-title>
    <mat-card-subtitle>The GNU Affrero General Public License version 3.0+</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content class="mat-elevation-z1">
<section-start always>

```python
scriptedforms.print_agpl()
```

</section-start>
  </mat-card-content>
  <mat-card-actions align="right">
  <variable-tick placeholder="I agree to the terms and conditions of AGPL-3.0+">
    i_agree_to_agpl
  </variable-tick>
  </mat-card-actions>
</mat-card>

<br><br><br>

<section-button name="Submit" conditional="i_agree_to_agpl and i_agree_to_apache and user is not None and password is not None">

```python
scriptedforms.save_signed_license_agreement()
```

</section-button>

<br><br><br><br><br>
