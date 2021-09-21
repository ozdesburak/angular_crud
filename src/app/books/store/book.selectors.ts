import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BooksState, featureKey, adapter } from './book.state';
import * as bookActions from './book.actions';

const {
  selectEntities,
  selectAll,
  selectTotal,
  selectIds,
} = adapter.getSelectors();

//? güncel State hepsi
export const getBookState = createFeatureSelector<BooksState>(featureKey);

//?getbook state içindeki tüm entityleri getirir
export const selectBookEntities = createSelector(getBookState, selectEntities);

//? toplam entity sayısını döndürür
export const selectTotalEntities = createSelector(getBookState, selectTotal);

// ?tüm entity  idleri  döndürür
export const selectIdsEntities = createSelector(getBookState, selectIds);

//? Seçilen veya detayına gidilen book id getitir
export const selectBookSensorId = createSelector(getBookState, (state: BooksState) => state.selectedId);

//? getbookState içindeki tüm  entityleri dizi şeklinde döner
export const selectAllBooks = createSelector(getBookState, selectAll);

//?  selectbookentities state içindeki tüm entityleri getirir
//?  selectBookSensorId state içindeki detayına gidilen veya seçilen id getirir
//?  key userid id olanı geri donduruyor
export const selectCurrentBook = createSelector(
  selectBookEntities,
  selectBookSensorId,
  (userEntities, userId) =>   userEntities[userId]
);
//? beklemek için loader get
//? get book state güncel state geri göndürür
export const getLoading = createSelector(
  getBookState,
  (state:BooksState) =>   state.loading
);

//? başarılı durumlar için caseler
export const isCreateSuccess = createSelector(getBookState, (state: BooksState) =>
  state.action === bookActions.type.CREATE_BOOK && !state.loading && !state.error)

export const isUpdateSuccess = createSelector(getBookState, (state: BooksState) =>
  state.action === bookActions.type.UPDATE_BOOK && !state.loading && !state.error);

export const isDeleteSuccess = createSelector(getBookState, (state: BooksState) =>
  state.action === bookActions.type.DELETE_BOOK && !state.loading && !state.error);
  
export const isPatchSuccess = createSelector(getBookState, (state: BooksState) =>
  state.action === bookActions.type.PATCH_BOOK && !state.loading && !state.error);
