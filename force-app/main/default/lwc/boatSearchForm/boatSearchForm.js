import { api, LightningElement, track, wire } from "lwc";
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";

// imports
// import getBoatTypes from the BoatDataService => getBoatTypes method';
export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = "";

  // Private
  error = undefined;

  // Needs explicit track due to nested data
  @track
  searchOptions = [];

  // Wire a custom Apex method
  @wire(getBoatTypes)
  BoatTypes({ error, data }) {
    if (data) {
      console.log(JSON.stringify(data));
      this.searchOptions = data.map((type) => {
        return { label: type.Name, value: type.Id };
      });

      this.searchOptions.unshift({ label: "All Types", value: "" });
    } else if (error) {
      this.searchOptions = undefined;
      this.error = error;
    }
  }

  // Fires event that the search option has changed.
  // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
  handleSearchOptionChange(event) {
    this.selectedBoatTypeId = event.target.value;
    // Create the const searchEvent
    // searchEvent must be the new custom event search
    const searchEvent = new CustomEvent("search", {
      bubbles: true,
      detail: { boatTypeId: this.selectedBoatTypeId }
    });
    this.dispatchEvent(searchEvent);
  }
}
