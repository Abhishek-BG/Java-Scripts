import { YamlVisitorPredicate } from 'parsing/yaml';
/**
 * Checks if the given YAML AST node is an AWS Lambda or Serverless function
 */
export declare const isAwsFunction: YamlVisitorPredicate;
