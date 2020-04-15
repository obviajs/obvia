/*
    Normalize minified array of {columns[], rows[]} format to an array of objects
*/
function deminifyArray(obj)
{
    var ret = [];		
    
    var c_length = obj.columns.length;
    var r_length = obj.rows.length;
    for(var i=0;i<r_length;i++) 
    {
        var row = obj.rows[i];
        var c_row = {};
        for(var j=0;j<c_length;j++)
        {
            c_row[obj.columns[j]] = row[j];
        }
        ret.push(c_row);
    }
    return ret;
}

/*
    Provided an array of objects this function returns an object with column names and raw data rows
    If columns are not specified all members of each object will be taken
*/
function minifyArray(rows, columns)
{
    ret = {"columns":[], "rows":[]};
    if(rows!=null)
    {
        if(columns==undefinded)
        {
            columns = [];
            for(var column in rows[0])
            {
                columns.push(column);
            }
        }
        var r_length = rows.length;		
        var c_length = columns.length;	
        ret.columns = columns;

        s_rows = [];
        for(var i=0;i<r_length;i++)
        {
            var row = rows[i];
            s_row = [];
            for(var j=0;j<c_length;j++)
            {
                s_row.push(row[columns[j]]);
            }
            s_rows.push(s_row);
        }
        ret.rows = s_rows;
    }	
    return ret;
}