import React, { Component, Fragment } from 'react';
import SplitPane from 'react-split-pane';
import { toggleExpandedForAll, addNodeUnderParent, getNodeAtPath } from 'react-sortable-tree';
import Demo from './Demo';
import Editor from './Editor';
import Title from './Title';

import treeData from './defaultTreeData';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData,
      currentNode: null,
      pathStatus: ''
    };

    this.addNode = this.addNode.bind(this);
    this.editorRef = this.editorRef.bind(this);
    this.expand = this.expand.bind(this);
    this.getNewTreeData = this.getNewTreeData.bind(this);
    this.getNodeKey = this.getNodeKey.bind(this);
    this.getVisibleNodeInfo = this.getVisibleNodeInfo.bind(this);
    this.onChangeTreeData = this.onChangeTreeData.bind(this);

    this.shouldUpdatePathStatus = false;
  }

  componentDidMount() {
    if (this._editor) {
      this._editor.set(treeData);
      this._editor.expandAll();
    }
  }

  getNodeKey({ treeIndex }) {
    return treeIndex;
  }

  addNode(type) {
    const { currentNode } = this.state;

    if (currentNode && currentNode.node && currentNode.node.isDirectory) {
      let newNode = { title: `${type} 99` };

      if (type === 'folder') {
        newNode = { ...newNode, isDirectory: true };
      }

      const path = currentNode.path;

      this.setState(state => ({
        treeData: addNodeUnderParent({
          treeData: state.treeData,
          parentKey: path[path.length - 1],
          expandParent: true,
          getNodeKey: this.getNodeKey,
          newNode,
        }).treeData,
      }));
    }
  }

  onChangeTreeData(treeData) {
    if (this._editor) {
      this._editor.set(treeData);
      this.setState({
        treeData,
      });
    }
  }

  getNewTreeData() {
    if (this._editor) {
      this.setState({
        treeData: this._editor.get(),
      });
    }
  }

  editorRef(editor) {
    this._editor = editor;
  }

  expand(expanded) {
    const newTreeData = toggleExpandedForAll({
      treeData: this.state.treeData,
      expanded,
    });

    this._editor.set(newTreeData);

    this.setState({
      treeData: newTreeData,
    });
  }

  getVisibleNodeInfo(currentNode) {
    const { treeData } = this.state;

    if ( currentNode && currentNode.path ) {
      let path = [...currentNode.path];
      const joinPath = currentNode.path.map(() => {
        const { node } = getNodeAtPath({ treeData, path, getNodeKey: this.getNodeKey });
        path.pop();

        return node && node.title;
      });

      this.setState({
        currentNode,
        pathStatus: joinPath.reverse().join(' > ')
      });
    }
  }

  render() {
    const { treeData } = this.state;

    return (
      <Fragment>
        <Title handleSelect={this.addNode} />
        <SplitPane split="vertical" minSize="30%">
          <Demo
            onChangeTreeData={this.onChangeTreeData}
            treeData={treeData}
            expand={this.expand}
            getVisibleNodeInfo={this.getVisibleNodeInfo}
          />
          <div style={{ padding: '0 12px 12px' }}>
            {this.state.pathStatus}
            <div style={{ visibility: 'hidden' }}>
              <Editor onChange={this.getNewTreeData} editorRef={this.editorRef} />
            </div>
          </div>
        </SplitPane>
      </Fragment>
    );
  }
}

export default App;
