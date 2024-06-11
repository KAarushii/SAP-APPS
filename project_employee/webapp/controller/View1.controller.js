sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Sorter',
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox, Filter,FilterOperator, Sorter, JSONModel, MessageToast ) {
        "use strict";
         
        var PageController = Controller.extend("sap.f.sample.SidePanelSingle.Page", {

            onToggle: function(e) {
                var oPreventExpand = this.byId("preventExpand"),
                    oPreventCollapse = this.byId("preventCollapse"),
                    bExpanded = e.getParameter("expanded");
    
                if (!bExpanded) {
                    if (oPreventCollapse.getState()) {
                        MessageToast.show("I am prevented COLLAPSE event");
                        oPreventCollapse.setState(false);
                        e.preventDefault();
                    }
                } else if (oPreventExpand.getState()) {
                    MessageToast.show("I am prevented EXPAND event");
                    oPreventExpand.setState(false);
                    e.preventDefault();
                }
            }
    
        });
    
        
        return Controller.extend("projectemployee.controller.View1", {
            onInit: function () {
                this.onReadEmpData();
            },
            onNavToDetails: function(oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var sID = oEvent.getSource().getCells()[0].getText();
                oRouter.navTo("Detail", {ID: sID});
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
                    urlParameters:{
                        "$expand": "department"
                    },
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
            
            onFilter: function (oEvent) {
                this.sSearchQuery = oEvent.getSource().getValue();
                this.fnApplyFiltersAndOrdering();
            },

            fnApplyFiltersAndOrdering: function (oEvent){
                var aFilters = [],
                    aSorters = [];
    
                if (this.bGrouped) {
                    aSorters.push(new Sorter("name", this.bDescending, this._fnGroup));
                } else {
                    aSorters.push(new Sorter("name", this.bDescending));
                }
    
                if (this.sSearchQuery) {
                    var oFilter = new Filter("name", FilterOperator.Contains, this.sSearchQuery);
                    aFilters.push(oFilter);
                }

                
    
                this.byId("_IDGenTable1").getBinding("items").filter(aFilters).sort(aSorters);
            },
             
            onFilterSelect: function (oEvent) {
                var oBinding = this.byId("_IDGenTable1").getBinding("items"),
                    sKey = oEvent.getParameter("key"),
                    // Array to combine filters
                    aFilters = []
                    
                console.log(sKey);
                if (sKey === "ABAP") {
                    aFilters.push(
                        new Filter([
                            new Filter([ new Filter("department_ID", "EQ", "5b690b74-f80f-4d4b-a26b-ddac619f7641")], true),
                            
                        ], false)
                    );
                } else if (sKey === "DIGITAL") {
                    aFilters.push(
                        new Filter([
                            new Filter([ new Filter("department_ID", "EQ", "48d2698e-c318-4729-9acd-e580e87d04f0")], true),
                        ], false)
                    );
                } 
    
                oBinding.filter(aFilters);
            },
             

            onReadKey:function(){
                var that = this;
                   var oModel = this.getOwnerComponent().getModel();
                   var num = 1;
                   oModel.read("/Employees("+num+")"),{
                        success:function(odata){
                         var jModel = new sap.ui.model.json.JSONModel(odata);
                         that.getView().byId("name").setModel(jModel); 
                        },error:function(oError){
               console.log(oError);
                 }
               }
               },

            onRowClick: function(oEvent){
                //var oPath = oEvent.getSource().getBindingContext('Emp').getPath();
            if(!this.oDialog){
                this.loadFragment({
                    name:"projectemployee.fragment.dialog"
                }).then(function(odialog){
                    this.oDialog = odialog;
                    this.oDialog.open();
                   
                }.bind(this))
            }else{
                this.oDialog.open();
               
                }
            },
            handleCloseDialog: function(){
                this.oDialog.close();
            },
            savedata: function(){
                const myUniversallyUniqueID = globalThis.crypto.randomUUID();
                var a = this.byId("name1");
                var fmana = a.getValue();
                var b = this.byId("name2");
                var fname = b.getValue();
                var c = this.byId("name3");
                var fmail = c.getValue();
               
               
                var record = {
                    "ID": myUniversallyUniqueID,
                    "createdAt": null,
                    "createdBy": null,
                    "modifiedAt":null,
                    "modifiedBy":null,
                    "name": fname,
                    "email_id": fmail,
                    "manager": fmana,
                }
               
                console.log(record);
                jQuery.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/v2/odata/v4/employee-services/Employees",
                    data: JSON.stringify(record),
                    success: function (data) {
                        MessageBox.success("Data saved to local database successfully!");
                        handleCloseDialog();
                    },
                    error: function (err) {
                        MessageBox.error("Error saving data to local database: " + err.responseText);
                    }
                });
           
            },
            
            
        });
        return PageController;
    });
