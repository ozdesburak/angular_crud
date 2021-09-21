import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Book } from '../book';
import * as bookActions from '../store/book.actions';
import * as bookSelector from '../store/book.selectors';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit, OnDestroy {
  @Input() book: Book ;
  private bookStore$: Subscription;
  loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store
  ) {
    this.bookStore$ = new Subscription();
  }

  ngOnInit(): void {
    this.bookStore$.add(
      // kitap silindiğinde uyarı cıkarmak için abone oluyoruzz
      this.store.select(bookSelector.isDeleteSuccess)
        .pipe(filter(done => !!done))
        .subscribe(() => this.snackBar.open('Book deleted!', 'OK', { duration: 2000 })),
    );
    this.bookStore$.add(
      // kitap silindiğinde uyarı cıkarmak için abone oluyoruzz
      this.store.select(bookSelector.isPatchSuccess)
        .pipe(filter(done => !!done))
        .subscribe(() => this.snackBar.open('Book patch fav!', 'OK', { duration: 2000 })),
    );
    this.store.select(bookSelector.getLoading)
      .subscribe((books) => {
        console.log('getLoading', books);
        this.loading = books
        
      });
  }



//? Componenet değiştiğinde aboneliği sonlandır
  ngOnDestroy(): void {
    this.bookStore$?.unsubscribe();
  }

//? favorilere ekleme ve cıkarma işlemi
  onChangeFavoriteState(): void {
    const fieldsToUpdate = { favorite: !this.book.favorite };
    this.store.dispatch(bookActions.patchBook({ id: this.book._id, book: fieldsToUpdate }));
  }

//? Silme işlemi
  onClickRemoveBook(id: string): void {
    this.store.dispatch(bookActions.deleteBook({ id }));
  }
//? edit sayfasına yönlendirme
  onBookDetailNavigate(book: Book): void {
    this.router.navigate([book._id], { relativeTo: this.activatedRoute });
  }

}
