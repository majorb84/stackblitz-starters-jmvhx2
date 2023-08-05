import { Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormControl,
} from '@angular/forms';

import {
  GridComponent,
  GridDataResult,
  CancelEvent,
  EditEvent,
  RemoveEvent,
  SaveEvent,
  AddEvent,
} from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Product } from './model';
import { EditService } from './edit.service';
import { map } from 'rxjs/operators';

import { Products } from './products';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 5,
  };
  public formGroup: FormGroup;

  defaultFormState: any;
  myForm: UntypedFormGroup;

  private editService: EditService;
  private editedRowIndex: number;

  private readonly savedFormLocalStorageKey: string = 'demoSearchCriteria';

  createFormGroup = (dataItem) =>
    new UntypedFormGroup({
      productSearch: new UntypedFormControl(dataItem.productSearch),
      priceSearch: new UntypedFormControl(dataItem.priceSearch),
    });

  constructor(@Inject(EditService) editServiceFactory: () => EditService) {
    this.editService = editServiceFactory();
  }

  public ngOnInit(): void {
    this.defaultFormState = {
      productSearch: null,
      priceSearch: null,
    };

    this.view = this.editService.pipe(
      map((data) => process(data, this.gridState))
    );

    this.editService.read();
    this.createForm();
    this.getSavedFormData();
  }

  private createForm(): void {
    this.myForm = this.createFormGroup(this.defaultFormState);
  }

  private getSavedFormData(): void {
    const data = JSON.parse(
      localStorage.getItem(this.savedFormLocalStorageKey)
    );

    if (data) {
      this.myForm = this.createFormGroup(data);
    }
  }

  public onStateChange(state: State): void {
    this.gridState = state;

    this.editService.read();
  }

  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({
      ProductID: new FormControl(),
      ProductName: new FormControl('', Validators.required),
      UnitPrice: new FormControl(0),
      UnitsInStock: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{1,3}'),
        ])
      ),
      Discontinued: new FormControl(false),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  public editHandler(args: EditEvent): void {
    // define all editable fields validators and default values
    const { dataItem } = args;
    this.closeEditor(args.sender);

    this.formGroup = new FormGroup({
      ProductID: new FormControl(dataItem.ProductID),
      ProductName: new FormControl(dataItem.ProductName, Validators.required),
      UnitPrice: new FormControl(dataItem.UnitPrice),
      UnitsInStock: new FormControl(
        dataItem.UnitsInStock,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{1,3}'),
        ])
      ),
      Discontinued: new FormControl(dataItem.Discontinued),
    });

    this.editedRowIndex = args.rowIndex;
    // put the row in edit mode, with the `FormGroup` build above
    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  public cancelHandler(args: CancelEvent): void {
    // close the editor for the given row
    this.closeEditor(args.sender, args.rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const product: Product[] = formGroup.value;

    this.editService.save(product, isNew);

    sender.closeRow(rowIndex);
  }

  public removeHandler(args: RemoveEvent): void {
    // remove the current dataItem from the current data source,
    // `editService` in this example
    this.editService.remove(args.dataItem);
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  submit() {
    console.log(this.myForm.value);
  }
}
