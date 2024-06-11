sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History , Filter, FilterOperator, FilterType, MessageBox) {
        "use strict";

        return Controller.extend("projectemployee.controller.Detail", {
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
                urlParameters:{
                    "$expand": "department"
                },
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
        onNavToDetails: function(oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var sID = oEvent.getSource().getCells()[0].getText();
            oRouter.navTo("Department", {ID: sID});
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
              oRouter.navTo("View1", {}, true);
            }
          
        },
        onPress: function (oEvent) {
			MessageToast.show(oEvent.getSource().getText());
		},



    onDelete: function(oEvent){
 
            var oTable = this.getView().byId("_IDGenTable1");
            var aSelectedItems = oTable.getSelectedItems();
            var aListData = [];

       
        aSelectedItems.forEach(function (oItem) {
            var oContext = oItem.getBindingContext("Employees");
            var oData = oContext.getObject();
            var oListItem = {
                ID: oData.ID,
                createdAt: oData.createdAt,
                createdBy: oData.createdBy,
                ContactTitle: oData.ContactTitle,
                modifiedAt: oData.modifiedAt,
                modifiedBy: oData.modifiedBy,
                name: oData.name,
                email_id: oData.email_id,
                manager: oData.manager,
                department_ID: oData.department_ID
            };
           
            var na = oListItem.ID;
            jQuery.ajax({
                type: "DELETE",
                contentType: "application/json",
                url: "/v2/odata/v4/employee-services/Employees(" + na + ")",
                //data: JSON.stringify(oListItem),
                success: function (data) {
                    MessageBox.success("Data IS DELETE");
                   
                },
                error: function (err) {
                    MessageBox.error("Error saving data to local database: " + err.responseText);
                }
            });
           
        });
    },

    onEdit:function(oEvent){
           
        if(oEvent.getSource().getText()==="Edit")
       {
            oEvent.getSource().setText("Submit");
            oEvent.getSource().getParent().getParent().getCells()[3].setEditable(true);
            oEvent.getSource().getParent().getParent().getCells()[5].setEditable(true);
        }
        else
        {

            oEvent.getSource().setText("Edit");
            oEvent.getSource().getParent().getParent().getCells()[3].setEditable(false);
            oEvent.getSource().getParent().getParent().getCells()[5].setEditable(false);
            var oInput = oEvent.getSource().getParent().getParent().getCells()[3].getValue();
            console.log(oInput);

           
           

            var oTable = this.getView().byId("_IDGenTable1");
            var aSelectedItems = oTable.getSelectedItems();
            var aListData = [];

   
            aSelectedItems.forEach(function (oItem) {
            var oContext = oItem.getBindingContext("Employees");
            var oData = oContext.getObject();
            console.log(oData.department_ID);
            var oListItem = {
                ID: oData.ID,
                createdAt: oData.createdAt,
                createdBy: oData.createdBy,
                ContactTitle: oData.ContactTitle,
                modifiedAt: oData.modifiedAt,
                modifiedBy: oData.modifiedBy,
                name: oData.name,
                email_id: oData.email_id,
                manager: oData.manager,
                department_ID: oData.department_ID
            };
       
            var na = oListItem.ID;

            jQuery.ajax({
                type: "PUT",
                contentType: "application/json",
                url: "/v2/odata/v4/employee-services/Employees(" + na + ")",
                data: JSON.stringify(oListItem),
                success: function (data) {
                    MessageBox.success("Data Updated successfully!");
                    window.location.reload();
                },
                error: function (err) {
                    MessageBox.error("Error Updating data: " + err.responseText);
                }
            });
       
       
            });
        }
    }

    });
});

