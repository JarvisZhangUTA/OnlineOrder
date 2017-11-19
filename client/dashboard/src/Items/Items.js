import React from 'react';
import Validator from 'validator';
import SweetAlert from 'sweetalert-react';
import './Item.css';

class Items extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            business: {
                _id: '',
                name: '',
                item: []
            },
            new_item: {
                name: '',
                price: ''
            },
            alert: {
                show: false,
                title: '',
                text: ''
            }
        };

        this.loadBusiness();

        this.changeName = this.changeName.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.updateBusiness = this.updateBusiness.bind(this);
    }

    changeName(event) {
        const new_item = this.state.new_item;
        new_item.name = event.target.value;
        this.setState({new_item});
    }

    changePrice(event) {
        const new_item = this.state.new_item;
        new_item.price = event.target.value;
        this.setState({new_item});
    }

    removeItem(index) {
        const business = this.state.business;
        business.item.splice(index, 1);
        this.setState({business});
    }

    addItem() {
        const item = this.state.new_item;
        
        if( !Validator.isNumeric(item.price) && !Validator.isDecimal(item.price)) {
            this.alert('Error happened', 'Price invalid');
            return;
        }

        if(Validator.isEmpty(item.name)) {
            this.alert('Error happened', 'Empty name');
            return;
        }

        const business = this.state.business;
        business.item.push(item);
        this.setState({
            business: business,
            new_item: {
                name: '',
                price: '',
                tags: []
            }
        })
    }

    updateBusiness() {
        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/business/update';
        const token = localStorage.getItem('token');

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'XXX ' + token
            },
            body: JSON.stringify(this.state.business)
        }).then(response=>{
            if(response.status === 200){
                this.alert('Success', 'Change Saved');
            } else {
                // 失败
                response.json().then((res)=>{
                    this.alert('Error Happened', res.error);
                });
            }
        });
    }

    alert(title, text) {
        this.setState({
            alert: {
                show: true,
                title: title,
                text: text
            }
        });
    }

    render() {
        const item_list = this.state.business.item.map(
            (i, index) => {
                return (
                    <tr>
                        <td>{i.name}</td>
                        <td>{i.price}</td>
                        <td>
                            
                        </td>
                        <td>
                            <a onClick={() => this.removeItem(index)} class="waves-effect waves-teal btn-flat">
                                Remove
                            </a>
                        </td>
                    </tr>
                );
            }
        );

        return (
            <div className="container">
                <br/>
                <div className="row">
                    <div className="col m4 s12">
                        <input placeholder="item name" type="text"
                            onChange={this.changeName}
                            className="validate" value={this.state.new_item.name}/>
                    </div>
                    <div className="col m4 s12">
                        <input placeholder="item price" type="text"
                            onChange={this.changePrice}
                            className="validate" value={this.state.new_item.price}/>
                    </div>
                    <div className="col m2 s12">
                        <a onClick={this.addItem} class="col s12 waves-effect waves-teal btn">Add Item</a>
                    </div>
                    <div className="col m2 s12">
                        <a onClick={this.updateBusiness} class="col s12 waves-effect waves-teal btn">Save Change</a>
                    </div>
                </div>
                <table className="highlight" >
                    <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {item_list}
                    </tbody>
                </table>

                <SweetAlert
                    show={this.state.alert.show}
                    title={this.state.alert.title}
                    text={this.state.alert.text}
                    onConfirm={() => this.setState({ alert:{show: false}})}
                />
            </div>
        );
    }

    loadBusiness(){
        const id = localStorage.getItem('id');
        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/business/info/' + id;
        const request = new Request(url, {method: 'GET'});

        fetch(request)
            .then((res) => res.json())
            .then((business) => {
                this.setState({
                    business: business
                });
            });
    }
} 

export default Items;