import { ErrorCode } from '../const/common';

export function resError(errorCode: ErrorCode) {
  return {
    errorCode,
  };
}
