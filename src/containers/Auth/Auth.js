import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import * as actions from '../../store/actions';
import { checkValidity } from '../../shared/utils';

import classes from './Auth.css';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false,
                value: ''
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false,
                value: ''
            }
        },
        isSignup: false
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangeHandler = (event, elementId) => {
        const form = { ...this.state.controls }
        const formElement = { ...form[elementId] };
        formElement.value = event.target.value;
        formElement.valid = checkValidity(event.target.value, formElement.validation);
        formElement.touched = true;
        form[elementId] = formElement;

        this.setState({ controls: form });
    }

    formSubmitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => { 
            return { isSignup: !prevState.isSignup }
        });
    }

    render () {
        const formElementsArray = [];
        
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(el => (
            <Input 
                key={el.id} 
                elementType={el.config.elementType} 
                elementConfig={el.config.elementConfig}
                value={el.config.value}
                onChange={(e) => this.inputChangeHandler(e, el.id)}
                invalid={!el.config.valid}
                shouldValidate={!!el.config.validation}
                touched={el.config.touched}
            />
        ));

        if (this.props.loading) {
            form = <Spinner />
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <p className={classes.Error}>{this.props.error.message}</p>
            );
        }

        let redirect = null;
        
        if(this.props.isAuthenticated) {
            redirect = <Redirect to={this.props.authRedirectPath} />
        }
        
        return (
            <div className={classes.Auth}>
                <h2>{this.state.isSignup ? 'Sign Up' : 'Sign In'}</h2>
                <form onSubmit={this.formSubmitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
                {errorMessage}
                {redirect}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirect('/'))
    };
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirect
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
