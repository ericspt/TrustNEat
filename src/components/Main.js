import React, { useState } from 'react'
import LinkButton from './LinkButton'
import './App.css'
import filled from '../filled.png'
import nonfilled from '../non-filled.png'

function Main ({ restaurants, reviews }) {

    const [keyword, setKeyword] = useState("")

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
        console.log(images)
        return images 
    }

    return (
        <div>
            <div className="main-land mt-5">
                <h1>Welcome to Trust'N'Eat</h1>
                <h4>A trusted, decentralised platform for reviewing restaurants</h4>
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div class="input-group">
                            <input type="search" class="form-control rounded" placeholder="Search for any keyword..." aria-label="Search"
                                aria-describedby="search-addon" value={keyword} onChange={e => setKeyword(e.target.value)}/>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
            <div className="container restaurants-list">
                { restaurants.map((restaurant, key) => { 
                return(
                    <div key={key}>
                        { restaurant.deleted === false &&
                        (
                            restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
                            restaurant.restaurantAddress.toLowerCase().includes(keyword.toLowerCase()) ||
                            restaurant.restaurantLocality.toLowerCase().includes(keyword.toLowerCase()) ||
                            restaurant.restaurantCountry.toLowerCase().includes(keyword.toLowerCase()) ||
                            restaurant.restaurantWebsite.toLowerCase().includes(keyword.toLowerCase())
                        ) && 
                        <center>
                            <div className="card w-50 border-dark mt-3">
                                <div className="card-body mt-3">
                                    <div>
                                    <div className="row">
                                        <div className="col-2"></div>
                                        <div className="col-8">
                                            <div className="text-center" >
                                                <h2><b>{restaurant.name}</b></h2><br></br>
                                            </div>
                                        </div>
                                        <div className="col-2"></div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-1"></div>
                                        <div className="col-10">
                                            {drawStars(key).map((item, i) => {
                                                return (
                                                    <div key={i} className="star">
                                                        {item === 1 && <img src={filled} alt=" " className="starImg"></img>}
                                                        {item === 0 && <img src={nonfilled} alt=" " className="starImg"></img>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="col-1"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2"></div>
                                        <div className="col-8 card-text text-center" >
                                            {restaurant.imageHash !== "" && <img src={'https://ipfs.infura.io/ipfs/' + restaurant.imageHash} alt=" " className="img-fluid restaurant-img"></img>
                                            }
                                            {restaurant.imageHash === "" && <img src="https://i.imgur.com/Tqf6YvD.png" alt=" " className="img-fluid restaurant-img"></img>
                                            }
                                            <p>{restaurant.imageTitle}</p>
                                        </div>
                                        <div className="col-2"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2"></div>
                                        <LinkButton className="col-8 btn btn-success" to={ '/view-restaurant/' + JSON.stringify(key)}>View</LinkButton>
                                        <div className="col-2"></div>
                                    </div>
                                    </div>
                                </div> 
                            </div>
                        </center>
                        }
                    </div>
                )})}
            </div>
        </div>
    );
}

export default Main;
