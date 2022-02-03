// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword
declare module jasmine {
  import { VerificationConfig } from 'testdouble';
	interface NothingMatcher {
    toVerify(check: VerificationConfig): boolean
    toVerify(a: any, check?: VerificationConfig): boolean
	}
}
