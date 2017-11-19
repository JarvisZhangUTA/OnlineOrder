import React from 'react';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import './History.css';
import $ from 'jquery'; 

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
        let doc = new jsPDF()

        let content = '';
        let lines = 1;
        content += 'Order History from ' + this.state.startDate + ' to ' + this.state.endDate + '\n';
        
        const orders = this.state.orders;
        for(let order of orders) {
            content += '==========================================\n';
            content += 'Order ID : ' + order._id + '\n';
            content += '==========================================\n';
            content += moment(order.createAt).format() + '\n';
            content += 'Phone:' + order.phone + '\n';
            content += 'Items:\n';
            
            for(let item of order.item) {
                content += item.name + ' ' + item.count + '\n';
                lines++;

                if(lines >= 40){
                    doc.text(content, 10, 10);
                    doc.addPage();
                    content = '';
                    lines = 0;
                }
            }

            content += 'Tax: ' + order.tax + '\n';
            content += 'Total: ' + order.total + '\n Address: \n';
            content += order.address.line1 + '\n';
            content += order.address.line2 + '\n';
            if(order.address.zipcode)
                content += order.address.zipcode + ' ';
            content += order.address.city +'\n Payment: \n';
            if(order.payment.card) {
                content += order.payment.card + '\n';
                content += order.payment.name + '\n';
            }   else {
                content += 'Cash\n';
            }

            lines += 15;

            if(lines >= 40) {
                doc.text(content, 10, 10);
                doc.addPage();
                content = '';
                lines = 0;
            }
        }

        doc.text(content, 10, 10);
        doc.save('OrderHistory.pdf');
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
        return items.map(
            (item) => {
                return (
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.count}</td>
                        <td>{item.addition}</td>
                    </tr>
                );
            }
        )
    }
} 

export default History;