import React, { useState } from 'react'
import './App.css'

/** 
 * This function takes the user account and the function for adding a restaurant, renders the frontend 
 * and handles IPFS calls, as well as the actual addition of a restaurant.
 */
function AddRestaurant ({ account, addRestaurant }) {

	// Restaurant parameters become state parameters
    const [name, setName] = useState("")
    const [restaurantAddress, setAddress] = useState("")
    const [restaurantLocality, setLocality] = useState("")
    const [restaurantCountry, setCountry] = useState("")
    const [restaurantWebsite, setWebsite] = useState("")
    const [imageHash, setImageHash] = useState("")
    //Declare IPFS
    const ipfsClient = require('ipfs-http-client')
    const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

	// This function handles the submission to IPFS of a profile picture
    const handleSubmit = async (evt) => {
        evt.preventDefault()
		// postResponse is the IPFS result, an image hash. 
        var postResponse = { path: "" } 
		// if the image is not empty, add it to IPFS
        if (imageHash !== "") {
            try{
                postResponse = await ipfs.add(imageHash)
            } catch(e){
                console.log("Error: ", e)
            }
        }
        addRestaurant(name, restaurantAddress, restaurantLocality, restaurantCountry, restaurantWebsite, postResponse.path, account)
    }
    // Render the page
    return ( 
        <center>
            <div className="mt-5">
				<center>
					<h2>
						Add restaurant
					</h2>
					<h5>
						Adding a restaurant to the platform costs a small transaction fee depending on the Ethereum traffic and ETH's value as a cryptoccurency.
					</h5>
				</center>
                <div className="row mt-3">
                    <div id="content" className="container-fluid">
						{ 
						/**
						 * Begin the form for addition of a new restaurant by having input fields
						 * match the state variable. Whenever a value of an input field is changed,
						 * the corresponding state variable will be changed accordingly
						 * (e.g. setName(e.target.value) will change the name with the value of the field)
						 */
						}
                        <form onSubmit={handleSubmit} >
							Name
							<div className="row">
								<div className="col-md-4"></div>
								<input className="col-md-4" value={name} onChange={e => setName(e.target.value)} />
								<div className="col-md-4"></div>
							</div> 
							<div className="mt-3">
								Address
							</div>
							<div className="row">
								<div className="col-md-4"></div>
								<input className="col-md-4" value={restaurantAddress} onChange={e => setAddress(e.target.value)} />
								<div className="col-md-4"></div>
							</div>
							<div className="mt-3">
								Locality / City
							</div>
							<div className="row">
								<div className="col-md-4"></div>
								<input className="col-md-4" value={restaurantLocality} onChange={e => setLocality(e.target.value)} />
								<div className="col-md-4"></div>
							</div>
							<div className="mt-3">
								Country
							</div>
							<div className="row">
								<div className="col-md-4"></div>
								<input className="col-md-4" value={restaurantCountry} onChange={e => setCountry(e.target.value)} />
								<div className="col-md-4"></div>
							</div>
							<div className="mt-3">
								Website
							</div>
							<div className="row">
								<div className="col-md-4"></div>
								<input className="col-md-4" value={restaurantWebsite} onChange={e => setWebsite(e.target.value)} />
								<div className="col-md-4"></div>
							</div>
							<div className="mt-3">
								Profile picture
							</div>
							<div className="radio">
								<label>
									<input
									type="radio"
									value="Default"
									name="pic"
									checked="checked"
									onChange={e => setImageHash("")}
									/>
									&nbsp; Default
								</label>
							</div>
							<div className="radio">
								<label>
									<input
									type="radio"
									value="Custom"
									name="pic"
									/> &nbsp;
									{
									/**
									 * Uploading an image to the web application turns it into an array buffer with image
									 * information, which will be uploaded to IPFS in the handleSubmit function. 
									 */
									}
									<input className='mt-2' type='file' accept=".png, .jpg, .jpeg" onChange={(event) => {
										event.preventDefault()
										const file = event.target.files[0]
										const reader = new window.FileReader()
										reader.readAsArrayBuffer(file)
										reader.onloadend = () => {
											setImageHash(Buffer(reader.result))
										}
									}} />
								</label>
							</div>
                            <button type="submit" className="col-md-4 mt-3 btn btn-success btn-block btn-md">Add Restaurant</button>
                        </form>
                    </div>
                </div>
            </div>
        </center>
    );
}

export default AddRestaurant;
