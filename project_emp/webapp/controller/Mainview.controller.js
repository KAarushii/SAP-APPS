sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project_emp.controller.Mainview", {
            onInit: function () {
                this.onReadEmpData();
            },
            onReadEmpData: function(){
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                // var oBusyDialog = new sap.m.BusyDialog({
                //     title: "Loading Data",
                //     text: "PLZ Wait ....."
                // });
               // oBusyDialog.open();
                oModel.read("/Employees",{
                   
                    success: function(resp){
                       // oBusyDialog.close();
                        oJSONModel.setData(resp.results);
                        this.getView().setModel(oJSONModel,"Employees");
                    }.bind(this),
                    error: function(error){
                       // oBusyDialog.close();
                    }
                });
            },
            onNavToDetails: function(oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var sID = oEvent.getSource().getCells()[0].getText();
                oRouter.navTo("Detail", {ID: sID});
              },
        });
    });
