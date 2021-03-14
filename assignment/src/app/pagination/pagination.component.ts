import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export class PaginationConfig {
  itemsPerPage = 0;
  directionalLinks = false;
  numOfPages: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaginationComponent),
      multi: true
    }
  ]
})
export class PaginationComponent  implements OnChanges {

  @Input()
  config: PaginationConfig;
  @Input()
  data: any[];

  @Output()
  select: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  currentPageData: EventEmitter<any[]> = new EventEmitter<any[]>();

  initialConfig: PaginationConfig;
  initialData: any[];
  pageStartsAt = 0;
  currentIndex = 0;
  pages: number[] = [];
  currentPage = 1;
  changeFn: Function = (_: any) => { };

  constructor() {
    this.initialConfig = this.config;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.config) {
      this.arrangeConfig();
    }
  }

  arrangeConfig() {
    const length = (this.data || []).length;
    const noOfPages = Math.ceil(length / this.config.itemsPerPage);
    this.pages = [];
    for (let j = 1; j <= noOfPages; ++j) {
      this.pages.push(j);
    }
    setTimeout(() => {
      this.writeValue(this.currentPage);
    });
  }


  writeValue(value: number) {
    value = value || 0;
    value = isNaN(value) ? 0 : value;
    value = value >= this.pages.length ? 0 : value;
    if (value > 0 && value <= this.pages.length) {
      this.pageSelect(value, value - 1);
    } else {
      this.pageSelect(1, 0);
    }
    this.pageStartsAt = 0;
  }


  registerOnChange(fn: Function) {
    this.changeFn = fn;
  }
  registerOnTouched() { }

  getPages() {
    return this.pages.slice(this.pageStartsAt, this.pageStartsAt + this.config.numOfPages);
  }

  /**
   * @description A Listener for page button click event.
   */
  pageSelect(page: number, index: number) {
    let data;
    this.currentPage = page;
    this.changeFn(page);
    this.select.emit(page);
    this.currentIndex = index;
    data = this.getData(this.data, this.currentPage, this.config.itemsPerPage);
    setTimeout(() => {
      this.currentPageData.emit(data);
    });
  }

  getData(data, page, noOfItemsPerPage): any[] {
    return data.slice((page - 1) * noOfItemsPerPage, page * noOfItemsPerPage);
  }

  /**
   * @description A Listener for next button click event.
   */
  next(lastPage) {
    if (this.currentIndex < (this.pages.length - 1)) {
      if (!lastPage) {
        ++this.currentIndex;
        if (this.currentIndex > (this.pageStartsAt + this.config.numOfPages - 1)) {
          this.pageStartsAt = this.currentIndex;
        }
      } else {
        this.currentIndex = this.pages.length - 1;
        this.pageStartsAt = this.currentIndex - this.config.numOfPages + 1;
      }
      this.pageSelect(this.pages[this.currentIndex], this.currentIndex);
    }
  }

  /**
   * @description A Listener for previous button click event.
   */
  previous(firstPage) {
    if (this.currentIndex > 0) {
      if (!firstPage) {
        --this.currentIndex;
        if (this.currentIndex < this.pageStartsAt) {
          this.pageStartsAt = this.pageStartsAt - this.config.numOfPages;
        }
      } else {
        this.pageStartsAt = 0;
        this.currentIndex = 0;
      }
      this.pageSelect(this.pages[this.currentIndex], this.currentIndex);
    }
  }

  shiftRight() {
    const startIndex = Math.floor(this.currentIndex / this.config.numOfPages) * this.config.numOfPages;
    this.currentIndex = startIndex + this.config.numOfPages;
    this.pageStartsAt = this.currentIndex;
    this.pageSelect(this.pages[this.currentIndex], this.currentIndex);
  }

  shiftLeft() {
    const startIndex = Math.floor(this.currentIndex / this.config.numOfPages) * this.config.numOfPages;
    this.currentIndex = startIndex - this.config.numOfPages;
    this.pageStartsAt = this.currentIndex;
    this.pageSelect(this.pages[this.currentIndex], this.currentIndex);
  }

  hasRightShift() {
    const length = (this.data || []).length;
    return (this.pageStartsAt + this.config.numOfPages) < (length / this.config.itemsPerPage);
  }

  hasLeftShift() {
    return (this.pageStartsAt - this.config.numOfPages) >= 0;
  }

  hideButton(i: number) {
    this.config.numOfPages = this.config.numOfPages || 5;
    return !(i >= this.pageStartsAt && i < (this.pageStartsAt + this.config.numOfPages));
  }
}
