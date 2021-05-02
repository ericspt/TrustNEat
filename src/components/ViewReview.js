import React from 'react'
import { useParams } from 'react-router-dom'
import LinkButton from './LinkButton'
import './App.css'

/**
 * This function renders the page for viewing reviews along with their information.
 * It takes as parameters the lists for reviews and codes
 */
function ViewReview({ codes, reviews }) {

	// The ids of the restaurant and the review
    const { id } = useParams()
    const { idRv } = useParams()
	// The review and code information taken from the bidimensional arrays
    const review = reviews[id][idRv]
	const theCode = codes[id][idRv]
	// Render the page's content
    return (
        <div>
            <center>
                <div className="card w-75 mt-5">
                    <div className="card-body small-pad-top">
                        <div className="card-text text-center">
                            <p>Name: <b>{ review.name }</b> </p>
                            <p>Review: <b>{ review.text }</b> </p>
                            <p>Rating: <b>{ review.rating }</b> </p>
                            <p>Code: <b>{ review.code }</b> </p>
                            <p>The review was added on: <b>{ review.timeAdded }</b> </p>
							<p>The code was generated at: <b>{ theCode.timeGenerated }</b> </p>
                            <p>The review was added by (public address of wallet): <b>{ review.reviewOwner }</b> </p>
                            <LinkButton className="btn btn-info btn-block mt-3" to={'/view-restaurant/' + id}>Back</LinkButton>
                        </div>
                    </div>
                </div>
            </center>
        </div>
    )
}

export default ViewReview;
