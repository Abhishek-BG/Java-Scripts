import { SourceCode } from 'eslint';
import { AnalysisError } from 'services/analysis';
/**
 * Builds ESLint SourceCode instances for every embedded JavaScript snippet in the YAML file.
 *
 * If there is at least one parsing error in any snippet, we return only the first error and
 * we don't even consider any parsing errors in the remaining snippets for simplicity.
 */
export declare function buildSourceCodes(filePath: string): SourceCode[] | AnalysisError;
