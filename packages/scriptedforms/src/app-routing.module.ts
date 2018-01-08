import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FormBuilderModule } from "./form-builder-module/form-builder.module";
import { FormBuilderComponent } from "./form-builder-module/form-builder.component";

const appRoutes: Routes = [{ path: "**", component: FormBuilderComponent }];

@NgModule({
  imports: [
    FormBuilderModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
