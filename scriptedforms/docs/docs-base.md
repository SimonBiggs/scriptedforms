<!-- markdownlint-disable MD033 MD041 -->

<mat-sidenav-container>

  <mat-sidenav mode="side" opened="true">
    <h1>ScriptedForms</h1>
    <section>Navigation</section>
    <section>links</section>
    <section>go</section>
    <section>here</section>
  </mat-sidenav>

  <mat-sidenav-content>
    <div class="content-frame">
      {% block content %}{% endblock %}
    </div>
  </mat-sidenav-content>

</mat-sidenav-container>
