

class CanvasData{
    pointRadius = 15
    gridCellSize = new Vector2(this.pointRadius, this.pointRadius)
    points = 0

    constructor(){
        // Create HTML canvas
        this.canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d')
        
        // Background
        ctx.fillStyle = "#EEEEEE"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw grid
        for(let x=0; x<canvas.width/this.gridCellSize.x; x++){
            let col = x*this.gridCellSize.x
            this.drawLine(col, 0, col, canvas.height)
        }
        for(let y=0; y<canvas.width/this.gridCellSize.y; y++){
            let row = y*this.gridCellSize.y
            this.drawLine(0, row, canvas.width, row)
        }
        
        // Draw points on click
        let t = this
        this.canvas.addEventListener('mousedown', function(e) {
            t.drawPoint(e.offsetX, e.offsetY)
        })
    }

    drawPoint(x, y){
        let ctx = canvas.getContext("2d")
        ctx.beginPath();
        ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#111111"
        ctx.stroke();

        let fontSize = this.pointRadius.toString()
        ctx.font = fontSize+"px Arial";
        ctx.fillStyle = "#111111";
        ctx.fillText(this.points.toString(), x-fontSize*0.25, y+fontSize*0.25);
        
        this.points++
        console.log("DrawPoint: ", x,y)
    }

    drawLine(x1,y1, x2,y2){
        let ctx = canvas.getContext("2d")
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.strokeStyle = "#e4e4e4"
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }
}
