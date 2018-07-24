import React from 'react';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import './History.css';
import $ from 'jquery'; 
import { ExportToCsv } from 'export-to-csv';

class History extends React.Component {

    constructor(props) {
        super(props);

        let now = moment().format('YYYY-MM-DD');
        this.state = {
            startDate: now,
            endDate: now,
            orders: []
        };

        this.print = this.print.bind(this);
        this.startDateChange = this.startDateChange.bind(this);
        this.endDateChange = this.endDateChange.bind(this);

        this.loadOrders();
    }

    componentDidMount () {
        $('#startpicker').pickadate({
          format: 'yyyy-mm-dd',
          selectMonths: true, // Creates a dropdown to control month
          selectYears: 15, // Creates a dropdown of 15 years to control year
          closeOnSelect: true,
          onSet: this.startDateChange
        });

        $('#endpicker').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            closeOnSelect: true,
            onSet: this.endDateChange
        });
    }
    
    startDateChange(e) {
        const date = moment(e.select).format('YYYY-MM-DD');
        this.setState({
            startDate: date
        });
        this.loadOrders();
    }

    endDateChange(e) {
        const date = moment(e.select).format('YYYY-MM-DD');
        this.setState({
            endDate: date
        });
        this.loadOrders();
    }

    print() {
        const options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            filename: 'order_history_' + new Date().toISOString().substring(0, 10),
            useBom: true,
            useKeysAsHeaders: false
        };
    
        const orders = this.state.orders;
    
        const data = [
            ['History', this.state.startDate, 'to', this.state.endDate, '']
        ];
        
        orders.forEach(order => {
            data.push(['', '', '', '', '']);
            data.push(['Order id', order.business, '', '', '']);
            data.push(['Items', 'Name', 'Count', 'Price', 'Additional Info']);

            let total = 0;
            order.item.forEach((item, idx) => {
                data.push([idx, item.name, item.count, '$' + (item.count * item.price), item.addition]);
                total += item.count * item.price;
                if( item.sub ) {
                item.sub.forEach(sub => {
                    if( sub.count > 0 ) {
                    data.push(['', sub.name, sub.count, '$' + (sub.count * sub.price), '']);
                    total += sub.count * sub.price;
                    }
                });
                }
            });
        
            let tax = total * 0.08;
            data.push(['Tax', '$'+tax, '', '', '']);
            data.push(['Total','$'+total+tax, '', '', '']);
            data.push(['Address', order.address.line1 + ' ' + order.address.line2 + ' ' + order.address.city + ' ' + order.address.zipcode, '', '', '']);
            data.push(['Phone', order.phone, '', '', '']);
            if(order.payment.card) {
                data.push(['Payment', '', '', '', '']);
                data.push(['Card No', order.payment.card, '', '', '']);
                data.push(['Expiry', order.payment.expiry, '', '', '']);
                data.push(['Name', order.payment.name, '', '', '']); 
            }
        });
      
        new ExportToCsv(options).generateCsv(data);
    }

    loadOrders() {
        const id = localStorage.getItem('id');

        const url = 'http://' + window.location.hostname + ':' + window.location.port + '/history/query';
        const token = localStorage.getItem('token');

        const startDate = this.state.startDate;
        const day = moment.duration(2, 'd');
        const endDate = moment(this.state.endDate).add(day).format('YYYY-MM-DD');

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'XXX ' + token
            },
            body: JSON.stringify({id: id, startDate: startDate, endDate: endDate})
        }).then(response=>{
            if(response.status === 200){
                response.json().then((res)=>{
                    console.log(res);
                    this.setState({
                        orders: res
                    });
                });   
            }
        });
    }

    render() {
        return (
            <div className="container">
                <br/>
                <div className="row">
                    <p className="col m1 valign-wrapper">
                        From
                    </p>
                    <div className="col s12 m4">
                        <input type="text" 
                            id="startpicker"
                            value={this.state.startDate}
                            className="datepicker date-input"/>
                    </div>
                    <p className="col m1 valign-wrapper">
                        to
                    </p>
                    <div className="col s12 m4">
                        <input type="text" 
                            id="endpicker"
                            value={this.state.endDate}
                            className="datepicker date-input"/>
                    </div>
                    <div className="col s12 m2">
                        <a onClick={this.print} class="waves-effect waves-light btn">
                            print
                        </a>
                    </div>
                </div>

                {this.renderList()}
            </div>
        );
    }

    renderList() {

        const orderList = this.state.orders.map(
            (order, index) => {
                return (
                    <li>
                        <div className="collapsible-header">
                            <div className="secondary-content">
                                OrderID {order._id}
                            </div>
                            &nbsp;
                            Phone: {order.phone}
                            &nbsp;
                            Date: {moment(order.createAt).format('YYYY-MM-DD HH:mm:ss')}
                            &nbsp;
                        </div>
                        <div className="collapsible-body">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Count</th>
                                        <th>Instructions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderItems(order.item)}
                                </tbody>
                            </table>
                            <p className="right-align">Tax: {order.tax}</p>
                            <p className="right-align">Total: {order.total}</p>
                            <blockquote>Phone: {order.phone}</blockquote>
                            {this.renderPayment(order.payment)}
                            {this.renderAddress(order.address)}
                        </div>
                    </li>
                );
            }
        );

        return (
            <ul className="collapsible" data-collapsible="accordion">
                {orderList}
            </ul>
        );
    }

    renderAddress(address) {
        if(address.line1 === 'Pick up')
            return (
                <blockquote>Address: Pick up</blockquote>
            );
        else
            return (
                <blockquote>
                    <p>Address:</p>
                    <p>line1: {address.line1}</p> 
                    <p>line2: {address.line2}</p>
                    <p>city: {address.city}&nbsp;{address.zipcode}</p>
                </blockquote>
            );
    }

    renderPayment(payment) {
        if(payment.card === null) {
            return (
                <blockquote>Payment: Cash</blockquote>
            );
        } else {
            return (
                <blockquote>
                    <p>Payment:</p>
                    <p>Card: {payment.card}</p>
                    <p>Name: {payment.name}</p>
                    <p>Expiry: {payment.expiry}</p>
                    <p>CVC: {payment.CVC}</p>
                </blockquote>
            );
        }
    }
 
    renderItems(items) {
        const res = [];

        items.forEach(item => {
            res.push(
                <tr>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.count}</td>
                    <td>{item.addition}</td>
                </tr>
            );

            if( item.sub && item.sub.length > 0) {
                item.sub.forEach(sub => {
                    if( sub.count > 0 ) {
                        res.push(
                            <tr class="sub-tr">
                                <td>{sub.name}</td>
                                <td>{sub.price}</td>
                                <td>{sub.count}</td>
                                <td></td>
                            </tr>
                        );
                    }
                });
            }
        });

        return res;
    }
} 

export default History;