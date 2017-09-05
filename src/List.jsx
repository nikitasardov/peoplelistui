import React, { Component } from 'react';
import './List.css';

class List extends Component {

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
            newAge: ''
        }
    }

    // функция для получения списка из блокчейна
    getPeopleList() {
        let data = this.props.peopleContract.getPeople();
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
        );
    }
}

export default List;
