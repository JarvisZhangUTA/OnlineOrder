import React from 'react';
import SweetAlert from 'sweetalert-react';
import $ from 'jquery';
import './Item.css';

class Items extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            business: {
                _id: '',
                name: '',
                catalog: []
            },
            cur_catalog: -1,
            new_catalog: {
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

        $(document).ready(function() {
            $('select').material_select();
        });

        this.loadBusiness();

        this.addCatalog = this.addCatalog.bind(this);
        this.removeCatalog = this.removeCatalog.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.updateBusiness = this.updateBusiness.bind(this);

        this.onNewCatalogChange = this.onNewCatalogChange.bind(this);
        this.onNewItemNameChange = this.onNewItemNameChange.bind(this);
        this.onNewItemPriceChange = this.onNewItemPriceChange.bind(this);
    }

    setCurCatalog(index) {
        this.setState({
            cur_catalog: index
        })
    }

    removeCatalog() {
        let index = this.state.cur_catalog;
        if(index >= 0) {
            let business = this.state.business;
            this.state.business.catalog.splice(index, 1);

            if(this.state.business.catalog.length <= index) {
                index = this.state.business.catalog.length - 1;
            }

            this.setState({business, cur_catalog:index});

            this.updateBusiness();
        }
    }

    addCatalog() {
        const business = this.state.business;
        business.catalog.push(this.state.new_catalog);
        this.setState({
            business: business,
            new_catalog: {
                name: '',
                item: []
            }
        })
        this.updateBusiness();
    }

    onNewCatalogChange(e) {
        let new_catalog = this.state.new_catalog;
        new_catalog.name = e.target.value;
        this.setState({
            new_catalog
        })
    }

    removeItem(index) {
        const business = this.state.business;
        business.catalog[this.state.cur_catalog].splice(index, 1);
        this.setState({business});
        this.updateBusiness();
    }

    addItem() {
        const business = this.state.business;
        const item = this.state.new_item;
        business.catalog[this.state.cur_catalog].item.push(item);
        this.setState({
            business,
            new_item: {
                name: '',
                price: ''
            }
        });
        this.updateBusiness();
    }

    onNewItemNameChange(e) {
        let new_item = this.state.new_item;
        new_item.name = e.target.value;
        this.setState({new_item});
    }

    onNewItemPriceChange(e) {
        let new_item = this.state.new_item;
        new_item.price = e.target.value;
        this.setState({new_item});
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
        const catalog_list = this.state.business.catalog.map((catalog, index) => {
            return (
                <a className="collection-item" onClick={() => this.setCurCatalog(index)}>
                    {catalog.name}
                </a>
            );
        });

        const catalog_section =  (
            <div>
                <ul className="collection">
                    <li className="collection-item">
                        <h6>Catalog</h6>
                    </li>
                    <li className="collection-item">
                        <div className="row clear-margin">
                            <div className="col m6 s12 clear-margin">
                                <input placeholder="name" type="text" className="validate clear-margin" 
                                    value={this.state.new_catalog.name}
                                    onChange={this.onNewCatalogChange}/>
                            </div>
                            <div className="col m6 s12 clear-margin">
                                <a onClick={this.addCatalog} class="waves-effect btn">Add</a>
                            </div>
                        </div>
                    </li>
                    {catalog_list}
                </ul>
            </div>
        );

        const item_list = this.state.cur_catalog >= 0 ? 
        this.state.business.catalog[this.state.cur_catalog].item.map((item, index) => {
            return (
                <tr>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>
                        <a onClick={() => this.removeItem(index)} class="waves-effect btn-flat">
                            Remove
                        </a>
                    </td>
                </tr>
            );
        }): ('');

        const item_section = this.state.cur_catalog >= 0 ? (
            <div>
            <div className="card">
                <div className="card-content">
                    <div className="card-title">
                        <span>{this.state.business.catalog[this.state.cur_catalog].name}</span>
                        <a onClick={this.removeCatalog} class="waves-effect btn-flat btn">Remove</a>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-content">
                    <div className="row clear-margin">
                        <div className="col m3 s12 clear-margin">
                            <input placeholder="item name" type="text" className="validate clear-margin"
                                onChange={this.onNewItemNameChange}
                                value={this.state.new_item.name}/>
                        </div>
                        <div className="col m3 s12 clear-margin">
                            <input placeholder="item price" type="text" className="validate clear-margin" 
                                onChange={this.onNewItemPriceChange}
                                value={this.state.new_item.price}/>
                        </div>
                        <div className="col m3 s12">
                            <a onClick={this.addItem} class="col s12 waves-effect btn">Add</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-content">
                    <div className="card-title">Items</div>
                    <table>
                        <tbody>
                            {item_list}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        ) : ("");

        return (
            <div className="container">
                <br/>
                <div className="row">
                    <div className="col s12 m6">
                        {catalog_section}
                    </div>
                    <div className="col s12 m6">
                        {item_section}
                    </div>
                </div>

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

                if(this.state.cur_catalog === -1 && business.catalog.length > 0){
                    this.setState({cur_catalog: 0});
                }
            });
    }
} 

export default Items;