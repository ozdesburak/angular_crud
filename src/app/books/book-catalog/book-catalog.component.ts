import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Book } from '../book';
import * as bookActions from '../store/book.actions';
import * as bookSelector from '../store/book.selectors';

@Component({
  selector: 'app-book-catalog',
  templateUrl: './book-catalog.component.html',
  styleUrls: ['./book-catalog.component.scss']
})
export class BookCatalogComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  private bookStore$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<{ books }>
  ) {
    this.store.dispatch(bookActions.findAllBooks());
  }



  ngOnInit(): void {
    //Tüm kitapları listeleme işlemi
    this.bookStore$ = this.store.select(bookSelector.selectAllBooks)
      .subscribe((books) => {
        this.books = [...books];
        // console.log('selectAllBooks', books);
        
      });
    // this.store.select(bookSelector.getBookState)
    //   .subscribe((books) => {
    //     console.log('Güncel State Hepsi', books);
        
    //   });
    this.store.select(bookSelector.selectBookEntities)
      .subscribe((books) => {
        console.log('selectBookEntities', books);
        
      });
    // this.store.select(bookSelector.selectTotalEntities)
    //   .subscribe((books) => {
    //     console.log('selectTotalEntities', books);
        
    //   });
    // this.store.select(bookSelector.selectIdsEntities)
    //   .subscribe((books) => {
    //     console.log('selectIdsEntities', books);
        
    //   });
    // this.store.select(bookSelector.selectBookSensorId)
    //   .subscribe((books) => {
    //     console.log('selectBookSensorId', books);
        
    //   });
    // this.store.select(bookSelector.selectAllBooks)
    //   .subscribe((books) => {
    //     console.log('selectAllBooks', books);
        
    //   });
    this.store.select(bookSelector.selectCurrentBook)
      .subscribe((books) => {
        console.log('selectCurrentBook', books);
        
      });
  }

  ngOnDestroy(): void {
    // sayfa değişince aboneliği sonlandır
    this.bookStore$?.unsubscribe();
  }

  onNavigateToCreateBookView(): void {
    // yeni kitap ekleme
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

}
