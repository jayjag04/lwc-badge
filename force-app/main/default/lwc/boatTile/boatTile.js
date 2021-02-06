import { api, LightningElement } from "lwc";

// imports
export default class BoatTile extends LightningElement {
  @api boat;
  @api selectedBoatId;

  // Getter for dynamically setting the background image for the picture
  get backgroundStyle() {
    return `background-image: url(${this.boat.Picture__c})`;
  }

  // Getter for dynamically setting the tile class based on whether the
  // current boat is selected
  get tileClass() {
    const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
    const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";

    if (this.selectedBoatId === this.boat.Id) {
      return TILE_WRAPPER_SELECTED_CLASS;
    }
    return TILE_WRAPPER_UNSELECTED_CLASS;
  }

  // Fires event with the Id of the boat that has been selected.
  selectBoat() {
    // this.selectedBoatId = this.boat.Id;
    console.log("entering boatTile.selectBoat");
    console.log(this.boat.Id);
    let boatSelectedEvent = new CustomEvent("boatselect", {
      bubbles: true,
      detail: { boatId: this.boat.Id }
    });
    this.dispatchEvent(boatSelectedEvent);
    console.log("leaving boatTile.selectBoat");
  }
}