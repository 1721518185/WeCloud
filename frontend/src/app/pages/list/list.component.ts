import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  wegameList: any = [];
  loading: boolean = true;
  isVisible: boolean = false;
  addForm!: FormGroup;
  // the game name for upload media
  uniqueGameName: string | '' | undefined;
  addField: any = [
    {
      label: 'Name',
      value: 'Name',
    },
    {
      label: 'Distributer',
      value: 'Distributer',
    },
    {
      label: 'Developer',
      value: 'Developer',
    },
    {
      label: 'Release Date',
      value: 'Release Date',
    },
    {
      label: 'Summary',
      value: 'Summary',
    },
    {
      label: '# of Critic Reviews',
      value: '# of Critic Reviews',
    },
    {
      label: 'Critic Positive',
      value: 'Critic Positive',
    },
    {
      label: 'Critic Negative',
      value: 'Critic Negative',
    },
  ];
  page: number = 1;
  size: number = 10;
  total: number = 10;
  searchForm!: FormGroup;
  searchField: any = [
    {
      label: 'Name',
      value: 'Name',
    },
    {
      label: 'Distributer',
      value: 'Distributer',
    },
    {
      label: 'Developer',
      value: 'Developer',
    },
  ];
  typeOption: any = [
    {
      label: 'Wegame',
      value: 'Wegame',
    },
    {
      label: 'TV Show',
      value: 'TV Show',
    },
    {
      label: 'all',
      value: 'all',
    },
  ];

  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService,
    public router: Router,
    private modalService: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.addForm = this.fb.group({
      Name: [null, [Validators.required]],
      Distributer: [null, [Validators.required]],
      Developer: [null, [Validators.required]],
      'Release Date': [null, [Validators.required]],
      Summary: [null, [Validators.required]],
      '# of Critic Reviews': [null, [Validators.required]],
      'Critic Positive': [null, [Validators.required]],
      'Critic Negative': [null, [Validators.required]],
    });
    this.searchForm = this.fb.group({
      Name: [null],
      Distributer: [null],
      Developer: [null],
    });
    // @ts-ignore
    this.addForm.get('Name').valueChanges.subscribe((value) => {
      this.uniqueGameName = value;
    });
    this.getWegameList(true);
  }

  getNamesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('names') || '[]');
  }
  submitForm(): void {

  }

  onSearch() {
    this.page = 1;
    this.size = 18;
    this.getWegameList();
  }
  toDetail(data: any) {
    localStorage.setItem('wegameInfo', JSON.stringify(data));
    this.router.navigate(['/layout/wegame-details']);
  }

  getReviewTotalAndPositive(str: string) {
    if (!str) return ['0', '0'];
    const strArray = str.split(' ');
    const total =
      strArray.filter((item: string) => item?.indexOf(',') !== -1)[0] || '0';
    const positive =
      strArray.filter((item: string) => item?.indexOf('%') !== -1)[0] || '0';
    return [total, positive];
  }

  getWegameList(columns:boolean = false) {
    let params = {
      page: this.page,
      size: this.size,
      columns: columns,
      ...this.searchForm.value,
    };
    this.apiService.post('game_list', params).subscribe(
      (res: any) => {
        this.loading = false;
        const { code, data, total, names } = res;
        if (code == 200) {
          this.loading = false;
          this.wegameList = data;
          this.wegameList.forEach((item: any, index: number) => {
            item.idx = index;
            item.reviewTotal = this.getReviewTotalAndPositive(
              item['All Reviews Number']
            )[0];
            item.reviewPositive = this.getReviewTotalAndPositive(
              item['All Reviews Number']
            )[1];
          });
          this.total = total;
          if (names) {
            localStorage.setItem('names', JSON.stringify(names));
          }
        } else {
          this.wegameList = [];
        }
      },
      () => {
        this.loading = false;
      }
    );
  }
  pageChange(val: number) {
    this.page = val;
    console.log(val);
    this.getWegameList();
  }
  pageSizeChange(val: number) {
    this.size = val;
    this.getWegameList();
  }
}
