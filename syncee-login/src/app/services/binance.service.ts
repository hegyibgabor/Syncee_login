import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Currency {
    id: string;
    name: string;
    min_size: string;
}

export interface BinanceServiceResponse {
    data: Currency[];
}

@Injectable({
    providedIn: 'root'
})
export class BinanceService {
    private apiUrl = 'https://api.coinbase.com/v2/currencies';

    constructor(private http: HttpClient) { }

    getCurrencies(): Observable<BinanceServiceResponse> {
        return this.http.get<BinanceServiceResponse>(this.apiUrl);
    }
}