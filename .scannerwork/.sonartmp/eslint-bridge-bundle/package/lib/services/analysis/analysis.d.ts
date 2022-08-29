import { AnalysisError } from './errors';
/**
 * An analysis function
 *
 * Every analysis consumes an input and produces an output regardless of whether
 * the analysis denotes a CSS analysis, a JavaScript one or another kind.
 *
 * _The return type is a JavaScript Promise to have a common API between all
 * types of analysis, especially because of CSS analyses which uses Stylelint._
 */
export declare type Analysis = (input: AnalysisInput) => Promise<AnalysisOutput>;
/**
 * An analysis input
 *
 * An analysis always operates on a file, be it from its path
 * or its content for any type of analysis.
 *
 * @param filePath the path of the file to analyze
 * @param fileContent the content of the file to analyze
 */
export interface AnalysisInput {
    filePath: string;
    fileContent: string | undefined;
}
/**
 * An analysis output
 *
 * An analysis outputs a result that depends on the kind of analysis.
 * Still, any analysis is subject to errors (which was initially named
 * `parsingError` and cannot be changed without breaking the protocol of
 * the bridge with any other components, e.g. SonarLint).
 *
 * @param parsingError an analysis error, if any
 */
export interface AnalysisOutput {
    parsingError?: AnalysisError;
}
