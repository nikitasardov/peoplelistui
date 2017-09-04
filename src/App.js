import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
//import _ from 'lodash';

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://91.201.41.52:8545"));

var peopleContractABI = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"id","type":"uint256"},{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"payable":false,"type":"function"}];

var peopleContractAddress = '0x737aa453e1eda4ef37366ab80c5e4188a06e2db5';

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
            ids: [],
            firstNames: [],
            lastNames: [],
            ages: [],
            newId: '',
            newFName: '',
            newLName: '',
            newAge: ''
        }
    }

    pushPerson() {
        peopleContract
            .addPerson
            .sendTransaction(
                parseInt(Date.now()),
                this.state.newFName,
                this.state.newLName,
                this.state.newAge,
                {
                    from: ETHEREUM_CLIENT.eth.accounts[0],
                    gas: 3000000
                });
        this.getPeopleList();
    }

    getPeopleList() {
        let data = peopleContract.getPeople();
        // console.log(data);
        this.setState({
            ids: String(data[0]).split(','),
            firstNames: String(data[1]).split(','),
            lastNames: String(data[2]).split(','),
            ages: String(data[3]).split(',')
        });
    }

    componentWillMount() {
        this.getPeopleList();
    }

    render() {
        let peopleList = [];

        let hexToAscii = function(hex) {
            var str = '',
                i = 0,
                l = hex.length;
            if (hex.substring(0, 2) === '0x') {
                i = 2;
            }
            for (; i < l; i+=2) {
                var code = parseInt(hex.substr(i, 2), 16);
                if (code === 0) continue; // this is added
                str += String.fromCharCode(code);
            }
            return str;
        };

        this.state.firstNames.forEach((item, i) => {
            peopleList.unshift(
                <div className="list__row-wrap">
                    <div className="list__row">
                        <div className="list__30">{hexToAscii(this.state.firstNames[i])}</div>
                        <div className="list__30">{hexToAscii(this.state.lastNames[i])}</div>
                        <div className="list__30">{this.state.ages[i]}</div>
                    </div>
                    <div className="list__5" data-id={this.state.ids[i]}>X</div>
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
                    <div className="list__row-wrap">
                        <div className="list list__row">
                            <input className="list__30" value={this.state.newFName} placeholder='First Name' onChange={event => this.setState({newFName: event.target.value})}/>
                            <input className="list__30" placeholder='Last Name' onChange={event => this.setState({newLName: event.target.value})}/>
                            <input className="list__30" placeholder='Age' type="number" onChange={event => this.setState({newAge: event.target.value})}/>
                        </div>
                        <div className="list__5--head"></div>
                    </div>

                    <button onClick={() => this.pushPerson()}>
                        Submit
                    </button>

                    <div className="list">
                        <div className="list__row-wrap">
                            <div className="list__row list__head">
                                <div className="list__30">First Name</div>
                                <div className="list__30">Last Name</div>
                                <div className="list__30">Age</div>
                            </div>
                            <div className="list__5--head"></div>
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
