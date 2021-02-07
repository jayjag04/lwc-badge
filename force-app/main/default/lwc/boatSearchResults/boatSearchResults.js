import { api, LightningElement, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import { publish, MessageContext } from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";

const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship it!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";

export default class BoatSearchResults extends LightningElement {
  selectedBoatId = "";
  columns = [];
  boatTypeId = "";
  boats;
  isLoading = false;

  // wired message context
  @wire(MessageContext)
  messageContext;

  // wired getBoats method
  @wire(getBoats)
  wiredBoats(result) {
    if (result.data) this.boats = result.data;
  }

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.boatTypeId = boatTypeId;
    getBoats({ boatTypeId: boatTypeId }).then((result) => {
      this.boats = result;
      this.boats.forEach((boat) => {
        // console.log(boat.Name, boat.Description__c);
      });
      this.isLoading = false;
      this.notifyLoading(this.isLoading);
    });
  }

  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  refresh() {}

  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    // explicitly pass boatId to the parameter recordId
    let message = { recordId: boatId };
    publish(this.messageContext, BOATMC, message);
  }

  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then(() => {})
      .catch((error) => {})
      .finally(() => {});
  }
  // Check the current value of isLoading before dispatching
  // the doneloading or loading custom event
  notifyLoading(isLoading) {
    let eventName = isLoading ? "loading" : "doneloading";
    let eve = new CustomEvent(eventName, { bubbles: true });
    this.dispatchEvent(eve);
  }
}
