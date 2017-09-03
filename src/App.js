import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import _ from 'lodash';

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://91.201.41.52:8545"));

var peopleContractABI = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"payable":false,"type":"function"}];

var peopleContractAddress = '0x836dbfdbf39c11064cffd5e6e0c9e198d6448e9a';

var peopleContract = ETHEREUM_CLIENT.eth.contract(peopleContractABI).at(peopleContractAddress);

console.log(peopleContract);

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

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstNames: [],
            lastNames: [],
            ages: [],
            newFName: '',
            newLName: '',
            newAge: ''
        }
    }

    pushPerson() {
        peopleContract
            .addPerson
            .sendTransaction(
                this.state.newFName,
                this.state.newFName,
                this.state.newAge,
                {
                    from: ETHEREUM_CLIENT.eth.accounts[0],
                    gas: 3000000
                });
        this.getPeopleList();
    }

    getPeopleList() {
        var data = peopleContract.getPeople();
        // console.log(data);
        this.setState({
            firstNames: String(data[0]).split(','),
            lastNames: String(data[1]).split(','),
            ages: String(data[2]).split(',')
        });
    }

    componentWillMount() {
        this.getPeopleList();
    }

    render() {
        var peopleList = [];

        var hex_to_ascii = function(str1) {
            var hex  = str1.toString();
            var str = '';
            for (var n = 0; n < hex.length; n += 2) {
                str += parseInt(hex.substr(n, 2), 16) === 0 ? '' : String.fromCharCode(parseInt(hex.substr(n, 2), 16));
              //str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
            }
            return str;
        };
/*
        for(var i = this.state.firstNames.length; i >= 0; i--) {
            peopleList.push(
                <div className="list__row">
                    <div className="list__30">{hex_to_ascii(this.state.firstNames[i])}</div>
                    <div className="list__30">{hex_to_ascii(this.state.lastNames[i])}</div>
                    <div className="list__30">{this.state.ages[i]}</div>
                </div>
            );
        }*/


        _.each(this.state.firstNames, (val,i) => {
            //var r = this.state.firstNames.length - i-1;
            peopleList.unshift(
                <div className="list__row">
                    <div className="list__30">{hex_to_ascii(this.state.firstNames[i])}</div>
                    <div className="list__30">{hex_to_ascii(this.state.lastNames[i])}</div>
                    <div className="list__30">{this.state.ages[i]}</div>
                </div>
            );
        });

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to dApp built with React</h2>
                </div>
                <div className="App-content">
                    <div className="list list__row">
                        <input className="list__30" placeholder='First Name' onChange={event => this.setState({newFName: event.target.value})}/>
                        <input className="list__30" placeholder='Last Name' onChange={event => this.setState({newLName: event.target.value})}/>
                        <input className="list__30" placeholder='Age' onChange={event => this.setState({newAge: event.target.value})}/>
                    </div>

                    <button onClick={() => this.pushPerson()}>
                        Submit
                    </button>

                    <div className="list">
                        <div className="list__row list__head">
                            <div className="list__30">First Name</div>
                            <div className="list__30">Last Name</div>
                            <div className="list__30">Age</div>
                        </div>
                        <div>
                            {peopleList}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
