import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BookService } from '../book.service';
import * as bookActions from '../store/book.actions';
import * as bookSelector from '../store/book.selectors';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit, OnDestroy {
  bookForm: FormGroup;
  isEditFlowActive = false;
  private currentBookIdOnEdit: string;
  private bookStore$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store
  ) {
    this.bookStore$ = new Subscription();
    this.bookForm = this.initFormBuilder();
    this.prepareCreateOrUpdateFlow();
  }

  ngOnInit(): void {
    this.bookStore$.add(

      // kitap eklendiğinde uyarı cıkarmak için
      this.store.select(bookSelector.isCreateSuccess)
        .pipe(filter(done => done))
        .subscribe(() => {
          this.resetForm();
          this.snackBar.open('Book created!', 'OK', { duration: 2000 });
        })
    );
    // kitap güncellendiğinde uyarı cıkarmak için
    this.bookStore$.add(
      this.store.select(bookSelector.isUpdateSuccess)
        .pipe(filter(done => done))
        .subscribe(() => this.snackBar.open('Book updated!', 'OK', { duration: 2000 }))
    );
  }
// komponenet değiştiğinde  aboneliği bitrimek için
  ngOnDestroy(): void {
    this.bookStore$?.unsubscribe();
  }

  // ana sayfaya dönmek için
  onNavigateToCatalog(): void {
    this.router.navigate(['..']);
  }


  // Yeni kitap mı yoksa güncelleme mi yapıalcak
  onFormSubmit(): void {
    if (this.isEditFlowActive) {
      const bookToUpdate = { ...this.bookForm.value, _id: this.currentBookIdOnEdit};
      this.store.dispatch(bookActions.updateBook({ book: bookToUpdate }));
    } else {
      this.store.dispatch(bookActions.createBook({ book: this.bookForm.value }));
    }
  }

  // güncelleme metotu url id var ise update yapılacak
  private prepareCreateOrUpdateFlow() {
    const idFromUrlParam: string = this.activatedRoute.snapshot.params.id;
    if (idFromUrlParam) {
      this.isEditFlowActive = true;
      this.currentBookIdOnEdit = idFromUrlParam;
      this.store.dispatch(bookActions.SelectBook({ id: idFromUrlParam }));
      this.store.dispatch(bookActions.findOneBook({ id: idFromUrlParam }));
      this.handleBookSelectedChanges(idFromUrlParam);
    } else {
      this.bookForm.get('posterImgPath').setValue(this.bookService.getRamdomPosterImgPath());
    }
  }

  // form bilgileri
  private initFormBuilder(): FormGroup {
    return new FormGroup({
      author: new FormControl({ value: '', disabled: false }, [Validators.required]),
      description: new FormControl({ value: '', disabled: false }, [Validators.required]),
      favorite: new FormControl({ value: false, disabled: false }, [Validators.required]),
      posterImgPath: new FormControl({ value: '', disabled: false }, [Validators.required]),
      title: new FormControl({ value: '', disabled: false }, [Validators.required]),
    });
  }
// eğer kitap seçili ise edit için değerleri doldurma
  private handleBookSelectedChanges(id: string): void {
    this.bookStore$.add(
      this.store.pipe(select(bookSelector.selectCurrentBook))
        .pipe(filter(book => !!book))
        .subscribe(bookSelected => {
          const { author, description, favorite, posterImgPath, title } = bookSelected;
          
          this.bookForm.patchValue({ author, description, favorite, posterImgPath, title });
        })
    );
  }
// form mu sıfırla ve errorlera null atamak
  private resetForm(): void {
    this.bookForm.reset();
    Object.keys(this.bookForm.controls).forEach(key => {
      this.bookForm.get(key).setErrors(null);
    });
  }

}
