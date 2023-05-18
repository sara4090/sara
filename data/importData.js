let Product = require('../models/Product')
let csv = require('csvtojson')
let data = []
const importData = async (req, res) => {
    try {
        csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response)
                for (let x = 0; x < response.length; x++) {
                    data.push({
                      productHrf: response[x].product_href,
                      name: response[x].Name,
                      mfrPart: response[x].Mfr_Part,
                      title: response[x].Title,
                      category: response[x].category,
                        mfr: response[x].Mfr,
                        datasheet: response[x].Datasheet,
                        subCategory: response[x].Subategory,
                        price: response[x].Price,
                        public_id: response[x].public_id,
                        url: response[x].img_url,
                        description: response[x].Description,
                        availability: response[x].Availability,
                        mfrNo: response[x].mfrNo,
                        brand: response[x].Brand,
                        package: response[x].Package,
                        inventory: response[x].Inventory,
                        stock: response[x].Stock,
                        material: response[x].Material,
                        ram: response[x].Ram,
                        mount: response[x].Mount,
                        shape: response[x].Shape,
                        series: response[x].Series,
                        size: response[x].Size,
                        productStatus: response[x].Product_Status,
                        efficiency: response[x].Efficiency_Type,
                        height: response[x].Height_Seated,
                        svhc: response[x].REACH_SVHC,
                        rohs: response[x].Rohs_Status,
                        storage: response[x].Storage,
                        color: response[x].Color,

                    })
                }
                await Product.insertMany(data)
            })

        res.status(400).send({ success: true, message: 'File imported successfully' })

    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}
module.exports = { importData }