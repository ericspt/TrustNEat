import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import './App.css'

 
function EditRestaurant ({ editRestaurant, restaurants }) {

    const { id } = useParams("")
    const [restaurantAddress, setAddress] = useState("");
    const [restaurantLocality, setLocality] = useState("");
    const [restaurantCountry, setCountry] = useState("");
    const [restaurantWebsite, setWebsite] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        editRestaurant(id, restaurantAddress, restaurantLocality, restaurantCountry, restaurantWebsite)
    }
    
    return ( 
        <center>
            <div className="mt-5">
				{ restaurants[id].deleted === false &&
				<div>
					<center>
						<h2>
							Edit restaurant
						</h2>
						<h5>
							Editing a restaurant's details costs a small transaction fee depending on the Ethereum traffic and ETH's value as a cryptoccurency.
						</h5>
					</center>
					<div className="row">
						<div id="content" className="container-fluid">
							<form onSubmit={handleSubmit} >
									Address
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
								<button type="submit" className="col-md-4 mt-3 btn btn-success btn-block btn-md">Edit Details</button>
							</form>
						</div>
					</div>
				</div>
				}
            </div>
        </center>
    );
}

export default EditRestaurant;
