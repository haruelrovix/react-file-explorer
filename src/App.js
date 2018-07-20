import React, { Component, Fragment } from 'react';
import SplitPane from 'react-split-pane';
import { toggleExpandedForAll } from 'react-sortable-tree';
import Demo from './Demo';
import Editor from './Editor';
import Title from './Title';

import treeData from './defaultTreeData';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData,
      pathStatus: ''
    };

    this.addNode = this.addNode.bind(this);
    this.editorRef = this.editorRef.bind(this);
    this.expand = this.expand.bind(this);
    this.getNewTreeData = this.getNewTreeData.bind(this);
    this.getVisibleNodeInfo = this.getVisibleNodeInfo.bind(this);
    this.onChangeTreeData = this.onChangeTreeData.bind(this);
  }

  componentDidMount() {
    if (this._editor) {
      this._editor.set(treeData);
      this._editor.expandAll();
    }
  }

  addNode(type) {
    // console.log({type});
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

  getVisibleNodeInfo(node) {
    this.setState({ pathStatus: node.path.join(' > ') })
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
