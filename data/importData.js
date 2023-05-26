let Product = require('../models/Product')
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')
const xlsx = require('xlsx');
const { ObjectId } = require('mongoose').Types;




const importData = async (req, res) => {

    if (
        req.file.mimetype !== 'application/vnd.ms-excel' &&
        req.file.mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) return res
        .status(400)
        .json({ error: 'Invalid file format. Only Excel files are supported' });

    // Read the Excel file using xlsx library
    const workbook = xlsx.readFile(req.file.path);

    // Extract data from the Excel file
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);
    // Import data into MongoDB
    try {
        const categoryMap = new Map(); // Map to store categories and their associated products

        for (const item of data) {
            const categoryName = item.category;
            const subCategoryName = item.subCategory;

            let category = categoryMap.get(categoryName); // Check if category already exists in the map

             category = await Category.findOne({ name: categoryName }); 

            if (!category) {
                // If category doesn't exist, create a new category and add it to the map
                const newCategory = new Category({
                    name: categoryName,
                });

                category = await newCategory.save();
                categoryMap.set(categoryName, category);
            }

            let subCategory = await Subcategory.findOne({ name: subCategoryName }); // Check if subcategory already exists in the database

            if (!subCategory) {
                // If subcategory doesn't exist, create a new subcategory and save it
                subCategory = new Subcategory({
                    name: subCategoryName,
                });

                subCategory = await subCategory.save();
            }


            // Create a new document based on your schema
            const newData = new Product({
                name: item.name,
                title: item.title,
                images: [{
                    public_id: item.public_id,
                    url: item.url
                }],
                offers: [{
                    label: item.label,
                    values: item.values
                }],
                category: [{
                    // id: category._id,
                    name: category.name,
                }],
                subCategory: [{
                    // id: subCategory._id,
                    name: subCategory.name
                }],
                description: item.description,
                price: item.price,
                mfr: item.mfr,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                mfrNo: item.mfrNo,
                partNumber: item.partNumber,
                inventory: item.inventory,
                brand: item.brand,
                ram: item.ram,
                storage: item.storage,
                compatible: item.compatible,
                weight: item.weight,
                material: item.material,
                type: item.type,
                factoryLead: item.factoryLead,
                lifeCycle: item.lifeCycle,
                contactPlating: item.contactPlating,
                housingMaterial: item.housingMaterial,
                processor: item.processor,
                capacity: item.capacity,
                pinsNo: item.pinsNo,
                ramProcessor: item.ramProcessor,
                operatingSystem: item.operatingSystem,
                memory: item.memory,
                memoryTechnology: item.memoryTechnology,
                size: item.size,
                antenna: item.antenna,
                frequencyBand: item.frequencyBand,
                cells: item.cells,
                cores: item.cores,
                designedFor: item.designedFor,
                wiredWireless: item.wiredWireless,
                CPC: item.CPC,
                connectivity: item.connectivity,
                refillingType: item.refillingType,
                panelType: item.panelType,
                screenForm_factor: item.screenForm_factor,
                chipSet: item.chipSet,
                displayTechnology: item.displayTechnology,
                colorType: item.colorType,
                color: item.color,
                hsnCode: item.hsnCode,
                sku: item.sku,
                stock: item.stock,
                priceBefore: item.priceBefore,
                maxOrderQty: item.maxOrderQty,
                minOrderQty: item.minOrderQty,
                primaryProducts: item.primaryProducts,
                primePartner: item.primePartner,
                length: item.length,
                breadth: item.breadth,
                imageTitle: item.imageTitle,
                height: item.height,
                RadiationHardening: item.RadiationHardening,
                PbfreeCode: item.PbfreeCode,
                IECConformance: item.IECConformance,
                FilterFeature: item.FilterFeature,
                MixedContacts: item.MixedContacts,
                Option: item.Option,
                TotalNumberOfContacts: item.TotalNumberOfContacts,
                Orientation: item.Orientation,
                Depth: item.Depth,
                ReachComplianceCode: item.ReachComplianceCode,
                CurrentRating: item.CurrentRating,
                Frequency: item.Frequency,
                ApprovalAgency: item.ApprovalAgency,
                LeadPitch: item.LeadPitch,
                NumberOfContacts: item.NumberOfContacts,
                MatingInformation: item.MatingInformation,
                ContactGender: item.ContactGender,
                EmptyShell: item.EmptyShell,
                OperatingSupplyVoltage: item.OperatingSupplyVoltage,
                BackshellType: item.BackshellType,
                BodyOrShellStyle: item.BodyOrShellStyle,
                Interface: item.Interface,
                ELV: item.ELV,
                MaxSupplyVoltage: item.MaxSupplyVoltage,
                MinSupplyVoltage: item.MinSupplyVoltage,
                CouplingType: item.CouplingType,
                NumberOfPorts: item.NumberOfPorts,
                AccessoryType: item.AccessoryType,
                NumberOfPoles: item.NumberOfPoles,
                Sealable: item.Sealable,
                Density: item.Density,
                NumberOfDrivers: item.NumberOfDrivers,
                OutsideDiameter: item.OutsideDiameter,
                NumberOfReceivers: item.NumberOfReceivers,
                HeadDiameter: item.HeadDiameter,
            });

            // Save the document to MongoDB
            await newData.save();



        }

        res.json({ message: 'Data imported successfully' });

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error saving data, Some required fields are missing', error: error.message });
    }
}


module.exports = { importData }