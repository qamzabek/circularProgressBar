var mpi = Math.PI;
var hpi = mpi / 2;
var wpi = mpi * 2;

function Origin(){
    this.ver15_or_later = (parseFloat(version.substr(0, 2)) >= 15); // CS5 or later
    this.ver14 = (version.substr(0, 2) == "14"); // CS4
    
    if(this.ver15_or_later){
        this.saved_coord_system = app.coordinateSystem;
        app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

        var idx  = app.activeDocument.artboards.getActiveArtboardIndex();
        this.ab  = app.activeDocument.artboards[idx];
        
        var o   = this.ab.rulerOrigin;
        var r   = this.ab.artboardRect;
        this.saved_origin = [o[0], o[1]];
        this.ab.rulerOrigin = [0, r[1] - r[3]];
        
    } else if(this.ver14){
        var o = app.activeDocument.rulerOrigin;
        this.saved_origin = [o[0], o[1]];
        app.activeDocument.rulerOrigin = [0, 0];
    }

    this.restore = function(){
        if(this.ver15_or_later){
            this.ab.rulerOrigin = this.saved_origin;
            app.coordinateSystem = this.saved_coord_system;
            
        } else if(this.ver14){
            app.activeDocument.rulerOrigin = this.saved_origin;
        }
    };
        
    return this;
}

var g_origin = Origin();

main();
g_origin.restore();

function main(){
    
    if (documents.length < 1) {
    return;
  }
    with(activeDocument.activeLayer){
    if(locked || ! visible){
      alert("Please select an unlocked and visible layer,\nthen run this script again.");
      return;
    }
  }


    var number_of_anchors = 100; 
    var radius  = 50;
    var percentage;
    percentage = prompt("percentage", percentage);
    percentage = parseInt(percentage);
    var handle_length, theta;
    theta = wpi / number_of_anchors;
    handle_length = radius * 4 / 3 * (1 - Math.cos(theta / 2)) / Math.sin(theta / 2);
  

    var pi = activeDocument.activeLayer.pathItems.add();
    var arr;
 
    for(var i = 0; i < percentage+1; i++){
    
        with(pi.pathPoints.add()){
        arr = [Math.cos(theta * i),
             Math.sin(theta * i)];
      
        anchor = [arr[0] * radius,
                arr[1] * radius];
      
        arr[0] *= handle_length;
        arr[1] *= handle_length;
      
        rightDirection = [anchor[0] - arr[1],
                        anchor[1] + arr[0]];
        leftDirection  = [anchor[0] + arr[1],
                        anchor[1] - arr[0]];}}

  with(pi){
    closed = false;
    filled = false;
    stroked = true;
    strokeColor = black();
    strokeWidth = 15;
    strokeCap = StrokeCap.ROUNDENDCAP;}
  
  with(activeDocument){
      pi.translate(width / 2, height / 2);}
}


function black(){
  var col = new GrayColor();
  col.gray = 100;
  return col;
}