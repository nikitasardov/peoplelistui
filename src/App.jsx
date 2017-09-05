import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import Form from './Form';
import List from './List';

// подключение к ноде эфириума
var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://91.201.41.52:8545"));

// abi контракта (при обновлении можно взять из json, сгенерированного в truffle)
var peopleContractABI = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"newFirstName","type":"bytes32"},{"name":"newLastName","type":"bytes32"},{"name":"newAge","type":"uint256"}],"name":"updatePerson","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"dropPerson","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"id","type":"uint256"},{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"payable":false,"type":"function"}];

// адрес контракта (при обновлении можно взять из json, сгенерированного в truffle)
var peopleContractAddress = '0xb5008265f7ea9b584d61f4644edfa160e3d2aab6';

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

            // контракт People
            peopleContract: ETHEREUM_CLIENT.eth.contract(peopleContractABI).at(peopleContractAddress)
        }
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
   /* pushPerson() {
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
*/
    // обновить элемент
  /*  updatePersonData() {
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
    }*/

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
/*    removePerson(row) {
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
    }*/

    componentWillMount() {
        //this.getPeopleList();
    }

    render() {

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>CRUD dApp built with React</h2>
                </div>
                <div className="App-content">
          {/*          <Form />*/}
                    <List peopleContract={this.state.peopleContract}/>
                </div>
            </div>
        );
    }
}

export default App;
