import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './Form.css';
import Web3 from 'web3';
//import _ from 'lodash';

// подключение к ноде эфириума
var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://91.201.41.52:8545"));

// abi контракта (при обновлении можно взять из json, сгенерированного в truffle)
var peopleContractABI = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"newFirstName","type":"bytes32"},{"name":"newLastName","type":"bytes32"},{"name":"newAge","type":"uint256"}],"name":"updatePerson","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"dropPerson","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"id","type":"uint256"},{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"payable":false,"type":"function"}];

// адрес контракта (при обновлении можно взять из json, сгенерированного в truffle)
var peopleContractAddress = '0xb5008265f7ea9b584d61f4644edfa160e3d2aab6';

// контракт People
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
            id: '',
            newFName: '',
            newLName: '',
            newAge: '',
            buttonTitle: 'Add Person',
            buttonAction: 'push'
        }
    }

    // функция для получения списка из блокчейна
    getPeopleList() {
        let data = peopleContract.getPeople();
        console.log('getPeopleList() : peopleContract.getPeople(); answer:', data);
        if (document.getElementsByClassName('list__edit--inprogress').length !== 0) {
            document.getElementsByClassName('list__edit--inprogress')[0].classList.remove('list__edit--inprogress');
        }

        if (document.getElementsByClassName('form__row--error').length !== 0) {
            document.getElementsByClassName('form__row--error')[0].classList.remove('form__row--error');
        }
        this.setState({
            ids: String(data[0]).split(','),
            firstNames: String(data[1]).split(','),
            lastNames: String(data[2]).split(','),
            ages: String(data[3]).split(','),
            newFName: '',
            newLName: '',
            newAge: '',
            buttonTitle: 'Add Person',
            buttonAction: 'push'
        });
    }

    // функция для выбора действия кнопки "submit"
    processSubmit() {
        switch(this.state.buttonAction) {
            case 'push' :
                this.pushPerson();
                break;
            case 'update' :
                this.updatePersonData();
                break;
        }
    }

    // добавить элемент в список
    pushPerson() {
        if (this.state.newFName === '' ||
            this.state.newLName === '' ||
            this.state.newAge === '') {

                let form = document.getElementsByClassName('form__row')[0];
                form.classList.add('form__row--error');

                setTimeout(() => {
                    form.classList.remove('form__row--error');
                },1000);

                console.log('nothing');
                return false;
            }
        console.log('pushPerson() : peopleContract.addPerson.sendTransaction(parseInt(Date.now()),this.state.newFName,this.state.newLName,this.state.newAge,{from: ETHEREUM_CLIENT.eth.accounts[0],gas: 3000000});');
        peopleContract
            .addPerson
            .sendTransaction(
                parseInt(Date.now()),
                this.asciiToHex(this.state.newFName),
                this.asciiToHex(this.state.newLName),
                this.state.newAge,
                {
                    from: ETHEREUM_CLIENT.eth.accounts[0],
                    gas: 3000000
                });
        this.getPeopleList();
    }

    // обновить элемент
    updatePersonData() {
        console.log('updatePersonData() : peopleContract.updatePerson.sendTransaction(this.state.id,this.state.newFName,this.state.newLName,this.state.newAge,{from: ETHEREUM_CLIENT.eth.accounts[0],gas: 3000000});');
        peopleContract
            .updatePerson
            .sendTransaction(
                this.state.id,
                this.asciiToHex(this.state.newFName),
                this.asciiToHex(this.state.newLName),
                this.state.newAge,
                {
                    from: ETHEREUM_CLIENT.eth.accounts[0],
                    gas: 3000000
                });
        this.getPeopleList();
    }

    // функция для выбора действия кнопки "edit"
    editButton(button) {
        if (!button.classList.contains('list__edit--inprogress')) {

            if (document.getElementsByClassName('list__edit--inprogress').length !== 0) {
                document.getElementsByClassName('list__edit--inprogress')[0].classList.remove('list__edit--inprogress');
            }
            button.classList.add('list__edit--inprogress');

            if (document.getElementsByClassName('form__row--error').length !== 0) {
                document.getElementsByClassName('form__row--error')[0].classList.remove('form__row--error');
            }
            button.parentNode.previousSibling.classList.add('form__row--error');

            this.editPerson(button.parentNode.previousSibling);
        } else {

            button.classList.remove('list__edit--inprogress');
            button.parentNode.previousSibling.classList.remove('form__row--error');

            this.cancelEditing(button.parentNode.previousSibling);
        }
    }

    // функция для перехода в режим редактирования элемента списка
    editPerson(row) {
        this.setState({
            id: row.id,
            newFName: row.childNodes[0].innerHTML,
            newLName: row.childNodes[1].innerHTML,
            newAge: row.childNodes[2].innerHTML,
            buttonTitle: 'Update Person',
            buttonAction: 'update'
        });
    }

    // функция отмены режима редактирования, возвращает в режим добавления
    cancelEditing(row) {
        this.setState({
            id: '',
            newFName: '',
            newLName: '',
            newAge: '',
            buttonTitle: 'Add Person',
            buttonAction: 'push'
        });
    }

    // функция для удаления элемента из списка
    // (место удаленного элемента займет последний.
    // Нужно добавить сортировку по id при выводе списка)
    removePerson(row) {
        //row.classList.add('form__row--error');
        console.log('removePerson() : peopleContract.dropPerson.sendTransaction(row.id,{from: ETHEREUM_CLIENT.eth.accounts[0],gas: 3000000});');
        peopleContract
            .dropPerson
            .sendTransaction(
                row.id,
                {
                    from: ETHEREUM_CLIENT.eth.accounts[0],
                    gas: 3000000
                });
        this.getPeopleList();
    }

    asciiToHex(str, padding) {
        var hex = '0x';
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }
        return hex + '0'.repeat(padding*2 - hex.length + 2);
    };

    hexToAscii(hex) {
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
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>CRUD dApp built with React</h2>
                </div>
                <div className="App-content">
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

                    <div className="list">
                        <div className="list__row-wrap">
                            <div className="list__row list__head">
                                <div className="list__30">First Name</div>
                                <div className="list__30">Last Name</div>
                                <div className="list__30">Age</div>
                            </div>
                        </div>
                        <div /*className="list__scroll-container"*/>
                            {peopleList}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
