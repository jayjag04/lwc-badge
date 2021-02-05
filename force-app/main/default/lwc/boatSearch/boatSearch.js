import { LightningElement } from "lwc";

export default class BoatSearch extends LightningElement {
  isLoading = false;

  // Handles loading event
  handleLoading() {}

  // Handles done loading event
  handleDoneLoading() {}

  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    console.log("entering boatSearch.searchBoats");
    console.log("boatTypeId: ", event.detail.boatTypeId);
    const ele = this.template.querySelector("c-boat-search-results");
    console.log(ele);
    ele.searchBoats(event.detail.boatTypeId);
    console.log("leaving boatSearch.searchBoats");
  }

  createNewBoat() {}
}