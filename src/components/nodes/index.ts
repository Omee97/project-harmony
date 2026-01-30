import InputNode from './InputNode';
import OutputNode from './OutputNode';
import LLMNode from './LLMNode';
import TextNode from './TextNode';
import APINode from './APINode';
import TransformNode from './TransformNode';
import FilterNode from './FilterNode';
import MergeNode from './MergeNode';
import ConditionNode from './ConditionNode';

export const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  llmNode: LLMNode,
  textNode: TextNode,
  apiNode: APINode,
  transformNode: TransformNode,
  filterNode: FilterNode,
  mergeNode: MergeNode,
  conditionNode: ConditionNode,
};

export {
  InputNode,
  OutputNode,
  LLMNode,
  TextNode,
  APINode,
  TransformNode,
  FilterNode,
  MergeNode,
  ConditionNode,
};
