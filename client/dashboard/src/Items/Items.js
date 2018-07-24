import React from 'react';
import SweetAlert from 'sweetalert-react';
import { ToastContainer, toast } from 'react-toastify';
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
            new_sub: {
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
        this.onNewSubNameChange = this.onNewSubNameChange.bind(this);
        this.onNewSubPriceChange = this.onNewSubPriceChange.bind(this);
    }

    componentDidUpdate() {
        $('.collapsible').collapsible();
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
        business.catalog[this.state.cur_catalog].item.splice(index, 1);
        this.setState({business});
        this.updateBusiness();
    }

    removeSub(index, index2) {
        const business = this.state.business;
        business.catalog[this.state.cur_catalog].item[index].sub.splice(index2, 1);
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
                price: '',
                sub: []
            }
        });
        this.updateBusiness();
    }

    addSub(index) {
        const business = this.state.business;
        const item = business.catalog[this.state.cur_catalog].item[index];
        const sub = this.state.new_sub;
        if( !item.sub ) item.sub = [];
        item.sub.push(sub);
        this.setState({
            business,
            new_sub: { name: '', price:'' }
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

    onNewSubNameChange(e) {
        let new_sub = this.state.new_sub;
        new_sub.name = e.target.value;
        this.setState({new_sub});
    }

    onNewSubPriceChange(e) {
        let new_sub = this.state.new_sub;
        new_sub.price = e.target.value;
        this.setState({new_sub});
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
                toast('Change Saved');
            } else {
                // 失败
                response.json().then((res)=>{
                    toast('Error Happened:'+res.error);
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

        const catalog_section = (
            <div>
                <ul className="collection">
                    <li className="collection-item">
                        <h6>Catalogs</h6>
                    </li>
                    <li className="collection-item">
                        <div className="row clear-margin">
                            <div className="col m6 s12 clear-margin">
                                <input placeholder="name" type="text" className="validate clear-margin no-margin" 
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

        const item_list = [];

        if( this.state.cur_catalog >= 0 ) {
            this.state.business.catalog[this.state.cur_catalog].item.forEach( (item, idx1) => {

                const sub_list = item.sub && item.sub.length > 0 ? item.sub.map( (sub_item, idx2) => {
                    return (
                        <div className="row"> 
                            <div className="col m4 s12 item-text">
                                {sub_item.name}
                            </div>
                            <div className="col m4 s12 item-text">
                                {sub_item.price}
                            </div>
                            <div className="col m4 s12 item-text">
                                <a onClick={() => this.removeSub(idx1, idx2)} class="waves-effect btn-flat"> Remove </a>
                            </div>
                        </div>
                    );
                }) : ('');

                item_list.push(
                    <li>
                        <div className="collapsible-header">
                            <div className="row full-width no-margin">
                                <div className="col m4 s12 item-text"> 
                                    {item.name} 
                                </div>
                                <div className="col m4 s12 item-text"> 
                                    ${item.price} 
                                </div>
                                <div className="col m4 s12">
                                    <a onClick={() => this.removeItem(idx1)} class="waves-effect btn-flat right-float"> Remove </a>
                                </div>
                            </div>
                        </div>
                        <div class="collapsible-body">
                            <div className="row">
                                <div className="col m4 s12">
                                    <input placeholder="option" type="text" className="validate clear-margin no-margin"
                                        onChange={this.onNewSubNameChange}
                                        value={this.state.new_sub.name}/>
                                </div>
                                <div className="col m4 s12">
                                    <input placeholder="price" type="text" className="validate clear-margin no-margin"
                                        onChange={this.onNewSubPriceChange}
                                        value={this.state.new_sub.price}/>
                                </div>
                                <div className="col m4 s12">
                                    <a onClick={() => this.addSub(idx1)} class="waves-effect btn">Add</a>
                                </div>
                            </div>

                            {sub_list}
                        </div>
                    </li>
                );
                // item_list.push(
                //     <tr>
                //         <td>{item.name}</td>
                //         <td>{item.price}</td>
                //         <td>
                //             <a onClick={() => this.removeItem(idx1)} class="waves-effect btn-flat">Remove</a>
                //         </td>
                //     </tr>
                // );

                // item_list.push(
                //     <tr>
                //         <td colspan="3">
                //             <ul class="collapsible">
                //                 <li>
                //                     <div class="collapsible-header"> Sub Items </div>
                //                     <div class="collapsible-body">
                //                         ???????
                //                     </div>
                //                 </li>
                //             </ul>
                //         </td>
                //     </tr>
                // );
            })
        }

        // const item_list = this.state.cur_catalog >= 0 ? this.state.business.catalog[this.state.cur_catalog].item.map((item, index) => {
        //     const sub_list = item.sub && item.sub.length > 0 ? item.sub.map( (sub, index2) => {
        //         return (
        //             <tr>
        //                 <td>{sub.name}</td>
        //                 <td>{sub.price}</td>
        //                 <td>
        //                     <a onClick={() => this.removeSub(index, index2)} class="waves-effect btn-flat">
        //                         Remove
        //                     </a>
        //                 </td>
        //             </tr>
        //         );
        //     }) : [];

        //     return [
        //         <tr>
        //             <td>{item.name}</td>
        //             <td>{item.price}</td>
        //             <td>
        //                 <a onClick={() => this.removeItem(index)} class="waves-effect btn-flat">
        //                     Remove
        //                 </a>
        //             </td>
        //             <td>
        //                 <input placeholder="sub item name" type="text" className="validate clear-margin"
        //                     onChange={this.onNewSubNameChange}
        //                     value={this.state.new_sub.name}/>
        //             </td>
        //             <td>
        //                 <input placeholder="sub item name" type="text" className="validate clear-margin"
        //                     onChange={this.onNewSubPriceChange}
        //                     value={this.state.new_sub.price}/>
        //             </td>
        //             <td>
        //                 {/* <a onClick={() => this.addSub(index)} class="col s12 waves-effect btn">Add Sub Item</a> */}
        //             </td>
        //         </tr>,
        //         <tr>
                    
        //         </tr>
        //     ].concat(sub_list);
        // }): ('');

        const item_section = this.state.cur_catalog >= 0 ? (
            <div>
                <div className="card">
                    <div className="card-content">
                        <div className="card-title">
                            <span>{this.state.business.catalog[this.state.cur_catalog].name}</span>
                            <a onClick={this.removeCatalog} class="waves-effect btn-flat btn right-float">Remove</a>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <div className="row clear-margin">
                            <div className="col m4 s12 clear-margin">
                                <input placeholder="item name" type="text" className="validate clear-margin no-margin"
                                    onChange={this.onNewItemNameChange}
                                    value={this.state.new_item.name}/>
                            </div>
                            <div className="col m4 s12 clear-margin">
                                <input placeholder="item price" type="text" className="validate clear-margin no-margin" 
                                    onChange={this.onNewItemPriceChange}
                                    value={this.state.new_item.price}/>
                            </div>
                            <div className="col m4 s12">
                                <a onClick={this.addItem} class="col s12 waves-effect btn right-float">Add</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="items-title">Items in {this.state.business.catalog[this.state.cur_catalog].name} (Click for options)</div>
                <ul class="collapsible"> {item_list} </ul>
            </div>
        ) : ("");

        return (
            <div className="container">
                <br/>
                <div className="row">
                    <div className="col s12 m4">
                        {catalog_section}
                    </div>
                    <div className="col s12 m8">
                        {item_section}
                    </div>
                </div>

                <SweetAlert
                    show={this.state.alert.show}
                    title={this.state.alert.title}
                    text={this.state.alert.text}
                    onConfirm={() => this.setState({ alert:{show: false}})}
                />

                <ToastContainer 
                    position="bottom-right"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
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