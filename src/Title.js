import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

const AddButton = () => (
  <div style={{ display: 'inline-block' }}>
    <i className="fa fa-plus" /> Add
  </div>
);

export default class Title extends Component {
  handleSelect(type) {
    this.props.handleSelect(type);
  }

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            Manage Folders/Files using ReactJS
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight onSelect={k => this.handleSelect(k)}>
          <NavDropdown title={<AddButton />} id="basic-nav-dropdown" noCaret>
            <MenuItem eventKey="folder">Folder</MenuItem>
            <MenuItem eventKey="file">File</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}
