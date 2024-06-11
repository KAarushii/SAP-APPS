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
         
       
        
        return Controller.extend("employeeadministration.controller.Create", {
            onInit: function () {
               
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
        
    });
