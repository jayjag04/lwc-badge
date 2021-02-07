import { api, LightningElement, track, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import { publish, MessageContext } from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship it!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const CONST_ERROR = "Error";
const ERROR_VARIANT = "error";

export default class BoatSearchResults extends LightningElement {
  selectedBoatId = "";
  columns = [
    { label: "Name", fieldName: "Name", editable: true },
    { label: "Length", fieldName: "Length__c", type: "number", editable: true },
    { label: "Price", fieldName: "Price__c", type: "currency", editable: true },
    { label: "Description", fieldName: "Description__c", editable: true }
  ];
  boatTypeId = "";
  @track boats;
  isLoading = false;

  trackValues = [];

  // wired message context
  @wire(MessageContext)
  messageContext;

  // wired getBoats method
  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  wiredBoats(result) {
    if (result.data) {
      this.boats = result.data;
    }
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
      // this.boats.forEach((boat) => {
      //   // console.log(boat.Name, boat.Description__c);
      // });
      this.isLoading = false;
      this.notifyLoading(this.isLoading);
    });
  }

  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  async refresh() {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

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
    console.log(updatedFields);
    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then(() => {
        const toastEvent = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(toastEvent);
        const elem = this.template.querySelector("lightning-datatable");
        console.log(elem.draftValues);
        elem.draftValues = [];
        console.log(elem.draftValues);
        this.refresh();
      })
      .catch((error) => {
        console.log(error.message);
        const toastEvent = new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.message,
          variant: ERROR_VARIANT
        });
        this.dispatchEvent(toastEvent);
      })
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
