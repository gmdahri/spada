
const { default: mongoose } = require("mongoose");
// const SubCategory = require("../Models/SubCategory");

const googleTrends = require('google-trends-api');

const getTrends = async (req, res, next) => {
    try {
        const { keyword } = req.body;

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

        const newGeoMapData = await Promise.all(promises);

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
