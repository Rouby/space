import { DefinitionNode, OperationDefinitionNode } from 'graphql';

export function isOperationDefinition(
  x: DefinitionNode,
): x is OperationDefinitionNode {
  return x.kind === 'OperationDefinition';
}
