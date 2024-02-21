import axios from 'axios'
import { initAdmin } from './admin'
import moment from 'moment'
import Noty from 'noty'


let addToCart = document.querySelectorAll('.add-to-cart')
let removeToCart = document.querySelectorAll(".remove-to-cart")
let cartCounter = document.querySelector('#cartCounter')

function updateCart(food,url,msg){
    axios.post(url,food).then(res =>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: msg,
            progressBar: false,
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let food = JSON.parse(btn.dataset.food)
       // if data fetched from session , there will be have "item object" => (cart.ejs)
        if (food.item) {
            food = food.item
        }
        let url = "/update-cart";
        updateCart(food, url, "Item added to cart")
    })
})

removeToCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let food = JSON.parse(btn.dataset.food)
        let url = "/remove-cart"
        updateCart(food.item, url, "Item removed to cart")
    })
})

//remove alert

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}
let adminAreaPath =  window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin()
}

let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
    let dataProp = status.dataset.status
    if(stepCompleted) {
            status.classList.add('step-completed')
    }
    if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
        }
    }
    })
}

updateStatus(order);

let socket = io()

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})