import {  ErrorHandler,  Injectable,  Injector, ChangeDetectorRef} from '@angular/core';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {
  errorCount = 0;
  constructor(protected injector: Injector) {
    super();
  }
  override handleError(error: any) {
    // Prevents change detection
    let debugCtx = error['ngDebugContext'];
    let changeDetectorRef = debugCtx && debugCtx.injector.get(ChangeDetectorRef);
    if (changeDetectorRef) changeDetectorRef.detach();
      console.log(error);
    // Service Implementation to push error logs to server
  }
}
