import { TestBed } from '@angular/core/testing';

import { GoogleSheetsServuce } from './google-sheets.servuce';

describe('GoogleSheetsServuce', () => {
  let service: GoogleSheetsServuce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleSheetsServuce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
