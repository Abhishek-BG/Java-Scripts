/**
 * An analysis error
 *
 * An analysis error denotes any kind of failure (or error) that can
 * occur during the analysis of an analysis request.
 *
 * @param code a code that describes the error type
 * @param line a line number in case an error concerns a file
 * @param message a description of the error
 */
export declare type AnalysisError = {
    code: AnalysisErrorCode;
    line?: number;
    message: string;
};
/**
 * The possible codes of analysis errors
 *
 * The `GeneralError` value denotes a runtime error which is either
 * unpredicatble or occurs rarely to deserve its own category.
 */
export declare enum AnalysisErrorCode {
    Parsing = "PARSING",
    MissingTypeScript = "MISSING_TYPESCRIPT",
    UnsupportedTypeScript = "UNSUPPORTED_TYPESCRIPT",
    FailingTypeScript = "FAILING_TYPESCRIPT",
    GeneralError = "GENERAL_ERROR"
}
/**
 * Infers the code of an analysis error based on the error message
 *
 * By default, any error which doesn't denotes a set of well-identified
 * runtime errors is always classified as a parsing error.
 *
 * @param error an error message
 * @returns the corresponding analysis error code
 */
export declare function parseAnalysisErrorCode(error: string): AnalysisErrorCode;
/**
 * A type guard for potential analysis errors
 * @param maybeError the potential error to type guard
 * @returns true if it is an actual error
 */
export declare function isAnalysisError<T>(maybeError: T | AnalysisError): maybeError is AnalysisError;
