import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import styles from './Demo.module.css';

const maxDepth = 5;

// const alertNodeInfo = ({ node, path, treeIndex }) => {
//   const objectString = Object.keys(node)
//     .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
//     .join(',\n   ');

//   global.alert(
//     'Info passed to the button generator:\n\n' +
//       `node: {\n   ${objectString}\n},\n` +
//       `path: [${path.join(', ')}],\n` +
//       `treeIndex: ${treeIndex}`
//   );
// };

// const recordCall = (name, args) => {
//   // eslint-disable-next-line no-console
//   console.log(`${name} called with arguments:`, args);
// };

const getDirectoryIcon = isExpanded => isExpanded ? 'fa-folder-open' : 'fa-folder';

const getIcon = ({ node }) => node.isDirectory ? getDirectoryIcon(node.expanded) : 'fa-file-text-o';

export default class Demo extends Component {
  constructor(props) {
    super(props);

    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.selectNextMatch = this.selectNextMatch.bind(this);
    this.selectPrevMatch = this.selectPrevMatch.bind(this);
    this.getNodeKey = this.getNodeKey.bind(this);
    this.getVisibleNodeInfo = this.getVisibleNodeInfo.bind(this);

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { treeData: nextProps.treeData };
  }

  expandAll() {
    this.props.expand(true);
  }

  collapseAll() {
    this.props.expand(false);
  }

  selectPrevMatch() {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1,
    });
  }

  selectNextMatch() {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFocusIndex + 1) % searchFoundCount
          : 0,
    });
  }

  getNodeKey({ node }) {
    return node.title;
  }

  getVisibleNodeInfo(rowInfo) {
    // console.log({rowInfo});
    // const a = getVisibleNodeInfoAtIndex(this.state.treeData, 1, this.getNodeKey);
  }

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      // searchFoundCount,
    } = this.state;

    const { onChangeTreeData } = this.props;

    return (
      <div className={styles.demoWrapper}>
        {/* <div className={styles.buttons}>
          <div>
            <button className="btn btn-primary" onClick={this.expandAll}>
              Expand All
            </button>
            <button className="btn btn-warning" onClick={this.collapseAll}>
              Collapse All
            </button>
          </div>
          <form
            style={{ display: 'inline-block' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event =>
                  this.setState({ searchString: event.target.value })
                }
              />
            </label>

            <button
              className="btn btn-info"
              type="button"
              disabled={!searchFoundCount}
              onClick={this.selectPrevMatch}
            >
              &lt;
            </button>

            <button
              className="btn btn-info"
              type="submit"
              disabled={!searchFoundCount}
              onClick={this.selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              {' / '}
              {searchFoundCount || 0}
            </span>
          </form>
        </div> */}
        <div className={styles.treeWrapper}>
          <SortableTree
            treeData={treeData}
            onChange={onChangeTreeData}
            onMoveNode={({ node, treeIndex, path }) =>
              global.console.debug(
                'node:',
                node,
                'treeIndex:',
                treeIndex,
                'path:',
                path
              )
            }
            // onVisibilityToggle={args => recordCall('onVisibilityToggle', args)}
            maxDepth={maxDepth}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            canDrag={({ node }) => !node.noDragging}
            canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
            searchFinishCallback={matches =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })
            }
            getNodeKey={this.getNodeKey}
            isVirtualized={true}
            generateNodeProps={rowInfo => ({
              icons: [<div style={{ marginRight: '4px' }}><i className={`fa ${getIcon(rowInfo)}`} /></div>],
              buttons: [
                <button
                  className="btn btn-outline-success"
                  style={{
                    verticalAlign: 'middle',
                  }}
                  onClick={() => this.props.getVisibleNodeInfo(rowInfo)}
                >
                  ℹ
                </button>,
              ],
            })}
            theme={FileExplorerTheme}
          />
        </div>
      </div>
    );
  }
}
