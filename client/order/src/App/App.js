import React, { Component } from 'react';
import FaPlus from 'react-icons/lib/fa/plus-circle';
import FaMinus from 'react-icons/lib/fa/minus-circle';
import { ExportToCsv } from 'export-to-csv';
import { ToastContainer, toast } from 'react-toastify';
import validator from 'validator';
import $ from 'jquery';

import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import 'react-toastify/dist/ReactToastify.min.css' 
import './App.css';

class App extends Component {

  constructor(props) {
      super(props);

      this.state = {
          business: {
            name: '',
            email: '',
            phone: '',
            location: {address: ''},
            catalog: []
          },
          order: {
            phone: '',
            business: '',
            item: [],
            tax: 0,
            deliver: 2,
            total: 0,
            address: {
              line1: '',
              line2: '',
              zipcode: '',
              city: ''
            },
            payment: {
              card: '',
              name: '',
              expiry: '',
              CVC: ''
            }
          }
      };

      this.addItem = this.addItem.bind(this);
      this.plusItem = this.plusItem.bind(this);
      this.minusItem = this.minusItem.bind(this);
      this.plusSub = this.plusSub.bind(this);
      this.minusSub = this.minusSub.bind(this);
      this.changeAddition = this.changeAddition.bind(this);
      this.changeCard = this.changeCard.bind(this);
      this.changeCVC = this.changeCVC.bind(this);
      this.changeName = this.changeName.bind(this);
      this.changePhone = this.changePhone.bind(this);
      this.changeExpiry = this.changeExpiry.bind(this);

      this.changeAddressLine1 = this.changeAddressLine1.bind(this);
      this.changeAddressLine2 = this.changeAddressLine2.bind(this);
      this.changeAddressZipCode = this.changeAddressZipCode.bind(this);
      this.changeAddressCity = this.changeAddressCity.bind(this);

      this.placeOrder = this.placeOrder.bind(this);
      this.loadBusiness();
  }

  calculatePrice() {
    const order = this.state.order;

    let total = 0;
    for(let i = 0; i < order.item.length; i++) {
      if( order.item[i].sub ) {
        for(let j = 0; j < order.item[i].sub.length; j++) {
          total += order.item[i].sub[j].price * order.item[i].sub[j].count;
        }
      }
      total += order.item[i].price * order.item[i].count;
    }

    let tax = total * 0.08;

    total = total + tax;
    total = total + order.deliver;

    order.tax = tax.toFixed(2);
    order.total = total.toFixed(2);

    this.setState({order});
  }

  placeOrder() {
      const order = this.state.order;

      if(order.total === 0) {
        toast('Your cart is empty');
        return;
      }

      if(!validator.isMobilePhone(order.phone, 'en-US')) {
        toast('Check your phone number');
        return;
      }

      if(validator.isEmpty(order.address.line1)) {
        toast('Please specify your address');
        return;
      }

      order.business = this.state.business._id;
      const url = 'http://' + window.location.hostname + ':' + 
          window.location.port + '/history/placeorder';

      fetch(url, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
      }).then(response=>{
          response.json().then((res)=>{
              if(response.status === 200) {
                  this.print();
                  toast('Order has been applied, this window is going to be closed.', 
                    {
                      className: 'green-toast',
                      hideProgressBar: false,
                      onClose: () => window.location.reload()});
              } else {
                  toast(res.error, {className: 'red-toast'});
              }
          });
      });
  }

  print() {
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      filename: 'receipt_' + new Date().toISOString().substring(0, 10),
      useBom: true,
      useKeysAsHeaders: false
    };

    const order = this.state.order;

    const data = [
      ['Order id', order.business, '', '', ''],
      ['', '', '', '', ''],
      ['Items', 'Name', 'Count', 'Price', 'Additional Info']
    ];
    
    order.item.forEach((item, idx) => {
      data.push([idx, item.name, item.count, '$' + (item.count * item.price), item.addition]);
      if( item.sub ) {
        item.sub.forEach(sub => {
          if( sub.count > 0 ) {
            data.push(['', sub.name, sub.count, '$' + (sub.count * sub.price), '']);
          }
        });
      }
    });
    
    data.push(['', '', '', '', '']);
    data.push(['Tax', '$' + order.tax, '', '', '']);
    if( order.deliver ) data.push(['Deliver Fee', '$2', '', '', '']);
    data.push(['Total','$' + order.total, '', '', '']);
    data.push(['', '', '', '', '']);
    data.push(['Address', order.address.line1 + ' ' + order.address.line2 + ' ' + order.address.city + ' ' + order.address.zipcode, '', '', '']);
    data.push(['Phone', order.phone, '', '', '']);
    data.push(['', '', '', '', '']);
    if(order.payment.card) {
      data.push(['Payment', '', '', '', '']);
      data.push(['Card No', order.payment.card, '', '', '']);
      data.push(['Expiry', order.payment.expiry, '', '', '']);
      data.push(['Name', order.payment.name, '', '', '']); 
    }

    new ExportToCsv(options).generateCsv(data);
  }

  loadBusiness() {
      const arr = window.location.href.split('/');
      const index = arr[arr.length - 1];
      const url = 'http://' + window.location.hostname + ':' + window.location.port + '/business/index/' + index;
      const request = new Request(url, {method: 'GET'});

      fetch(request).then((res) => res.json()).then((business) => {
        if(!business.location){
          business.location = { address: ''};
        }
        this.setState({business: business});
        $('.collapsible').collapsible('open', 0);
      });
  }

  changePhone(phone) {
    if(validator.isMobilePhone(phone, 'en-US')) {
      const order = this.state.order;
      const url = 'http://' + window.location.hostname + ':' + window.location.port + 
                  '/history/record/' + phone;
      const request = new Request(url, {method: 'GET'});
      fetch(request).then((res) => res.json()).then((record) => {
        if(record.address) {
          order.address = record.address;
        }

        if(record.payment) {
          order.payment = record.payment;
        }
        this.setState({order});
      });
    }

    const order = this.state.order;
    order.phone = phone;
    this.setState({order});
  }

  changeName(name) {
    const order = this.state.order;
    order.payment.name = name;
    this.setState({order});
  }

  changeCard(card) {
    const order = this.state.order;
    card = card.replace( new RegExp('0', 'g'), 'X' );
    order.payment.card = card;
    this.setState({order});
  }

  changeExpiry(expiry) {
    const order = this.state.order;
    order.payment.expiry = expiry;
    this.setState({order});
  }

  changeCVC(CVC) {
    const order = this.state.order;
    order.payment.CVC = CVC;
    this.setState({order});
  }

  changeAddressLine1(line1) {
    const order = this.state.order;
    order.address.line1 = line1;
    order.deliver = line1 === 'Pick up' ? 0 : 2;
    this.setState({order});
    this.calculatePrice();
  }

  changeAddressLine2(line2) {
    const order = this.state.order;
    order.address.line2 = line2;
    this.setState({order});
  }

  changeAddressZipCode(zipcode) {
    const order = this.state.order;
    order.address.zipcode = zipcode;
    this.setState({order});
  }

  changeAddressCity(city) {
    const order = this.state.order;
    order.address.city = city;
    this.setState({order});
  }

  changeAddition(event, index) {
    const order = this.state.order;
    order.item[index].addition = event.target.value;
    this.setState({order});
  }

  addItem(i1, i2) {
    const item = JSON.parse( JSON.stringify(this.state.business.catalog[i1].item[i2]) );
    const order = this.state.order;
    
    item.count = 1;
    item.addition = '';
    if( item.sub ) {
      item.sub.forEach(sub => { sub.count = 0; })
    }

    order.item.push(item);
    this.setState({order});

    this.calculatePrice();

    toast(item.name + ' has been added to your cart.', {className: 'dark-toast'});
  }

  plusItem(index) {
    const order = this.state.order;
    order.item[index].count += 1;
    this.setState({order});
    this.calculatePrice();
  }

  minusItem(index) {
    const order = this.state.order;

    if(order.item[index].count === 1) {
      order.item.splice(index, 1);
    } else {
      order.item[index].count -= 1;
    }

    this.setState({order});
    this.calculatePrice();
  }

  plusSub( idx1, idx2 ) {
    const order = this.state.order;
    order.item[idx1].sub[idx2].count += 1;

    this.setState({order});
    this.calculatePrice();
  }

  minusSub( idx1, idx2 ) {
    const order = this.state.order;

    if( order.item[idx1].sub[idx2].count === 0 ) return;
    order.item[idx1].sub[idx2].count -= 1;

    this.setState({order});
    this.calculatePrice();
  }

  render() {
    const arr = window.location.href.split('/');
    const index = arr[arr.length - 1];
    const url = 'http://' + window.location.hostname + ':' + window.location.port + '/' + index;

    return (
      <div className="container">
        <div className="card red accent-2">
          
          <div className="card-content white-text">
            <h4>
              <a href={url}>
                {this.state.business.name}
              </a>
            </h4>
            <p>{this.state.business.location.address}</p>
            <p>Contact with {this.state.business.phone} for more information.</p>
          </div>

          <div className="card-tabs">
            <ul className="tabs tabs-transparent">
              <li className="tab"><a href="#menu" class="active">&nbsp;&nbsp;MENU&nbsp;&nbsp;</a></li>
              <li className="tab"><a href="#cart" >&nbsp;&nbsp;CART&nbsp;&nbsp;</a></li>
            </ul>
          </div>
          <div className="card-content white">
            <div id="menu" className="active">
              {this.renderMenu()}
            </div>
            <div id="cart">
              {this.renderCart()}
            </div>
          </div>
        </div>

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

  renderCart() {
    const item_list = [];
    
    if( this.state.order.item ) {
      this.state.order.item.forEach( (item, idx1) => {
        item_list.push(
          <tr>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>
                <a onClick={() => this.plusItem(idx1)} class="waves-effect waves-teal btn-flat"> <FaPlus/> </a>
                {item.count}
                <a onClick={() => this.minusItem(idx1)} class="waves-effect waves-teal btn-flat"> <FaMinus/> </a>
            </td>
            <td>
                <input type="text" className="validate input-info" value={item.addition} 
                    placeholder="no info"
                    onChange={(e) => this.changeAddition(e, idx1)}/>
            </td>
            <td>
                {(item.price * item.count).toFixed(2)}
            </td>
          </tr>
        );

        if( item.sub ) {
          item.sub.forEach( (sub,idx2) => {
            item_list.push(
              <tr className='sub-tr'>
                <td>{sub.name}</td>
                <td>{sub.price}</td>
                <td>
                  <a onClick={() => this.plusSub(idx1,idx2)} class="waves-effect waves-teal btn-flat"> <FaPlus/> </a>
                  {sub.count}
                  <a onClick={() => this.minusSub(idx1, idx2)} class="waves-effect waves-teal btn-flat"> <FaMinus/> </a>
                </td>
                <td></td>
                <td>{(sub.price * sub.count).toFixed(2)}</td>
              </tr>
            );
          })
        }
      })
    }

    const deliver = this.state.order.deliver > 0 ? (
      <div className="right-float"> Delivery Fee： $2 </div>
    ):('');

    return (
      <div>
        <ul className="collapsible" data-collapsible="accordion">
          <li>
            <div className="collapsible-header grey lighten-4">Order</div>
            <div className="collapsible-body">
              <div>
                <table className="responsive-table centered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Count</th>
                      <th>Instructions</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item_list}
                    <tr><td></td><td></td><td></td><td></td><td></td></tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                  <p className="right-align">Tax: {this.state.order.tax}</p>
                  <p className="right-align">Total: {this.state.order.total}</p>
              </div>

            </div>
          </li>
          <li>
            <div className="collapsible-header grey lighten-4">Delivery</div>
            <div className="collapsible-body">
              <input placeholder="phone" type="text"
                              onChange={(e) => this.changePhone(e.target.value)}
                              className="validate" value={this.state.order.phone}/>
              <input placeholder="Address Line 1" type="text"
                              onChange={(e) => this.changeAddressLine1(e.target.value)}
                              className="validate" value={this.state.order.address.line1}/>
              <input placeholder="Address Line 2" type="text"
                              onChange={(e) => this.changeAddressLine2(e.target.value)}
                              className="validate" value={this.state.order.address.line2}/>
              <div className="row">
                <div className="col s6">
                  <input placeholder="Zipcode" type="text"
                              onChange={(e) => this.changeAddressZipCode(e.target.value)}
                              className="validate" value={this.state.order.address.zipcode}/>
                </div>
                <div className="col s6">
                  <input placeholder="city" type="text"
                              onChange={(e) => this.changeAddressCity(e.target.value)}
                              className="validate" value={this.state.order.address.city}/>
                </div>
              </div>
              
              <div>
                <input type="checkbox" id="pickup" onChange={(e) => { this.changeAddressLine1(e.target.checked ? 'Pick up' : '');} }/>
                <label for="pickup">Pick up myself</label>
                {deliver}
              </div>
            </div>
          </li>
          <li>
            <div className="collapsible-header grey lighten-4">Payment</div>
            <div className="collapsible-body">
              <blockquote>
                You can leave it empty and pay later.
              </blockquote>
              {this.renderCardContainer()}
              <div id="card-wrapper"></div>
            </div>
          </li>
        </ul>

        <div className="row">
          <a onClick={this.placeOrder} className="col s10 offset-s1 waves-effect waves-light btn-large">
              Place Order
          </a>
        </div>
      </div>
    );
  }

  renderMenu() {
    const item_list = this.state.business.catalog.map(
      (catalog, i1) => {
          const items = catalog.item.map((i, i2) => {
              return (
                  <tr>
                    <td>{i.name}</td>
                    <td>{i.price}</td>
                    <td>
                        <a onClick={() => this.addItem(i1, i2)} className="waves-effect waves-teal btn-flat">
                            <FaPlus/>
                        </a>
                    </td>
                  </tr>
              );
          });

          return (
            <li>
              <div className="collapsible-header">
                {catalog.name}
              </div>
              <div className="collapsible-body">
                <table>
                  {items}
                </table>
              </div>
            </li>
          );
      }
    );

    return (
      <ul class="collapsible" data-collapsible="accordion">
        {item_list}
      </ul>
    );
  }

  renderCardContainer() {
    return (
      <div>
        <input placeholder="Full name" type="text" name="CCname" 
            value={this.state.order.payment.name} onChange={(e) => this.changeName(e.target.value)}/>
        <input placeholder="Card number" type="text" name="CCnumber" 
          value={this.state.order.payment.card} onChange={(e) => this.changeCard(e.target.value)}/>
        <input placeholder="MM/YY" type="text" name="CCexpiry" 
          value={this.state.order.payment.expiry}
          onChange={(e) => this.changeExpiry(e.target.value)}/>
        <input placeholder="CVC" type="text" name="CCcvc" 
          onChange={(e) => this.changeCVC(e.target.value)}/>
      </div>
    );
  }
}

export default App;
