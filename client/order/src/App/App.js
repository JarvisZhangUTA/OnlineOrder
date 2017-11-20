import React, { Component } from 'react';
import FaPlus from 'react-icons/lib/fa/plus-circle';
import FaMinus from 'react-icons/lib/fa/minus-circle';
import { ToastContainer, toast } from 'react-toastify';
import validator from 'validator';
import * as jsPDF from 'jspdf';

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
            item: []
          },
          order: {
            phone: '',
            business: '',
            item: [],
            tax: 0,
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

  placeOrder() {
      const order = this.state.order;

      if(order.total === 0) {
        toast('Your cart is empty');
        return;
      }

      if(!validator.isMobilePhone(order.phone, 'any')) {
        toast('Check your phone number');
        return;
      }

      if(validator.isEmpty(order.address.line1)) {
        toast('Please specify your address');
        return;
      }

      order.business = this.state.business._id;

      var re = new RegExp('0', 'g');
      order.payment.card = order.payment.card.replace(re, 'X');

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
    let doc = new jsPDF()
    
    let content = 'Receipt \n';
    
    const order = this.state.order;
    const business = this.state.business;

    content += business.name + '\n';
    content += 'Items: \n'; 

    for(let item of order.item) {
      content += item.name + ' ' + item.count + '\n';
    }
    
    content += 'tax: ' + order.tax + '\n';
    content += 'total: ' + order.total + '\n';
    content += 'address: ' + '\n';
    content += order.address.line1 + '\n';
    content += order.address.line2 + '\n';
    content += order.address.zipcode + ' ' + order.address.city +'\n';
    content += 'payment: ' + '\n';
    content += order.payment.card + '\n';
    content += order.payment.name + '\n';

    doc.text(content, 10, 10)
    doc.save('receipt.pdf')
  }

  loadBusiness() {
      const arr = window.location.href.split('/');
      const index = arr[arr.length - 1];
      const url = 'http://' + window.location.hostname + ':' + window.location.port + '/business/index/' + index;
      const request = new Request(url, {method: 'GET'});

      fetch(request)
          .then((res) => res.json())
          .then((business) => {

              if(!business.location){
                business.location = {
                  address: ''
                };
              }

              this.setState({
                  business: business
              });
          });
  }

  changePhone(phone) {
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
    this.setState({order});
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

  addItem(index) {
    const item = this.state.business.item[index];
    const order = this.state.order;

    const i = order.item.indexOf(item);
    if(order.item.indexOf(item) === -1) {
      item.count = 1;
      item.addition = '';
      order.item.push(item);
    } else {
      order.item[i].count += 1;
    }

    let total = 0;
    for(let i = 0; i < order.item.length; i++) {
      total += order.item[i].price * order.item[i].count;
    }
    let tax = total * 0.08;
    total = total + tax;
    order.tax = tax.toFixed(2);
    order.total = total.toFixed(2);

    this.setState({order});

    toast(item.name + ' has been added to your cart.', {className: 'dark-toast'});
  }

  plusItem(index) {
    const order = this.state.order;
    order.item[index].count += 1;

    let total = 0;
    for(let i = 0; i < order.item.length; i++) {
      total += order.item[i].price * order.item[i].count;
    }
    let tax = total * 0.08;
    total = total + tax;
    order.tax = tax.toFixed(2);
    order.total = total.toFixed(2);

    this.setState({order});
  }

  minusItem(index) {
      const order = this.state.order;

      if(order.item[index].count === 1) {
        order.item.splice(index, 1);
      } else {
        order.item[index].count -= 1;
      }

      let total = 0;
      for(let i = 0; i < order.item.length; i++) {
        total += order.item[i].price * order.item[i].count;
      }
      let tax = total * 0.08;
      total = total + tax;
      order.tax = tax.toFixed(2);
      order.total = total.toFixed(2);

      this.setState({order});
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
    const item_list = this.state.order.item.map(
      (i, index) => {
          return (
              <tr>
                  <td>{i.name}</td>
                  <td>{i.price}</td>
                  <td>
                      <a onClick={() => this.plusItem(index)} class="waves-effect waves-teal btn-flat">
                          <FaPlus/>
                      </a>
                      {i.count}
                      <a onClick={() => this.minusItem(index)} class="waves-effect waves-teal btn-flat">
                          <FaMinus/>
                      </a>
                  </td>
                  <td>
                      <input type="text" className="validate input-info" value={i.addition} 
                          placeholder="no info"
                          onChange={(e) => this.changeAddition(e, index)}/>
                  </td>
                  <td>
                      {(i.price * i.count).toFixed(2)}
                  </td>
              </tr>
          );
      }
    );

    return (
      <div>
        <ul className="collapsible" data-collapsible="accordion">
          <li>
            <div className="collapsible-header grey lighten-4 active">Order</div>
            <div className="collapsible-body">
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
                </tbody>
              </table>

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
              
              <input type="checkbox" id="pickup" onChange={() => this.changeAddressLine1("Pick up")}/>
              <label for="pickup">Pick up myself</label>
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
    const item_list = this.state.business.item.map(
      (i, index) => {
          return (
              <tr>
                  <td>{i.name}</td>
                  <td>{i.price}</td>
                  <td>
                      <a onClick={() => this.addItem(index)} class="waves-effect waves-teal btn-flat">
                          <FaPlus/>
                      </a>
                  </td>
              </tr>
          );
      }
    );

    return (
      <table>
        <thead>
          <tr><th>Name</th><th>Price</th><th></th></tr>
        </thead>
        <tbody>{item_list}</tbody>
      </table>
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
          onChange={(e) => this.changeExpiry(e.target.value)}/>
        <input placeholder="CVC" type="text" name="CCcvc" 
          onChange={(e) => this.changeCVC(e.target.value)}/>
      </div>
    );
  }
}

export default App;
