import React, { } from 'react'
import { useParams } from 'react-router-dom'
import './App.css'

/**
 * This function renders the page for viewing codes. It will show them as both alphanumerical and QR, as well as
 * information on whether they are used.
 * It takes as parameters the list of restaurants, codes, reviews and the wallet address.
 */
function ViewCodes({ restaurants, account, codes, reviews }) {

	// The id of the restaurant taken from the URL
    const { id } = useParams();
    const restaurant = restaurants[id]
	// The QRCode React component is imported
    var QRCode = require('qrcode.react');

	/*
	This function checks if a code is already used by going through all the reviews of the restaurant and
	searching for it. It returns Used! if the code is found. 
	*/
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

	// Render the page's content if the wallet address corresponds to the one of the restaurant's owner and if the 
	// restaurant is not deleted
    return (
        <div className="mt-5">
            { account === restaurant.restaurantOwner && restaurant.deleted === false &&
			<div>
				<center>
					<h2>
						Restaurant's codes
					</h2>
					<h5>
						These are the restaurant's QR codes. Either copy the images over on the bill, show them to the clients, or copy the code over.
					</h5>
				</center>
				<div className="row">
					<div className="col-3"></div>
					<div className="col-6 mt-5">
						{
						// Map through the codes and assign a key to each code, then extract information from it
						}
						{ codes[id].map((code, key) => {
							return (
							<div key={key}>
								<center>
								<div className="card w-75 mt-3">
									<div className="card-body">
										{
										// Use the QRCode imported package to render QR codes encoding links for reviewing
										}
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
			</div>
            }
        </div>
    )
}

export default ViewCodes;
