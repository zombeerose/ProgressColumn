/**
 * A Grid column type which renders a numeric value as a progress bar.
 * Values should be any number between 0 and 1 (e.g. 0.5), which is just like Ext.window.MessageBox#updateProgress.
 * 
 * Notes:
 * 
 * - Compatible with Ext 4.x
 * - The column can be at any index in the columns array, and a grid can have any number of progress columns.
 * 
 * Example usage:
        var grid = Ext.create('Ext.grid.Panel',{
            columns: [{
                dataIndex: 'progress'
                ,xtype: 'dvp_progresscolumn'
            },{
               ...
            ]}
            ...
        });
 * 
 * @author Phil Crawford
 * @license Licensed under the terms of the Open Source [LGPL 3.0 license](http://www.gnu.org/licenses/lgpl.html).  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission.
 * @version 1.0 (August 22, 2012)
 * @param {Object} config 
 */
Ext.define('Ext.ux.grid.column.Progress', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.dvp_progresscolumn',
    
    cls: 'x-progress-column',
    
    /**
     * @cfg {Array} brackets
     * Defines the different low & high ranges that correspond to each progress step. 
     * Specify either 2 values corresponding with low & high, or specify a single number 
     * that corresponds with the low value.  The high value will be assumed to be Number.MAX_VALUE.
     */
    brackets: [
        [0,24],
        [25,49],
        [50,74],
        [75,99],
        [100]
    ],
    /**
     * @cfg {Boolean} decimalValues
     * Set to true if the value being rendered will be a decimal between 0 and 1, such as .5, or  
     * set to false if the value will be an integer between 0 and 100, like 50. 
     */
    decimalValues: true,
    
    groupable: false,
    
    /**
     * @cfg {String} progressCls
     * The base class for styling.
     * Defaults to 'x-progress' 
     */
    progressCls: 'x-progress',
    /**
     * @cfg {String} progressStepCls
     * The class used for custom styling of each step.  The class should include a placeholder for the bracket number 
     * that the rendered value corresponds with.
     * 
     * The step indexes are zero-based, which should correspond with the CSS class names starting with 'x-progress-step-0'
     */
    progressStepCls: 'x-progress-step-{0}',
    /**
     * @cfg {String} progressText
     * The text for displaying the current percentage complete.  Includes a placeholder {0} for the number.
     * Defaults to '{0} %'
     */
    progressText: '{0} %',
    

    /**
     * @param {Object} value
     * @param {Object} meta
     * @param {Ext.data.Model} record
     * @return {String}
     */
    defaultRenderer: function(v, meta, record) {
        var me = this,
            cls = me.progressCls,
            stepCls, text, newWidth, decimal, whole;
        
        decimal = me.decimalValues ? v : (v / 100);
        whole = me.decimalValues ? (v * 100) : v;
        
        newWidth = Math.floor(decimal * me.getWidth(true)); //me = column
        
        // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
        v = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(me, arguments) || v : v;
        
        text = Ext.String.format(me.progressText,Math.round(whole));
        
        stepCls = me.getStepCls(whole);
        
        meta.tdCls += ' ' + cls + ' ' + cls + '-' + me.ui;
        v = '<div class="' + cls + '-text ' + cls + '-text-back">' +
                '<div>' + text + '</div>' +
            '</div>' +
            '<div class="' + cls + '-bar ' + stepCls + '" style="width: '+ newWidth + 'px;">' +
                '<div class="' + cls + '-text">' +
                    '<div>' + text + '</div>' +
                '</div>' +
            '</div>';

        return v;
    },
    
    /**
     * @private
     * @param {Number} value
     * @return {String}
     */
    getStepCls: function(v){
        var me = this,
            brackets = me.brackets,
            bracket,
            low,
            high,
            i = 0;
            
        for (; i < brackets.length; i++){
            bracket = brackets[i];
            //<DEBUG>
            if (!Ext.isArray(bracket) || Ext.isEmpty(bracket)){
                Ext.Error.raise('Invalid bracket configuration.  Each bracket must be an array containing 1 or 2 numeric values.');
            }
            if (bracket.length > 2){
                Ext.Error.raise('Invalid bracket configuration.  Each bracket should contain 2 values at most.');
            }
            //</DEBUG>
            low = bracket[0];
            high = (bracket.length > 1) ? bracket[1] : Number.MAX_VALUE;
            if (v >= low && v <= high){
                break;
            }
        }
        return Ext.String.format(me.progressStepCls,i);
    }
}); //eo extend

//end of file