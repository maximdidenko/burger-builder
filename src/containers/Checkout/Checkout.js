import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state={
        ingredients: null,
        price: 0
    };

    componentWillMount() {
        const queryParams = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 0;
        for (let [key, value] of queryParams) {
            key === 'price' ? price = Number(value) : ingredients[key] = Number(value);
        }
        this.setState({ ingredients, price });
    }

    checkoutCanceledhandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCanceled={this.checkoutCanceledhandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                />
                <Route 
                    path={`${this.props.match.path}/contact-data`} 
                    render={(props) => <ContactData ingredients={this.state.ingredients} totalPrice={this.state.price} {...props} />} />
            </div>
        );
    }
}

export default Checkout;