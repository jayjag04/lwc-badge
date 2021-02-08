import { api, LightningElement } from "lwc";

import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c';
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import BOAT_FIELD from '@salesforce/schema/BoatReview__c.Boat__c';

import { ShowToastEvent } from "lightning/platformShowToastEvent";

const SUCCESS_TITLE = "Review Created!"; 
const SUCCESS_VARIANT = "success"; 

export default class BoatAddReviewForm extends LightningElement {
  // Private
  boatId;
  rating;
  boatReviewObject = BOAT_REVIEW_OBJECT;
  nameField = NAME_FIELD;
  commentField = COMMENT_FIELD;
  labelSubject = "Review Subject";
  labelRating = "Rating";
  subscription;

  // Public Getter and Setter to allow for logic to run on recordId change
  get recordId() {
    return this.boatId;
  }

  @api
  set recordId(value) {
    //sets boatId attribute
    this.setAttribute("boatId", value);
    //sets boatId assignment
    this.boatId = value;
  }
 
  // Gets user rating input from stars component
  handleRatingChanged(event) {
    this.rating = event.detail.rating;
  }

  // Custom submission handler to properly set Rating
  // This function must prevent the anchor element from navigating to a URL.
  // form to be submitted: lightning-record-edit-form
  handleSubmit(event) {
    event.preventDefault();

    // now set the rating field
    const fields = event.detail.fields;
    fields.Boat__c = this.boatId;
    fields.Rating__c = this.rating;
    this.template.querySelector('lightning-record-edit-form').submit(fields);

  }

  // Shows a toast message once form is submitted successfully
  // Dispatches event when a review is created
  handleSuccess(event) {
    // TODO: dispatch the custom event and show the success message
    const updatedRecord = event.detail.id;
    console.log('onsuccess: ', updatedRecord);
  
    const toastEvent = new ShowToastEvent({
      title: SUCCESS_TITLE,
      message: "Review Created!",
      variant: SUCCESS_VARIANT
    });
    this.handleReset();
    this.dispatchEvent(toastEvent);

    // create and dispatch the createreview event
    const createreviewEvent = new CustomEvent('createreview');
    this.dispatchEvent(createreviewEvent);
  }

  // Clears form data upon submission
  // TODO: it must reset each lightning-input-field
  handleReset() {
    
    const inputFields = this.template.querySelectorAll('lightning-input-field'); 
    if(inputFields) {
      inputFields.forEach(field => field.reset());
    }
    this.rating = 0;
    // this.template.querySelector('c-five-star-rating').value = 0;
  }
}
