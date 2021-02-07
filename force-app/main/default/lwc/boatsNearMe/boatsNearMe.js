import { api, LightningElement, wire } from "lwc";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";

import { ShowToastEvent } from "lightning/platformShowToastEvent";
// imports
const LABEL_YOU_ARE_HERE = "You are here!";
const ICON_STANDARD_USER = "standard:user";
const ERROR_TITLE = "Error loading Boats Near Me";
const ERROR_VARIANT = "error";
export default class BoatsNearMe extends LightningElement {
  @api boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered = false;
  latitude;
  longitude;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, {
    latitude: "$latitude",
    longitude: "$longitude",
    boatTypeId: "$boatTypeId"
  })
  wiredBoatsJSON({ error, data }) {
    if (data) {
      this.createMapMarkers(data);
    }
    if (error) {
      console.log(error);
      this.isLoading = false;
      const evt = new ShowToastEvent({
        title: ERROR_TITLE,
        message: error.message,
        variant: ERROR_VARIANT
      });
      this.dispatchEvent(evt);
    }
  }

  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    if (this.isRendered) return;
    this.isRendered = true;
    this.getLocationFromBrowser();
  }

  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      },
      (err) => console.warn(`ERROR(${err.code}): ${err.message}`)
    );
  }

  // Creates the map markers
  createMapMarkers(boatData) {
    if (!boatData) return;
    boatData = JSON.parse(boatData);
    const newMarkers = boatData.map((boat) => {
      return {
        title: boat.Name,
        location: {
          Latitude: boat.Geolocation__Latitude__s,
          Longitude: boat.Geolocation__Longitude__s
        }
      };
    });
    newMarkers.unshift({
      icon: ICON_STANDARD_USER,
      title: LABEL_YOU_ARE_HERE,
      location: { Latitude: this.latitude, Longitude: this.longitude }
    });
    this.mapMarkers = newMarkers;
    this.isLoading = false;
  }
}
