import { ErrorHandler } from '@angular/core'

export class AppErrorHandler extends ErrorHandler {
 
 constructor() { 
   // The true paramter tells Angular to rethrow exceptions, so operations like 'bootstrap' will result in an error
   // when an error happens. If we do not rethrow, bootstrap will always succeed.
   super(true);
 }
 
  handleError(error) {
   let errorbox = document.getElementsByClassName("errorbox");
   if (errorbox.length > 0) {
    errorbox[0].innerHTML = error
   }

   console.log('Hello')
   
   // delegate to the default handler
   super.handleError(error); 
  }
}