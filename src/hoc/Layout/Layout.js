import React, { Component } from 'react';
import Auxiliary from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';

class Layout extends Component {
    state = {
        showSideDrower: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrower: false });
    }

    sideDrawerToggleHandler = () => {
        this.setState((prevSate) => {
            return { showSideDrower: !prevSate.showSideDrower };
        });
    }

    render() {
        return (
            <Auxiliary>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    open={this.state.showSideDrower} 
                    closed={this.sideDrawerClosedHandler} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxiliary>
        );
    }   
}

export default Layout;