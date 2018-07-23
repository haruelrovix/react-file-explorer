import React, { Component, Fragment } from 'react';
import {
  Alert,
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Modal
} from 'react-bootstrap';
import SplitPane from 'react-split-pane';
import { toggleExpandedForAll, addNodeUnderParent, getNodeAtPath } from 'react-sortable-tree';
import Demo from './Demo';
import Editor from './Editor';
import Title from './Title';

import treeData from './defaultTreeData';

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentNode: null,
      isModalDisplayed: false,
      newNodeName: '',
      newNodeType: '',
      pathStatus: '',
      treeData
    };

    this.addNode = this.addNode.bind(this);
    this.editorRef = this.editorRef.bind(this);
    this.expand = this.expand.bind(this);
    this.getNewTreeData = this.getNewTreeData.bind(this);
    this.getNodeKey = this.getNodeKey.bind(this);
    this.getVisibleNodeInfo = this.getVisibleNodeInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.inputNodeName = this.inputNodeName.bind(this);
    this.onChangeTreeData = this.onChangeTreeData.bind(this);
    this.toggleDisplayedModal = this.toggleDisplayedModal.bind(this);

    this.isOKButtonDisabled = true;
    this.shouldDisplayError = false;
    this.shouldUpdatePathStatus = false;
  }

  componentDidMount() {
    if (this._editor) {
      this._editor.set(treeData);
      this._editor.expandAll();
    }
  }

  addNode() {
    const { currentNode, newNodeType, newNodeName, treeData } = this.state;

    let newNode = { title: newNodeName };

    if (newNodeType === 'folder') {
      newNode = { ...newNode, isDirectory: true };
    }

    let nodeUnderParent = {
      treeData,
      expandParent: true,
      getNodeKey: this.getNodeKey,
      newNode,
    };

    let newTree;
    let updateCurrentNode;

    if (currentNode && currentNode.node && currentNode.node.isDirectory) {
      const path = currentNode.path;

      newTree = addNodeUnderParent({
        ...nodeUnderParent,
        parentKey: path ? path[path.length - 1] : currentNode.treeIndex
      });

      updateCurrentNode = getNodeAtPath({ treeData: newTree.treeData, path: path ? path : [currentNode.treeIndex], getNodeKey: this.getNodeKey });
    } else {
      newTree = addNodeUnderParent(nodeUnderParent);

      updateCurrentNode = getNodeAtPath({ treeData: newTree.treeData, getNodeKey: this.getNodeKey });
    }

    let state = {
      treeData: newTree.treeData,
      isModalDisplayed: false
    };

    if (updateCurrentNode) {
      state = {
        ...state,
        currentNode: updateCurrentNode
      };
    }

    this.setState(state);

    this.isOKButtonDisabled = true;
  }

  getNodeKey({ treeIndex }) {
    return treeIndex;
  }

  handleChange(e) {
    this.setState({ newNodeName: e.target.value });
  }

  inputNodeName(type) {
    this.setState({
      isModalDisplayed: true,
      newNodeName: '',
      newNodeType: type
    });
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

  getValidationState() {
    const { currentNode, newNodeName, newNodeType, treeData } = this.state;

    if (!newNodeName) {
      this.isOKButtonDisabled = true;
      this.shouldDisplayError = false;

      return null;
    }

    if (!currentNode) {
      const isExist = treeData.find(node => {
        if (newNodeType === 'folder') return node.title === newNodeName && node.isDirectory;

        return node.title === newNodeName && !node.isDirectory;
      });

      if (isExist) {
        this.isOKButtonDisabled = true;
        this.shouldDisplayError = true;

        return 'error';
      }

      this.isOKButtonDisabled = false;
      this.shouldDisplayError = false;

      return null;
    }

    const isExist = currentNode.node.children.find(node => {
      if (newNodeType === 'folder') return node.title === newNodeName && node.isDirectory;

      return node.title === newNodeName && !node.isDirectory;
    });

    if (isExist) {
      this.isOKButtonDisabled = true;
      this.shouldDisplayError = true;

      return 'error';
    }

    this.isOKButtonDisabled = false;
    this.shouldDisplayError = false;

    return null;
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

  renderAddNodeModal() {
    const { currentNode, isModalDisplayed, newNodeName, newNodeType } = this.state;

    return (
      currentNode && currentNode.node && !currentNode.node.isDirectory ?
      <Modal show={isModalDisplayed}>
        <Modal.Body>
          <Alert bsStyle="warning" onDismiss={this.toggleDisplayedModal}>
            <strong>Oops!</strong> {currentNode.node.title} is not a folder.
          </Alert>
        </Modal.Body>
      </Modal>
      : <Modal show={isModalDisplayed} onHide={this.toggleDisplayedModal}>
        <Modal.Header>
          <Modal.Title>Add New {capitalizeFirstLetter(newNodeType)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup controlId="formAddNode" validationState={this.getValidationState()}>
              <Col componentClass={ControlLabel} sm={3}>
                Input {newNodeType} name
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  value={newNodeName}
                  placeholder="Enter text"
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
                {this.shouldDisplayError && <HelpBlock>{newNodeName} is already taken.</HelpBlock>}
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.toggleDisplayedModal}>Close</Button>
          <Button onClick={this.addNode} disabled={this.isOKButtonDisabled}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  toggleDisplayedModal() {
    this.setState({ isModalDisplayed: !this.state.isModalDisplayed });
  }

  render() {
    const { treeData, isModalDisplayed } = this.state;

    return (
      <Fragment>
        <Title handleSelect={this.inputNodeName} />
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
        {isModalDisplayed && this.renderAddNodeModal()}
      </Fragment>
    );
  }
}

export default App;
