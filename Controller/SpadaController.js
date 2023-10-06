
const { default: mongoose } = require("mongoose");
// const SubCategory = require("../Models/SubCategory");

const googleTrends = require('google-trends-api');



// const getTrends = async (req, res, next) => {
//     try {
//         const { keyword } = req.body;

//         let newGeoMapData = [];
//         for (let i = 0; i < keyword.length; i++) {

//             await googleTrends.interestByRegion({ keyword: keyword[i], resolution: 'COUNTRY' })
//                 .then((res1) => {
//                     const jsonData = JSON.parse(res1);
//                     const geoMapData = jsonData.default.geoMapData.map((value) => {
//                         const ob = {
//                             geoCode: value.geoCode,
//                             geoName: value.geoName,
//                             value: value.value,
//                             keyword: keyword[i]
//                         }
//                         return ob;
//                     })
//                     newGeoMapData.push(geoMapData);
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 })
//         }
//         if (newGeoMapData.length > 0) {
//             res.status(200).json({ success: true, data: newGeoMapData });
//         }
//     } catch (err) {
//         next(err);
//     }
// };
const getTrends = async (req, res, next) => {
    try {
        const { keyword } = req.body;

        // Create an array of promises for all the keyword requests
        const promises = keyword.map(async (word) => {
            const res1 = await googleTrends.interestByRegion({ keyword: word, resolution: 'COUNTRY' });
            const jsonData = JSON.parse(res1);
            const geoMapData = jsonData.default.geoMapData.map((value) => ({
                geoCode: value.geoCode,
                geoName: value.geoName,
                value: value.value,
                keyword: word,
            }));
            return geoMapData;
        });

        // Wait for all promises to resolve
        const newGeoMapData = await Promise.all(promises);

        // Send the response
        if (newGeoMapData.length > 0) {
            res.status(200).json({ success: true, data: newGeoMapData.flat() });
        }
    } catch (err) {
        next(err);
    }
};




module.exports = {
    getTrends,

};
