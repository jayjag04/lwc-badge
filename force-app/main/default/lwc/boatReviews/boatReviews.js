import { api, LightningElement, track } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation';

// imports
export default class BoatReviews extends NavigationMixin(LightningElement) {
        // Private
        boatId;
        error;
        @track
        boatReviews=[];
        isLoading = false;
        
        // Getter and Setter to allow for logic to run on recordId change
        get recordId() { return this.boatId;}
        @api
        set recordId(value) {
          //sets boatId attribute
          this.setAttribute("boatId", value);
          //sets boatId assignment
          this.boatId = value;
          //get reviews associated with boatId
          this.getReviews();
        }
        
        // Getter to determine if there are reviews to display
        get reviewsToShow() { 
                // if(this.boatReviews !== null && this.boatReviews !== undefined && this.boatReviews.length > 0) return true;
                // return false;
                console.log(this.boatReviews.length);
                return this.boatReviews.length > 0;
        }
        
        // Public method to force a refresh of the reviews invoking getReviews
        @api
        refresh() { 
                this.getReviews();
        }
        
        // Imperative Apex call to get reviews for given boat
        // returns immediately if boatId is empty or null
        // sets isLoading to true during the process and false when it’s completed
        // Gets all the boatReviews from the result, checking for errors.
        getReviews() { 
                if(this.boatId === '' || this.boatId === undefined) return;
                
                this.isLoading = true;

                getAllReviews( { boatId:  this.boatId})
                .then((result) => {
                          this.boatReviews = result;
                          console.log(result);
                          // result.forEach(boatReview => this.boatReviews.push(boatReview));
                          console.log(this.boatReviews.length);
                          this.error = undefined;
                }).catch(err => {
                        console.log(err);
                        this.boatReviews = undefined;
                })
                .finally(() => { this.isLoading = false;});

        }
        
        // Helper method to use NavigationMixin to navigate to a given record on click
        navigateToRecord(event) {  
                event.preventDefault();
console.log(event.currentTarget.dataset.recordId);
                this[NavigationMixin.Navigate]({
                        type: 'standard__recordPage',
                        attributes: {
                            recordId: event.currentTarget.dataset.recordId,
                            objectApiName: 'User',
                            actionName: 'view'
                        }
                });
        }
}