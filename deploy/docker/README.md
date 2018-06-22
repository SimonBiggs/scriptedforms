# Advanced Docker Deploy of ScriptedForms

This docker deploy is currently incomplete. It aims to be provide a full
installation of ScriptedForms, served in a multi user format via JupyterHub
behined nginx.

It is planned that this docker build will become the focus for advanced use
cases of ScriptedForms. The idea is it will provide the ability to save form
results to the PostgreSQL database associating that data entered with the
user login from JupyterHub. Data should then be trendable. Plan to also
implement an easy to customise navigation panel.

This docker installation will become the location where documentation and
examples are written and provided to the user in an interactive format. This
documentation + examples will also be the focus of the selenium tests.

If you want to run this on a computer that has a public IP then you should
(as in MUST) **secure it with ssl** by adding ssl options to the docker
configuration for nginx.