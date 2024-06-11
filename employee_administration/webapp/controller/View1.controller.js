

    sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/m/Label',
        'sap/ui/model/Filter',
        'sap/ui/model/FilterOperator',
        'sap/ui/comp/smartvariants/PersonalizableInfo'
    ],
    function (Controller, JSONModel, Label, Filter, FilterOperator, PersonalizableInfo) {
        "use strict";
     
        return Controller.extend("employeeadministration.controller.View1", {
            onInit: function () {
                // this.applyData = this.applyData.bind(this);
                // this.fetchData = this.fetchData.bind(this);
                // this.getFiltersWithValues = this.getFiltersWithValues.bind(this);
     
                // this.oFilterBar = this.getView().byId("filterbar");
                // this.oTable = this.getView().byId("table");
     
                // this.oFilterBar.registerFetchData(this.fetchData);
                // this.oFilterBar.registerApplyData(this.applyData);
                // this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);
                
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
            onclickbtn: function(){
                var a = this.byId("inputS");
                var fil = a.getValue();
                var fil = a.getValue();
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                //var ofilter = new sap.ui.model.Filter("name", "EQ", fil);

                var InputFilter = new Filter({
                    filters: [
                      
                      new Filter({
                        path: 'email_id',
                        operator: FilterOperator.Contains,
                        value1: fil,
                        caseSensitive: false
                      }),
                      new Filter({
                        path: 'name',
                        operator: FilterOperator.Contains,
                        value1: fil,
                        caseSensitive: false
                      }),
                      new Filter({
                        path: 'department/dep_name',
                        operator: FilterOperator.Contains,
                        value1: fil,
                        caseSensitive: false
                      })
                      
                    ],
                    and: false
                    });
                                
                oModel.read("/Employees", {
                        urlParameters:{
                       "$expand": "department"
                        },
                filters:[InputFilter],
                success : function(response){
                    var b = this.byId("table1").setVisible(false);
                    var c = this.byId("table2").setVisible(true);
                    oJSONModel.setData(response.results);
                    this.getView().setModel(oJSONModel,"Employeesnew");
                }.bind(this),
                error: function(error){
                }
            });
            },

           onNavToDetails: function(oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var sID = oEvent.getSource().getCells()[0].getText();
                oRouter.navTo("Page", {ID: sID});
            },

            onRowClick: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Create");
            },
     
            onExit: function() {
                this.oModel = null;
                this.oExpandedLabel = null;
                this.oSnappedLabel = null;
                this.oFilterBar = null;
                this.oTable = null;
            },
     
            fetchData: function () {
                var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
                    aResult.push({
                        groupName: oFilterItem.getGroupName(),
                        fieldName: oFilterItem.getName(),
                        fieldData: oFilterItem.getControl().getSelectedKeys()
                    });
     
                    return aResult;
                }, []);
     
                return aData;
            },
     
            applyData: function (aData) {
                aData.forEach(function (oDataObject) {
                    var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                    oControl.setSelectedKeys(oDataObject.fieldData);
                }, this);
            },
     
            getFiltersWithValues: function () {
                var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();
     
                    if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
                        aResult.push(oFilterGroupItem);
                    }
     
                    return aResult;
                }, []);
     
                return aFiltersWithValue;
            },
     
            onSelectionChange: function (oEvent) {
                this.oFilterBar.fireFilterChange(oEvent);
            },
     
            onSearch: function () {
                var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl(),
                        aSelectedKeys = oControl.getSelectedKeys(),
                        aFilters = aSelectedKeys.map(function (sSelectedKey) {
                            return new Filter({
                                path: oFilterGroupItem.getName(),
                                operator: FilterOperator.Contains,
                                value1: sSelectedKey
                            });
                        });
     
                    if (aSelectedKeys.length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                    }
     
                    return aResult;
                }, []);
     
                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);
            },
     
            onFilterChange: function () {
                this._updateLabelsAndTable();
            },
     
            onAfterVariantLoad: function () {
                this._updateLabelsAndTable();
            },
     
     
            _updateLabelsAndTable: function () {
                this.oTable.setShowOverlay(true);
            }      
           
        });
    });