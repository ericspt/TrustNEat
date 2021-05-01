import React, { useState, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import LinkButton from './LinkButton'
import './App.css'
import Select from 'react-select'
import filled from '../filled.png'
import nonfilled from '../non-filled.png'

function ViewRestaurant({ restaurants, reviews, account, uploadImage, buyCodes, codes, deleteRestaurant }) {

    //Declare IPFS
    const ipfsClient = require('ipfs-http-client')
    const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

    const { id } = useParams()
    const restaurant = restaurants[id]
    const [buffer, setBuffer] = useState("")
    const [codesN, setCodes] = useState("")

    const options = [
        { value: 1, label: '1' },
        { value: 5, label: '5' }
    ]

    const randomCode = () => {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }

    const checkIfCodeUsed = (theCode) => {
        for (var i = 0; i < restaurants[id].reviewCount; i++) {
            if (reviews[id][i].code === theCode) {
                return true
            }
        }
        return false
    }

    const numberUsed = () => {
        var usedCodes = 0
        for (var j = 0; j < restaurants[id].numberOfCodes; j++) {
            if (checkIfCodeUsed(codes[id][j].code) !== false) {
                usedCodes++
            }
        }
        return usedCodes
    }

    const handleSubmit = (evt) => {
        evt.preventDefault()
        var codesArray = []
        for (var i = 0; i < codesN; i++) {
            codesArray.push(randomCode(16))
        }
        var numero = parseInt(restaurant.numberOfCodes) + parseInt(codesN)
        buyCodes(parseInt(id), restaurant.numberOfCodes, numero, codesArray, Date().toLocaleString())
    }

    const codesFunc = (codesV) => {
        setCodes(codesV.value)
    }

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

    const wording = () => {
        if(numberUsed() === 1) {
            return 'was'
        }
        return 'were'
    }

    const handleDelete = (evt) => {
        evt.preventDefault()
        deleteRestaurant(id)
    }
    return (
        <div>
			{ restaurant.deleted === false &&
				<div className="mt-5">
					<center>
					<div className="card border-dark w-75">
						<div className="card-header text-center"><strong>{ restaurant.name }</strong></div>
						<div className="card-body">
							<center>
							
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
			{ account === restaurant.restaurantOwner && restaurant.deleted === false &&
				<center><div className="card w-75 border-dark mt-3 final-card">
					<div className="card-header">
						<center><h3>Administration panel</h3></center>
					</div>
					<div className="card-body">
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
							<div className="col-4 overflow-auto text-center mt-2 mb-3 dont-pad">
								<h3>Upload profile image</h3>

								<form onSubmit={ async (event) => {
									event.preventDefault()
									try{
										const postResponse = await ipfs.add(buffer) 
										console.log("postResponse", postResponse);
										uploadImage(parseInt(id), postResponse.path)
									} catch(e){
										console.log("Error: ", e)
									}
								}} >
								&nbsp;
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
							<form onSubmit={handleDelete} className="col-4 dont-pad">
								<LinkButton className="btn btn-success btn-block mt-3" to={'/edit-restaurant/' + id}>Edit Details</LinkButton>
								<button type="submit" className="btn btn-danger btn-block mt-3 dont-pad">Delete Restaurant</button>
							</form>
							<div className="col-1"></div>
						</div>
					</div>
				</div></center>
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
