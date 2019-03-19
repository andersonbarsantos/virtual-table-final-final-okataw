import { ColumnWidthHelper } from './column-width';
import { BehaviorSubject } from 'rxjs';

describe('Grid Column Width', () => {

  it('should calculate the correct pixel widths', () => {
    const helper = new ColumnWidthHelper();
    const columns: any[] = [
      {
        width: '50%',
        resizable: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      },
      {
        width: '50%',
        resizable: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      }
    ];

    helper.sizeColumns(columns, 500);

    expect(columns[0].basis).toBe(250);
    expect(columns[1].basis).toBe(250);
  });

  it('should fill the available width', () => {
    const helper = new ColumnWidthHelper();
    const columns: any[] = [
      {
        width: '200px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      },
      {
        width: '200px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      }
    ];

    helper.sizeColumns(columns, 500);

    expect(columns[0].basis).toBe(250);
    expect(columns[1].basis).toBe(250);
  });

  it('should shrink to available space', () => {
    const helper = new ColumnWidthHelper();
    const columns: any[] = [
      {
        width: '300px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      },
      {
        width: '300px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      }
    ];

    helper.sizeColumns(columns, 500);

    expect(columns[0].basis).toBe(250);
    expect(columns[1].basis).toBe(250);
  });

  it('should not resize first column', () => {
    const helper = new ColumnWidthHelper();
    const columns: any[] = [
      {
        width: '200px',
        grow: false,
        shrink: false,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      },
      {
        width: '250px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      }
    ];

    helper.sizeColumns(columns, 500);

    expect(columns[0].basis).toBe(200);
    expect(columns[1].basis).toBe(300);
  });

  it('should not shrink below min width', () => {
    const helper = new ColumnWidthHelper();
    const columns: any[] = [
      {
        width: '100px',
        minWidth: '200px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      },
      {
        width: '250px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      }
    ];

    helper.sizeColumns(columns, 500);

    expect(columns[0].basis).toBe(200);
    expect(columns[1].basis).toBe(300);
  });

  it('should overflow total width', () => {
    const helper = new ColumnWidthHelper();
    const columns: any[] = [
      {
        width: '500px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      },
      {
        width: '500px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      }
    ];

    helper.sizeColumns(columns, 500, true, true);

    expect(columns[0].basis).toBe(500);
    expect(columns[1].basis).toBe(500);
  });

  it('should work with pixel and percent widths', () => {
    const helper = new ColumnWidthHelper();
    const columns: any[] = [
      {
        width: '25%',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      },
      {
        width: '200px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      }
    ];

    helper.sizeColumns(columns, 500);

    expect(columns[0].basis).toBe(212.5);
    expect(columns[1].basis).toBe(287.5);
  });

  it('should redistribute min widths', () => {
    const helper = new ColumnWidthHelper();
    const columns: any[] = [
      {
        width: '200px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      },
      {
        width: '200px',
        minWidth: '200px',
        grow: true,
        shrink: true,
        _basis$: new BehaviorSubject(0),
        _minBasis$: new BehaviorSubject(0)
      }
    ];

    helper.sizeColumns(columns, 300);

    expect(columns[0].basis).toBe(100);
    expect(columns[1].basis).toBe(200);
  });

});
