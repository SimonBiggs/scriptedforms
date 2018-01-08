import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FormBuilderModule } from "./form-builder-module/form-builder.module";

const appRoutes: Routes = [{ path: "**", component: FormBuilderModule }];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
