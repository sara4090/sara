const express = require('express');
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const { adminSignupValidation, loginValidation, blogValidation, validationsForAddingProducts } = require('../middleware/validation')
const uploadImages = require('../middleware/uploadFile')


const { adminSignup } = require('../controllers/adminSignup');
const { adminLogin } = require('../controllers/adminLogin');
const { adminDetails } = require('../controllers/fetchAdmindetails');
const { fetchCustomers } = require('../controllers/getCustomersLists');
const { adminAddProduct } = require('../controllers/adminAddProduct');
const { adminDeleteProduct } = require('../controllers/adminDeleteProduct');
const { adminFetchProducts } = require('../controllers/adminFetchProducts');
const { fetchAllOrders } = require('../controllers/fetchAllOrders');
const { deleteCustomer } = require('../controllers/deleteCustomer');
const { getRecentOrders } = require('../controllers/adminRecentOrders');
const { completedRecentOrders } = require('../controllers/completedRecentOrder');
const { adminOrderStatus } = require('../controllers/adminOrderStatus');
const { getTotalOrders } = require('../controllers/adminGetTotalOrders');
const { getTopProducts } = require('../controllers/topProductsSold');
const { getSalesPerMonth } = require('../controllers/salesPerMonth');
const { checkPaymentHistory } = require('../controllers/checkPaymentHistory');
const { addBlog } = require('../controllers/addBlog');
const { fetchBlogs } = require('../controllers/fetchBloges');
const { fetchSingleBlog } = require('../controllers/fetchSingleBlog');
const { updateBlog } = require('../controllers/updateBlog');
const { deleteBlog } = require('../controllers/deleteBlog');
const { adminVerifyerifyMail } = require('../mails/adminVerifyMail');
const { customerLastFewMonths } = require('../controllers/customerLastFewMonths');

router.post('/signup', adminSignupValidation, adminSignup)
router.get('/verify', adminVerifyerifyMail)
router.post('/login', loginValidation, adminLogin)
router.get('/fetchData', fetchUser, adminDetails)
router.get('/getCustomers', fetchUser, fetchCustomers)
router.post('/adminAddProduct', validationsForAddingProducts, uploadImages, fetchUser, adminAddProduct)
router.delete('/adminDeleteProduct/:id', fetchUser, adminDeleteProduct)
router.get('/getAllProducts', adminFetchProducts)
router.get('/fetchAllOrders', fetchUser, fetchAllOrders)
router.delete('/deleteCustomer/:id', fetchUser, deleteCustomer)
router.get('/getRecentOrders', fetchUser, getRecentOrders)
router.get('/completedRecentOrder', fetchUser, completedRecentOrders)
router.patch('/getOrderStatus/:id', fetchUser, adminOrderStatus)
router.get('/getTotalOrders', fetchUser, getTotalOrders)
router.get('/getTopProducts', fetchUser, getTopProducts)
router.get('/getSalesPerMonth', fetchUser, getSalesPerMonth)
router.get('/checkPaymentHistory', fetchUser, checkPaymentHistory)

//BLOGS ROUTES
router.post('/addBlog', uploadImages, blogValidation , fetchUser, addBlog);
router.get('/fetchBlogs', fetchUser, fetchBlogs)
router.get('/fetchSingleBlog/:id', fetchUser, fetchSingleBlog)
router.patch('/updateBlog/:id', fetchUser, updateBlog)
router.delete('/deleteBlog/:id', fetchUser, deleteBlog)

//Customers
router.get('/customers', customerLastFewMonths)

module.exports = router;
