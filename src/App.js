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
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstNames: [],
            lastNames: [],
            ages: []
        }
    }

    pushPerson(/*_firstName, _lastName, _age*/) {
        peopleContract.addPerson('asdasda','asdasd',56);
        //peopleContract.addPerson(/*_firstName, _lastName, _age*/'asdasda','asdasd',56);
        //this.setState({deadline: this.state.newDeadline})
    }

    componentWillMount() {
        var data = peopleContract.getPeople();

        this.setState({
            firstNames: String(data[0]).split(','),
            lastNames: String(data[1]).split(','),
            ages: String(data[2]).split(',')
        });
    }

    render() {
        var TableRows = [];

        var hex_to_ascii = function(str1) {
            var hex  = str1.toString();
            var str = '';
            for (var n = 0; n < hex.length; n += 2) {
                str += parseInt(hex.substr(n, 2), 16) === 0 ? '' : String.fromCharCode(parseInt(hex.substr(n, 2), 16));
              //str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
            }
            return str;
        };

        _.each(this.state.firstNames, (val,i) => {
            TableRows.push(
                <tr>
                    <td>{hex_to_ascii(this.state.firstNames[i])}</td>
                    <td>{hex_to_ascii(this.state.lastNames[i])}</td>
                    <td>{this.state.ages[i]}</td>
                </tr>
            );
        });

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to dApp built with React</h2>
                </div>
                <div className="App-content">

                    <table className="table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TableRows}
                        </tbody>
                    </table>

                    <input placeholder='First Name'/>
                    <input placeholder='Last Name'/>
                    <input placeholder='Age'/>

                    <button onClick={() => this.pushPerson()}>
                        Submit
                    </button>

                </div>
            </div>
        );
    }
}

export default App;
