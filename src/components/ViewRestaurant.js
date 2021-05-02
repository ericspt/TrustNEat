import React, { useState, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import LinkButton from './LinkButton'
import './App.css'
import Select from 'react-select'
import filled from '../filled.png'
import nonfilled from '../non-filled.png'

/**
 * This function render's the page for viewing restaurant, as well as the administration panel in case
 * the person viewing it has the wallet address of the restaurant's owner. 
 * As parameters, the restaurants, codes, reviews and account are given (variables)
 * Moreover, the functions for uploading and image and deleting a restaurant are also given
 */
function ViewRestaurant({ restaurants, reviews, account, uploadImage, buyCodes, codes, deleteRestaurant }) {

    // Declare IPFS
    const ipfsClient = require('ipfs-http-client')
    const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

	// Declare the id of the restaurant, as well as state variables for buffer of uploaded image and number of codes selected
    const { id } = useParams()
    const restaurant = restaurants[id]
    const [buffer, setBuffer] = useState("")
    const [codesN, setCodes] = useState("")

	// Hardcode the number of codes buyable by the user
    const options = [
        { value: 1, label: '1' },
        { value: 5, label: '5' }
    ]

	// This functions computes a random 16-digit alphanumerical string
    const randomCode = () => {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }

	// This function checks whether a code was already used by going through all the reviews of the given restaurant
    const checkIfCodeUsed = (theCode) => {
        for (var i = 0; i < restaurants[id].reviewCount; i++) {
            if (reviews[id][i].code === theCode) {
                return true
            }
        }
        return false
    }

	// This function computes how many codes were used and how many unused to give the user a preview of 
	// their code management
    const numberUsed = () => {
        var usedCodes = 0
        for (var j = 0; j < restaurants[id].numberOfCodes; j++) {
            if (checkIfCodeUsed(codes[id][j].code) !== false) {
                usedCodes++
            }
        }
        return usedCodes
    }

	/* 
	This function handles the submission of buying codes. 
	*/
    const handleSubmit = (evt) => {
        evt.preventDefault()
		// The code array is the potential array of 1 or 5 elements
        var codesArray = []
        for (var i = 0; i < codesN; i++) {
            codesArray.push(randomCode(16))
        }
		// The numero variable is the number to which the codes will be added as an index
		// Date.toLocaleString is the current timestamp
        var numero = parseInt(restaurant.numberOfCodes) + parseInt(codesN)
        buyCodes(parseInt(id), restaurant.numberOfCodes, numero, codesArray, Date().toLocaleString())
    }

	// This function will change the codes variable based on the value from the dropdown
    const codesFunc = (codesV) => {
        setCodes(codesV.value)
    }

	// This function computes the rating for a given restaurant 
    const computeRatingHelper = (id) => {
        var sum = 0.0
        var hasReviews = false
        for (var j = 0; j < restaurants[id].reviewCount; j = j + 1) {
            sum = sum + parseInt(reviews[id][j].rating)
            hasReviews = true
        }
        sum = sum / restaurants[id].reviewCount
        if (hasReviews) return sum
        return 0
    }

	// This function makes lists of 1s and 0s based on the restaurant's rating
    const drawStars = (id) => {
        var rating = parseInt(computeRatingHelper(id))
        var images = []
        for (var j = 1; j <= rating; j = j + 1) {
            images.push(1)
        }
        for (j = rating + 1; j <= 10; j = j + 1) {
            images.push(0)
        }
        return images 
    }

	// This functions makes lists of 1s and 0s based on the review's rating score
    const drawStarsR = (ratingg) => {
        var rating = parseInt(ratingg)
        var images = []
        for (var j = 1; j <= rating; j = j + 1) {
            images.push(1)
        }
        for (j = rating + 1; j <= 10; j = j + 1) {
            images.push(0)
        }
        return images 
    }

	// This function computes the wording for the phrase for code ownership
    const wording = () => {
        if(numberUsed() === 1) {
            return 'was'
        }
        return 'were'
    }

	// This function deletes the restaurant which is currently being viewed
    const handleDelete = (evt) => {
        evt.preventDefault()
        deleteRestaurant(id)
    }
	// Render page's contents
    return (
        <div>
			{ restaurant.deleted === false &&
				<div className="mt-5">
					<center>
					<div className="card border-dark w-75">
						<div className="card-header text-center"><strong>{ restaurant.name }</strong></div>
						<div className="card-body">
							<center>
							{
							// Render the restaurant's image using Infura's URL pattern and the restaurant's image's hash
							}
							{restaurant.imageHash !== "" && <img src={'https://ipfs.infura.io/ipfs/' + restaurant.imageHash} alt=" " className="img-fluid restaurant-img"></img>}
							<div className="card-text text-center">
								<p>Address: { restaurant.restaurantAddress }</p>
								<p>Locality/City: { restaurant.restaurantLocality }</p>
								<p>Country: { restaurant.restaurantCountry }</p>
								<p>Website: <a href={ restaurant.restaurantWebsite }>{ restaurant.restaurantWebsite }</a></p>
								<p>Rating: { computeRatingHelper(id) }</p>
							</div>
							<div className="card-text text-center">{drawStars(id).map((item, i) => {
									return (
										<div key={i} className="star">
											{
											// If the item from the list is 1, it is a filled start. Else, it is not filled.
											}
											{item === 1 && <img src={filled} alt=" " className="starImg"></img>}
											{item === 0 && <img src={nonfilled} alt=" " className="starImg"></img>}
										</div>
									);
								})}
							</div>
							{ account !== restaurant.restaurantOwner &&
								<LinkButton className="btn btn-success mt-2" to={'/view-restaurant/' + id + '/rate-restaurant/your-code'}>Rate</LinkButton>
							}
							</center>
						</div>
					</div>
					</center>
				</div>
			}
			{
			// Display the administration panel only if the wallet address of the current user is the same as the
			// restaurant's owner
			}
			{ account === restaurant.restaurantOwner && restaurant.deleted === false &&
				<center><div className="card w-75 border-dark mt-3 final-card">
					<div className="card-header">
						<center><h3>Administration panel</h3></center>
					</div>
					<div className="card-body">
						{
						// This form is being used for buying codes. The information is available using the state variables.
						}
						<form onSubmit={handleSubmit} >
							<div className="row">
							<div className="col-1"></div>
							<div className="col-4 mt-3">
								<center><h3>Your codes</h3>
								<p>You own { restaurant.numberOfCodes } review codes</p>
								<p>...of which { numberUsed() } { wording() } used</p></center>
							</div>
							<div className="col-2"></div>
							<div className="col-4 mt-3">
								<center><h3>Buy Review Codes</h3></center>
								{
								// The Fragment component is the dropdown that lets the user choose between 1 and 5 codes for purchase
								}
								<Fragment>
									<Select
										className="basic-single"
										classNamePrefix="select"
										defaultValue={options[0].value}
										isSearchable={true}
										name="codesN"
										options={options}
										onChange={codesFunc}
									/>
								</Fragment>
							</div>
							<div className="col-1"></div>
							</div>
							<div className="row">
								<div className="col-1"></div>
								<LinkButton className="btn btn-success col-4 mt-3 btn-block" to={'/view-restaurant/' + id + '/view-codes/'}>View codes</LinkButton>
								<div className="col-2"></div>
								<button type="submit" className="col-4 mt-3 btn btn-success btn-block">Buy</button>
								<div className="col-1"></div>
							</div>
						</form>
						<div className="row mt-3">
							<div className="col-1"></div>
							{
							// This div is used for uploading a profile image for the restaurant. 
							// The function for loading the image to IPFS is below in the try block
							// Additionally, the image is uploaded to the blockchain as well using the resulted hash from IPFS
							}
							<div className="col-4 overflow-auto text-center mt-2 mb-3 dont-pad">
								<h3>Upload profile image</h3>

								<form onSubmit={ async (event) => {
									event.preventDefault()
									try{
										const postResponse = await ipfs.add(buffer)
										uploadImage(parseInt(id), postResponse.path)
									} catch(e){
										console.log("Error: ", e)
									}
								}} >
								&nbsp;
								{
								// This input field accepts png, jpg, and jpeg images and converts them to array buffers which 
								// will be used for uploading to IPFS
								}
								<input type='file' accept=".png, .jpg, .jpeg" onChange={(event) => {
									event.preventDefault()
									const file = event.target.files[0]
									const reader = new window.FileReader()
									reader.readAsArrayBuffer(file)
									reader.onloadend = () => {
										setBuffer(Buffer(reader.result))
									}
								}} />
								<button type="submit" className="btn btn-success btn-block mt-3">Upload!</button>
								&nbsp;
								</form>
							</div>
							<div className="col-2"></div>
							{
							// The form for deleting the restaurant
							}
							<form onSubmit={handleDelete} className="col-4 dont-pad">
								<LinkButton className="btn btn-success btn-block mt-3" to={'/edit-restaurant/' + id}>Edit Details</LinkButton>
								<button type="submit" className="btn btn-danger btn-block mt-3 dont-pad">Delete Restaurant</button>
							</form>
							<div className="col-1"></div>
						</div>
					</div>
				</div></center>
			}
			{
			// This is a map function that displays the reviews as Bootstrap cards
			}
			{restaurant.reviewCount > 0 && restaurant.deleted === false &&
			<div className="main-land mt-2"><h2>Reviews</h2></div>}
			{ restaurant.deleted === false && reviews[id].map((review, key) => {
				
				return (
					<div key={key}>
						<div className="row mt-3">
							<div className="col-md-2"></div>
							<div className="col-md-8">
							<center>
							<div className="card w-75 border-dark final-card">
								<strong><div className="card-header text-center">{review.name}</div></strong>
								<div className="card-body">
									<p className="card-text text-center">"{review.text}"</p>
									{drawStarsR(review.rating).map((item, i) => {
										return (
											<div key={i} className="star">
												{item === 1 && <img src={filled} alt=" " className="starImg"></img>}
												{item === 0 && <img src={nonfilled} alt=" " className="starImg"></img>}
											</div>
										);
									})}
									<LinkButton className="btn btn-success btn-block mt-3" to={'/view-restaurant/' + id + '/view-review/' + key}>See details</LinkButton>
								</div>
							</div>
							</center>
							</div>
							<div className="col-md-2"></div>
						</div>
					</div>
				)
			})}
			{ restaurant.deleted === true &&
			<center>
				<h2>
					This restaurant is deleted
				</h2>
				<h5>
					This restaurant has been deleted. Access is no longer allowed for it.
				</h5>
			</center>
			}
        </div>
    )
}

export default ViewRestaurant;
