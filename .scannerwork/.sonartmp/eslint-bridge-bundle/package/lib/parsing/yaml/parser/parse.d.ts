import { EmbeddedJS } from './embedded-js';
import { AnalysisError } from 'services/analysis';
/**
 * A function predicate to visit a YAML node
 */
export declare type YamlVisitorPredicate = (key: any, node: any, ancestors: any) => boolean;
/**
 * Parses YAML file and extracts JS code according to the provided predicate
 */
export declare function parseYaml(predicate: YamlVisitorPredicate, filePath: string): EmbeddedJS[] | AnalysisError;
