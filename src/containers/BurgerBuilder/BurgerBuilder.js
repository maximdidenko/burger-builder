import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false, 
        error: false
    }

    componentDidMount() {
        axios.get('/ingredients.json').then(response => {
            this.setState({ ingredients: response.data });
            this.updatePurchaseState(response.data);
        })
        .then(error => {
            this.setState({ error: true });
        });
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(key => ingredients[key])
            .reduce((prev, next) => prev + next, 0);

        this.setState({ purchaseable: sum > 0 })
    }

    addIngredienthandler = (type) => {
        const count = this.state.ingredients[type] + 1;
        const ingredients = {
            ...this.state.ingredients,
            [type]: count
        };
        const totalPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({ ingredients, totalPrice });
        this.updatePurchaseState(ingredients);
    }

    removeIngredientHandler = (type) => {
        if (this.state.ingredients[type] === 0) {
            return;
        }

        const count = this.state.ingredients[type] - 1;
        const ingredients = {
            ...this.state.ingredients,
            [type]: count
        };
        const totalPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({ ingredients, totalPrice });
        this.updatePurchaseState(ingredients);
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Max',
                address: {
                    street: 'Test',
                    country: 'Test',
                    zipCode: 123
                },
                email: 'test@test.com'
            }
        };
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, purchasing: false });
            })
            .catch(error => {
                this.setState({ loading: false, purchasing: false });
            });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] === 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Can't load ingredients</p> : <Spinner />

        if (this.state.ingredients) {
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        ingredientAdded={this.addIngredienthandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purchaseHandler}
                    />
                </Auxiliary>
            );

            orderSummary = (
                <OrderSummary 
                    ingredients={this.state.ingredients}
                    totalPrice={this.state.totalPrice}
                    cancel={this.purchaseCancelHandler}
                    continue={this.purchaseContinueHandler}
                />
            );
        }

        if(this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Auxiliary>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
