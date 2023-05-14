const express = require('express');
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const { adminSignupValidation, loginValidation } = require('../middleware/validation')

const { adminSignup } = require('../controllers/adminSignup');
const { adminLogin } = require('../controllers/adminLogin');
const { adminDetails } = require('../controllers/fetchAdmindetails');
const { fetchCustomers } = require('../controllers/getCustomersLists');
const { adminAddProduct } = require('../controllers/adminAddProduct');
const { adminDeleteProduct } = require('../controllers/adminDeleteProduct');
const { adminFetchProducts } = require('../controllers/adminFetchProducts');
const { deleteCustomer } = require('../controllers/deleteCustomer');
const { getRecentOrders } = require('../controllers/adminRecentOrders');
const { completedRecentOrders } = require('../controllers/completedRecentOrder');
const { adminOrderStatus } = require('../controllers/adminOrderStatus');
const { getTotalOrders } = require('../controllers/adminGetTotalOrders');
const { getTopProducts } = require('../controllers/topProductsSold');
const { getSalesPerMonth } = require('../controllers/salesPerMonth');
const { checkPaymentHistory } = require('../controllers/checkPaymentHistory');

router.post('/signup', adminSignupValidation, adminSignup)
router.post('/login', loginValidation, adminLogin)
router.get('/fetchData', fetchUser, adminDetails)
router.get('/getCustomers', fetchUser, fetchCustomers)
router.post('/adminAddProduct', fetchUser, adminAddProduct)
router.delete('/adminDeleteProduct/:id', fetchUser, adminDeleteProduct)
router.get('/getAllProducts', fetchUser, adminFetchProducts)
router.delete('/deleteCustomer/:id', fetchUser, deleteCustomer)
router.get('/getRecentOrders', fetchUser, getRecentOrders)
router.get('/completedRecentOrder', fetchUser, completedRecentOrders)
router.patch('/getOrderStatus/:id', fetchUser, adminOrderStatus)
router.get('/getTotalOrders', fetchUser, getTotalOrders)
router.get('/getTopProducts', fetchUser, getTopProducts)
router.get('/getSalesPerMonth', fetchUser, getSalesPerMonth)
router.get('/checkPaymentHistory',fetchUser, checkPaymentHistory)

module.exports = router;
