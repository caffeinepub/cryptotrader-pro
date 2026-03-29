import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type Instrument = string;
export type Balance = bigint;
export interface Trade {
    instrument: Instrument;
    timestamp: Timestamp;
    tradeAmount: TradeAmount;
    price: Price;
}
export interface Asset {
    id: Instrument;
    currentPrice: Price;
    openingPrice: Price;
}
export type TradeAmount = bigint;
export type Amount = bigint;
export interface UserProfile {
    name: string;
}
export type Price = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    buy(instrument: Instrument, amount: Amount): Promise<Balance>;
    createUser(): Promise<void>;
    deposit(amount: Balance): Promise<Balance>;
    getAllCurrentAssetPrices(): Promise<Array<Asset>>;
    getCallerBalance(): Promise<Balance>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallersInvestmentPortfolio(): Promise<Array<[Instrument, Amount]>>;
    getPrice(assetId: string): Promise<Price>;
    getTradeHistory(): Promise<Array<Trade>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sell(instrument: Instrument, amount: Amount): Promise<Balance>;
}
