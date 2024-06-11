sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("projectemployee.controller.Dept", {
            onInit: function () {
                this.onReadEmpData();
            },
            onNavToDetails: function(oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var sID = oEvent.getSource().getCells()[0].getText();
                oRouter.navTo("View1", {ID: sID});
              },
            onReadEmpData: function(){
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                // var oBusyDialog = new sap.m.BusyDialog({
                //     title: "Loading Data",
                //     text: "PLZ Wait ....."
                // });
               // oBusyDialog.open();
                oModel.read("/Department",{
                   
                    success: function(resp){
                       // oBusyDialog.close();
                        oJSONModel.setData(resp.results);
                        this.getView().setModel(oJSONModel,"Department");
                    }.bind(this),
                    error: function(error){
                       // oBusyDialog.close();
                    }
                });
            },
            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
              
                if (sPreviousHash !== undefined) 
                {
                  window.history.go(-1);
                } else
                {
                  var oRouter = this.getOwnerComponent().getRouter();
                  oRouter.navTo("Detail", {}, true);
                }
              
            }
            
        });
    });