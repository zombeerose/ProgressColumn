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
 * @version 0.1 (June 30, 2011)
 * @param {Object} config 
 */
Ext.define('Ext.ux.grid.column.Progress', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.dvp_progresscolumn',
    
    cls: 'x-progress-column',
    
    groupable: false,
    
    /**
     * @cfg {String} progressCls
     * The base class for styling.
     * Defaults to 'x-progress' 
     */
    progressCls: 'x-progress',
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
            text, newWidth;
        
        newWidth = Math.floor(v * me.getWidth(true)); //me = column
        
        // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
        v = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || v : v;
        
        text = Ext.String.format(me.progressText,Math.round(v*100));
        
        meta.tdCls += ' ' + cls + ' ' + cls + '-' + me.ui;
        v = '<div class="' + cls + '-text ' + cls + '-text-back">' +
                '<div>' + text + '</div>' +
            '</div>' +
            '<div class="' + cls + '-bar" style="width: '+ newWidth + 'px;">' +
                '<div class="' + cls + '-text">' +
                    '<div>' + text + '</div>' +
                '</div>' +
            '</div>' 
        return v;
    }
}); //eo extend

//end of file