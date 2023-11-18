export enum ErrorCode {
  UNKNOWN = 0,
  USER_NOT_FOUND = 1,
  USER_BLOCKED = 2,
  VERIFYING = 3,
  INACTIVE = 4,
  ROLE_NOT_ALLOW = 5,
  PASSWORD_NOT_MATCH = 6,
}

export enum LanguageCode {
  Viet_Nam = 'vi',
  China = 'zh',
  United_States = 'en',
}

export const DEFAULT_LIMIT_PAGING = 30;

export enum AuthProvider {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  EMAIL = 'EMAIL',
}

export enum Currency {
  VND = 'VND',
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY',
  KRW = 'KRW',
  CNY = 'CNY',
  GBP = 'GBP',
  AUD = 'AUD',
  CAD = 'CAD',
  CHF = 'CHF',
  HKD = 'HKD',
  NZD = 'NZD',
  SGD = 'SGD',
  THB = 'THB',
  MXN = 'MXN',
  NOK = 'NOK',
  RUB = 'RUB',
  SEK = 'SEK',
  TRY = 'TRY',
  ZAR = 'ZAR',
  BRL = 'BRL',
  INR = 'INR',
  MYR = 'MYR',
  TWD = 'TWD',
  PHP = 'PHP',
  CZK = 'CZK',
  DKK = 'DKK',
  HUF = 'HUF',
  ILS = 'ILS',
  PLN = 'PLN',
}
