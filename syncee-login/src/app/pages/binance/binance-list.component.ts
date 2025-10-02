import { Component, OnInit } from '@angular/core';
import { BinanceService, Currency } from '../../services/binance.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
    selector: 'app-binance-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './binance-list.component.html',
    styleUrls: ['./binance-list.component.scss']
})
export class BinanceListComponent implements OnInit {
    currencies: Currency[] = [];
    loading = false;
    error: string | null = null;

    constructor(private binanceService: BinanceService, private router: Router) { }

    ngOnInit(): void {
        this.loading = true;
        this.binanceService.getCurrencies().subscribe({
            next: (res) => {
                this.currencies = res.data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching currencies:', err);
                this.error = 'Failed to load currencies';
                this.loading = false;
            }
        });
    }

    Back() {
        this.router.navigate(['/dashboard']);
    }
}