import React, { Component } from 'react';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
        <nav className="navbar navbar-dark bg-dark fixed-top flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            href="http://localhost:3000/"
            rel="noopener noreferrer"
          >
            <h2>CB Marketplace</h2>
          </a>
         <ul className="navbar-nav px-3">
             <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="badge badge-dark"><span>Account: {this.props.account}</span></small>
             </li>
         </ul>
        </nav>
         );
    }
}
 
export default Navbar;


