import React, { Component } from 'react';
import './Form.css';

// ETHEREUM_CLIENT.fromWei(ETHEREUM_CLIENT.eth.getBalance(ETHEREUM_CLIENT.eth.coinbase), "ether");
// function checkAllBalances() {
//     var totalBal = 0;
//     for (var acctNum in ETHEREUM_CLIENT.eth.accounts) {
//         var acct = ETHEREUM_CLIENT.eth.accounts[acctNum];
//         var acctBal = ETHEREUM_CLIENT.fromWei(ETHEREUM_CLIENT.eth.getBalance(acct), "ether");
//         totalBal += parseFloat(acctBal);
//         console.log("  eth.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal + " ether");
//     }
//     console.log("  Total balance: " + totalBal + " ether");
//};
//checkAllBalances();

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ids: [],
            firstNames: [],
            lastNames: [],
            ages: [],
            id: '',
            newFName: '',
            newLName: '',
            newAge: '',
            buttonTitle: 'Add Person',
            buttonAction: 'push'
        }
    }

    componentWillMount() {
        this.getPeopleList();
    }

    render() {

        let peopleList = [];

        if (this.state.ids[0] === '') {
            peopleList.unshift(
                <div className="list__row-wrap">
                    <div className="list--empty">
                        List is empty
                    </div>
                </div>
            );
        } else {
            this.state.ids.forEach((item, i) => {
                peopleList.unshift(
                    <div className="list__row-wrap">
                        <div className="list__row"  id={this.state.ids[i]}>
                            <div className="list__30">{this.hexToAscii(this.state.firstNames[i])}</div>
                            <div className="list__30">{this.hexToAscii(this.state.lastNames[i])}</div>
                            <div className="list__30">{this.state.ages[i]}</div>
                        </div>
                        <div>
                            <div className="list__5"
                                 onClick={event => {this.removePerson(event.target.parentNode.previousSibling)}}>
                                    X
                            </div>
                            <div className="list__edit"
                                 onClick={event => {this.editButton(event.target)}}>
                                    edit
                            </div>
                        </div>
                    </div>
                );
            });
        }

        return (
            <div className="form">
                <div className="form__row-wrap">
                    <div className="form__row">
                        <input className="form__input30"
                               value={this.state.newFName}
                               placeholder='First Name'
                               onChange={event => this.setState({newFName: event.target.value})}/>

                        <input className="form__input30"
                               value={this.state.newLName}
                               placeholder='Last Name'
                               onChange={event => this.setState({newLName: event.target.value})}/>

                        <input className="form__input30"
                               value={this.state.newAge}
                               placeholder='Age' type="number"
                               onChange={event => this.setState({newAge: event.target.value})}/>
                    </div>
                </div>
                <input type="button" className="form__button" value={this.state.buttonTitle} onClick={() => this.processSubmit()}/>
            </div>
        );
    }
}

export default Form;
