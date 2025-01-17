sap.ui.define([
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function(Fragment, Controller, JSONModel) {
"use strict";

var PageController = Controller.extend("employeeadministration.controller.Page", {

    onInit: function (oEvent) {

        // set explored app's demo model on this sample
       
        oModel.attachRequestCompleted(function() {
            this.byId('edit').setEnabled(true);
        }.bind(this));
        this.getView().setModel(oModel);

        this.getView().bindElement("/Employees/0");

        this._formFragments = {};

        // Set the initial form to be the display one
        this._showFormFragment("Display");
    },

    handleEditPress : function () {

        //Clone the data
        this._oEmployee = Object.assign({}, this.getView().getModel().getData().Employees[0]);
        this._toggleButtonsAndView(true);

    },

    handleCancelPress : function () {

        //Restore the data
        var oModel = this.getView().getModel();
        var oData = oModel.getData();

        oData.Employees[0] = this._oSupplier;

        oModel.setData(oData);
        this._toggleButtonsAndView(false);

    },

    handleSavePress : function () {

        this._toggleButtonsAndView(false);

    },

    _toggleButtonsAndView : function (bEdit) {
        var oView = this.getView();

        // Show the appropriate action buttons
        oView.byId("edit").setVisible(!bEdit);
        oView.byId("save").setVisible(bEdit);
        oView.byId("cancel").setVisible(bEdit);

        // Set the right form type
        this._showFormFragment(bEdit ? "Change" : "Display");
    },

    _getFormFragment: function (sFragmentName) {
        var pFormFragment = this._formFragments[sFragmentName],
            oView = this.getView();

        if (!pFormFragment) {
            pFormFragment = Fragment.load({
                id: oView.getId(),
                name: "employeeadministration.fragment." + sFragmentName
            });
            this._formFragments[sFragmentName] = pFormFragment;
        }

        return pFormFragment;
    },

    _showFormFragment : function (sFragmentName) {
        var oPage = this.byId("Page");

        oPage.removeAllContent();
        this._getFormFragment(sFragmentName).then(function(oVBox){
            oPage.insertContent(oVBox);
        });
    }

});

return PageController;

});