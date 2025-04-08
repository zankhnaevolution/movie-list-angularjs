import { TestBed } from '@angular/core/testing';

import { ErrorClassBasesInterceptor } from './error-class-bases.interceptor';

describe('ErrorClassBasesInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorClassBasesInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorClassBasesInterceptor = TestBed.inject(ErrorClassBasesInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
