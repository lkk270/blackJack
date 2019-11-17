const Hand = require('../models/model.js')

createHand = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must enter a hand',
        })
    }

    const hand = new Hand(body)

    if (!hand) {
        return res.status(400).json({ success: false, error: err })
    }

    hand
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: hand._id,
                message: 'Hand created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Hand not created!',
            })
        })
}

getHandById = async (req, res) => {
    await Hand.findOne({ _id: req.params.id }, (err, hand) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!hand) {
            return res
                .status(404)
                .json({ success: false, error: `Hand not found` })
        }
        return res.status(200).json({ success: true, data: hand })
    }).catch(err => console.log(err))
}

getHands = async (req, res) => {
    await Hand.find({}, (err, hands) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!hands.length) {
            return res
                .status(404)
                .json({ success: false, error: `Hand not found` })
        }
        return res.status(200).json({ success: true, data: hands })
    }).catch(err => console.log(err))
}


module.exports = {
    createHand,
    getHandById,
    getHands
}