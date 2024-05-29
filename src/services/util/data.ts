//转换树
export const formatData = (nodes: any, nodeId: string) => {
  let obj: any = {
    ...nodes[nodeId],
    key: nodeId,
    label: nodes[nodeId].name,
    children: [],
  };
  let arr = nodes[nodeId].sortList || nodes[nodeId].children;
  if (arr && arr.length > 0) {
    arr.forEach((item: any) => {
      let nodeItem = formatData(nodes, item);
      obj.children.push(nodeItem);
    });
  }
  return obj;
};
