import React, { useState, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import './App.css'
import Select from 'react-select';
 
function RateRestaurant ({ restaurants, reviews, codes, account, addReview }) {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [rating, setRating] = useState("")
    const { id } = useParams()
    var { code } = useParams()
    var [codeToSubmit, setCode] = useState("")
    

    const ratingFunc = (ratingV) => {
        setRating(ratingV.value)
    }

    const options = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' },
        { value: 8, label: '8' },
        { value: 9, label: '9' },
        { value: 10, label: '10' }
    ]

    const checkIfAlreadyReviewed = () => {
        for (var i = 0; i < restaurants[id].reviewCount; i++) {
            if (reviews[id][i].reviewOwner === account) {
                return 'You have already reviewed this restaurant.'
            }
        }
        return false
    }
    const checkIfRestaurantOwner = () => {
        if (restaurants[id].restaurantOwner === account) {
            return 'You added this restaurant and therefore cannot review it.'
        }
        return false 
    }
    const checkIfCodeInvalid = (theCode) => {
        for (var i = 0; i < restaurants[id].numberOfCodes; i++) {
            if (codes[id][i].code === theCode) {
                return false
            }
        }
        return 'This code is invalid.'
    }
    const checkIfCodeUsed = (theCode) => {
        for (var i = 0; i < restaurants[id].reviewCount; i++) {
            console.log(reviews[id][i])
            console.log(theCode)
            if (reviews[id][i].code === theCode) {
                return 'This review code is already used.'
            }
        }
        return false
    }
    const val = checkIfAlreadyReviewed()
    const val2 = checkIfRestaurantOwner()
    const val3 = checkIfCodeUsed(code)

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (codeToSubmit === "")
        {
            codeToSubmit = code
        }
        if (checkIfCodeInvalid(codeToSubmit) === false && val === false && val2 === false && checkIfCodeUsed(codeToSubmit) === false) {
            addReview(parseInt(id), name, description, rating, codeToSubmit, Date().toLocaleString(), account)
        }
    }
    
    return ( 
        <center>
        { val === false && val2 === false && val3 === false && restaurants[id].deleted === false && 
            <div className="mt-5">
				<center>
					<h2>
						Rate restaurant
					</h2>
					<h5>
						Rating a restaurant requires a small fee. However, this will be automatically returned by the application along with a small reward.
					</h5>
				</center>
                <div className="row">
                    <div id="content" className="container-fluid">
                        <form onSubmit={handleSubmit} >
                            
                                Review name
                                <div className="row">
                                <div className="col-md-4"></div>
                                <input className="col-md-4" maxLength="20" value={name} onChange={e => setName(e.target.value)} />
                                <div className="col-md-4"></div>
                                </div> 
                                <div className="row">
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    { (20 - name.length) + " characters left"}
                                </div>
                                <div className="col-md-4"></div>
                                </div> 
                                <div className="mt-3">
                                Review 
                                </div>
                                <div className="row">
                                <div className="col-md-4"></div>
                                <textarea className="col-md-4" maxlength="100" value={description} onChange={e => setDescription(e.target.value)} />
                                <div className="col-md-4"></div>
                                </div>
                                <div className="row">
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    { (100 - description.length) + " characters left"}
                                </div>
                                <div className="col-md-4"></div>
                                </div> 
                                <div className="mt-3">
                                Rating (1 to 10)
                                </div>
                                <div className="row">
                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                <Fragment>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={1}
                                        isSearchable={true}
                                        name="rating"
                                        options={options}
                                        onChange={ratingFunc}
                                    />
                                </Fragment>
                                </div>
                                <div className="col-md-4"></div>
                                </div>
                                <div className="mt-3">
                                Review code
                                </div>
                                <div className="row">
                                <div className="col-md-4"></div>
                                {code === "your-code" && <input className="col-md-4" value={codeToSubmit} onChange={e => setCode(e.target.value)} />}
                                {code !== "your-code" && <input className="col-md-4" value={code} disabled />}
                                <div className="col-md-4"></div>
                                </div> 
                                
                            <button type="submit" className="col-md-4 mt-3 btn btn-success btn-block btn-md">Rate Restaurant</button>
                        </form>
                    </div>
                </div>
            </div>
        }
        { val !== false &&
        <div className="mt-5">
            { val }
        </div>
        }
        { val2 !== false &&
        <div className="mt-5">
            { val2 }
        </div>
        }
        { val3 !== false &&
        <div className="mt-5">
            { val3 }
        </div>
        }
		{ restaurants[id].deleted === true &&
		<div className="mt-5">
			<h3>This restaurant has been deleted.</h3>
		</div>
		}
        </center>
    );
}

export default RateRestaurant;
