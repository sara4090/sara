let csv = require('csvtojson')
const Product = require('../')
let userData = []
const importData = async (req, res) => {
    try {
        csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response)
                for (let x = 0; x < response.length; x++) {
                    userData.push({
                        name: response[x].name,
                        title: response[x].title,
                        category: response[x].category,
                        images: [{
                            public_id: response[x].public_id,
                            url: response[x].url
                        }],
                        description: response[x].description,
                        price: response[x].price,
                        brand: response[x].brand,
                        inventory: response[x].inventory,
                        stock: response[x].stock,
                        material: response[x].material,
                        ram: response[x].ram,
                        storage: response[x].storage,
                        color: response[x].color

                    })
                }
                await Product.insertMany(userData)
            })

        res.status(400).send({ success: true, message: 'File imported successfully' })

    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}

module.exports = { importData }