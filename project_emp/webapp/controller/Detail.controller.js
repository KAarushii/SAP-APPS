sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History , Filter, FilterOperator, FilterType) {
        "use strict";

        return Controller.extend("project_emp.controller.Detail", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("Detail").attachPatternMatched(this._onRouteMatched, this);

            },

            _onRouteMatched: function(oEvent){

                var sID= oEvent.getParameter("arguments").ID;
                 console.log(sID);

                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                // var oBusyDialog =  new sap.m.BusyDialog({
                //     title:"Loading data",
                //     text: "please wait......"
                // });
                // oBusyDialog.open();
                var ofilter = new sap.ui.model.Filter("ID", "EQ", sID);
                oModel.read("/Employees", {
                    filters:[ofilter],
                    success : function(response){
                        // oBusyDialog.close();
                            oJSONModel.setData(response.results);
                            this.getView().setModel(oJSONModel,"Employees");
                    }.bind(this),
                    error: function(error){
                        //    oBusyDialog.close();
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
                  oRouter.navTo("Mainview", {}, true);
                }
              
            }
           

        });
    });

