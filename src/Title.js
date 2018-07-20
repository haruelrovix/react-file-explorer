import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

const AddButton = () => (
  <div style={{ display: 'inline-block' }}>
    <i className="fa fa-plus" /> Add
  </div>
);

export default class Title extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            Manage Folders/Files using ReactJS
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavDropdown eventKey={3} title={<AddButton />} id="basic-nav-dropdown" noCaret>
            <MenuItem eventKey={3.1}>Folder</MenuItem>
            <MenuItem eventKey={3.2}>File</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}
