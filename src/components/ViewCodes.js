import React, { } from 'react'
import { useParams } from 'react-router-dom'
import './App.css'

function ViewCodes({ restaurants, account, codes, reviews }) {

    const { id } = useParams();
    const restaurant = restaurants[id]
    var QRCode = require('qrcode.react');

    const checkIfCodeUsed = (theCode) => {
        for (var i = 0; i < restaurants[id].reviewCount; i++) {
            console.log(reviews[id][i])
            console.log(theCode)
            if (reviews[id][i].code === theCode) {
                return 'Used!'
            }
        }
        return false
    }

    return (
        <div className="mt-3">
            { account === restaurant.restaurantOwner &&
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6 mt-5">
                    { codes[id].map((code, key) => {
                        return (
                        <div key={key}>
                            <center>
                            <div className="card w-75 mt-3">
                                <div className="card-body">
                                    <QRCode value={'localhost:3000/view-restaurant/' + id  + '/rate-restaurant/' + code.code} />
                                    <strong><div className="card-text text-center">{code.code}</div></strong>
                                    {
                                        checkIfCodeUsed(code.code) !== false &&
                                        <strong><div className="text-right"> {checkIfCodeUsed(code.code)}</div></strong>
                                    }
                                </div>
                            </div>
                            </center>
                        </div>)
                    })}
                </div>
                <div className="col-3"></div>
            </div>
            }
        </div>
    )
}

export default ViewCodes;
