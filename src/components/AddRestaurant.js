import React, { useState } from 'react'
import './App.css'

 
function AddRestaurant ({ restaurants, account, addRestaurant }) {

    const [name, setName] = useState("");
    const [restaurantAddress, setAddress] = useState("");
    const [restaurantLocality, setLocality] = useState("");
    const [restaurantCountry, setCountry] = useState("");
    const [restaurantWebsite, setWebsite] = useState("");
    const [imageHash, setImageHash] = useState("");
    //Declare IPFS
    const ipfsClient = require('ipfs-http-client')
    const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        var postResponse = { path: "" }
        if (imageHash !== "") {
            try{
                postResponse = await ipfs.add(imageHash)
            } catch(e){
                console.log("Error: ", e)
            }
        }
        addRestaurant(name, restaurantAddress, restaurantLocality, restaurantCountry, restaurantWebsite, postResponse.path, account)
    }
    
    return ( 
        <center>
            <div className="mt-5">
                <div className="row">
                    <div id="content" className="container-fluid">
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
